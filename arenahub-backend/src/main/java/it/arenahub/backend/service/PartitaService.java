package it.arenahub.backend.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.arenahub.backend.dto.GiocatorePuntiResponse;
import it.arenahub.backend.dto.MiaPartitaResponse;
import it.arenahub.backend.dto.PartitaDettaglioResponse;
import it.arenahub.backend.dto.PartitaRequest;
import it.arenahub.backend.dto.PartitaResponse;
import it.arenahub.backend.dto.PunteggioSquadraResponse;
import it.arenahub.backend.dto.PuntiRequest;
import it.arenahub.backend.dto.SquadraPartitaResponse;
import it.arenahub.backend.exception.ApiException;
import it.arenahub.backend.model.Iscrizione;
import it.arenahub.backend.model.Partita;
import it.arenahub.backend.model.PartitaSquadra;
import it.arenahub.backend.model.PuntiGiocatore;
import it.arenahub.backend.model.Squadra;
import it.arenahub.backend.model.StatoPartita;
import it.arenahub.backend.model.StatoTorneo;
import it.arenahub.backend.model.Torneo;
import it.arenahub.backend.repository.IscrizioneRepository;
import it.arenahub.backend.repository.PartitaRepository;
import it.arenahub.backend.repository.PartitaSquadraRepository;
import it.arenahub.backend.repository.PuntiGiocatoreRepository;
import it.arenahub.backend.repository.SquadraRepository;
import it.arenahub.backend.repository.TorneoRepository;
import it.arenahub.backend.repository.UtenteRepository;

@Service
public class PartitaService {

	private static final String PUNTI_NEGATIVI = "Dati non validi: i punti non possono essere negativi";

	private final PartitaRepository partitaRepository;
	private final PartitaSquadraRepository partitaSquadraRepository;
	private final PuntiGiocatoreRepository puntiGiocatoreRepository;
	private final TorneoRepository torneoRepository;
	private final SquadraRepository squadraRepository;
	private final IscrizioneRepository iscrizioneRepository;
	private final UtenteRepository utenteRepository;

	public PartitaService(PartitaRepository partitaRepository, PartitaSquadraRepository partitaSquadraRepository,
			PuntiGiocatoreRepository puntiGiocatoreRepository, TorneoRepository torneoRepository,
			SquadraRepository squadraRepository, IscrizioneRepository iscrizioneRepository,
			UtenteRepository utenteRepository) {
		this.partitaRepository = partitaRepository;
		this.partitaSquadraRepository = partitaSquadraRepository;
		this.puntiGiocatoreRepository = puntiGiocatoreRepository;
		this.torneoRepository = torneoRepository;
		this.squadraRepository = squadraRepository;
		this.iscrizioneRepository = iscrizioneRepository;
		this.utenteRepository = utenteRepository;
	}

	public List<PartitaResponse> elenco(Integer idTorneo) {
		if (!torneoRepository.existsById(idTorneo)) {
			throw new ApiException(HttpStatus.NOT_FOUND, "Torneo non trovato");
		}
		return partitaRepository.findByTorneoIdOrderByDataOraAscIdAsc(idTorneo).stream()
				.map(this::riepilogo)
				.toList();
	}

	@Transactional
	public PartitaResponse crea(Integer idTorneo, PartitaRequest req) {
		Torneo torneo = torneoRepository.findById(idTorneo)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Torneo non trovato"));
		List<Integer> idSquadre = req.squadre();
		if (idSquadre == null || idSquadre.size() < 2 || new HashSet<>(idSquadre).size() != idSquadre.size()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Una partita richiede almeno 2 squadre");
		}
		if (idSquadre.contains(null)) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Dati non validi");
		}
		if (torneo.getStato() != StatoTorneo.chiuso) {
			throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, "Le partite si creano a torneo chiuso");
		}
		List<Squadra> squadre = idSquadre.stream()
				.map(id -> squadraRepository.findById(id)
						.filter(s -> s.getTorneo().getId().equals(idTorneo))
						.orElseThrow(() -> new ApiException(HttpStatus.UNPROCESSABLE_CONTENT,
								"La squadra " + id + " non è iscritta a questo torneo")))
				.toList();

		Partita partita = partitaRepository.save(new Partita(torneo, req.turno(), req.dataOra()));
		partitaSquadraRepository.saveAll(squadre.stream().map(s -> new PartitaSquadra(partita, s)).toList());
		return riepilogo(partita);
	}

	public PartitaDettaglioResponse dettaglio(Integer id) {
		Partita partita = trovaPartita(id);
		Map<Integer, Integer> puntiGiocatori = puntiGiocatoreRepository.findByPartitaId(id).stream()
				.collect(Collectors.toMap(pg -> pg.getUtente().getId(), PuntiGiocatore::getPunti));
		List<SquadraPartitaResponse> squadre = partitaSquadraRepository.findByPartitaIdOrderBySquadraId(id).stream()
				.map(ps -> new SquadraPartitaResponse(
						ps.getSquadra().getId(),
						ps.getSquadra().getNome(),
						ps.getPunti(),
						iscrizioneRepository.findBySquadraIdOrderById(ps.getSquadra().getId()).stream()
								.map(i -> new GiocatorePuntiResponse(i.getUtente().getId(), i.getUtente().getNome(),
										i.getUtente().getCognome(), puntiGiocatori.get(i.getUtente().getId())))
								.toList()))
				.toList();
		return new PartitaDettaglioResponse(partita.getId(), partita.getTorneo().getId(), partita.getTorneo().getNome(),
				partita.getTurno(), partita.getDataOra(), partita.getStato(), squadre);
	}

	@Transactional
	public PartitaDettaglioResponse inserisciPunti(Integer id, PuntiRequest req) {
		Partita partita = trovaPartita(id);
		if (partita.getTorneo().getStato() == StatoTorneo.concluso) {
			throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT,
					"Il torneo è concluso: i punti non sono più modificabili");
		}
		if (req == null || req.squadre() == null) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Indicare i punti di tutte le squadre della partita");
		}

		Map<Integer, PartitaSquadra> squadreInPartita = new HashMap<>();
		for (PartitaSquadra ps : partitaSquadraRepository.findByPartitaIdOrderBySquadraId(id)) {
			squadreInPartita.put(ps.getSquadra().getId(), ps);
		}

		Set<Integer> squadreViste = new HashSet<>();
		for (PuntiRequest.SquadraPunti sp : req.squadre()) {
			if (sp == null || sp.squadraId() == null || sp.punti() == null) {
				throw new ApiException(HttpStatus.BAD_REQUEST, "Dati non validi");
			}
			if (!squadreInPartita.containsKey(sp.squadraId())) {
				throw new ApiException(HttpStatus.BAD_REQUEST, "La squadra " + sp.squadraId() + " non gioca questa partita");
			}
			if (sp.punti() < 0) {
				throw new ApiException(HttpStatus.BAD_REQUEST, PUNTI_NEGATIVI);
			}
			if (!squadreViste.add(sp.squadraId())) {
				throw new ApiException(HttpStatus.BAD_REQUEST, "Indicare i punti di tutte le squadre della partita");
			}
			if (sp.giocatori() != null) {
				controllaGiocatori(sp);
			}
		}
		if (squadreViste.size() != squadreInPartita.size()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Indicare i punti di tutte le squadre della partita");
		}

		for (PuntiRequest.SquadraPunti sp : req.squadre()) {
			PartitaSquadra ps = squadreInPartita.get(sp.squadraId());
			ps.setPunti(sp.punti());
			puntiGiocatoreRepository.cancellaPuntiSquadra(id, sp.squadraId());
			if (sp.giocatori() != null) {
				for (PuntiRequest.GiocatorePunti g : sp.giocatori()) {
					puntiGiocatoreRepository.save(new PuntiGiocatore(partita,
							utenteRepository.getReferenceById(g.utenteId()), ps.getSquadra(), g.punti()));
				}
			}
		}
		if (Boolean.TRUE.equals(req.concludi())) {
			partita.setStato(StatoPartita.conclusa);
		}
		partitaRepository.save(partita);
		return dettaglio(id);
	}

	private void controllaGiocatori(PuntiRequest.SquadraPunti sp) {
		Set<Integer> componenti = iscrizioneRepository.findBySquadraIdOrderById(sp.squadraId()).stream()
				.map(i -> i.getUtente().getId())
				.collect(Collectors.toSet());
		Set<Integer> giocatoriVisti = new HashSet<>();
		for (PuntiRequest.GiocatorePunti g : sp.giocatori()) {
			if (g == null || g.utenteId() == null || g.punti() == null) {
				throw new ApiException(HttpStatus.BAD_REQUEST, "Dati non validi");
			}
			if (g.punti() < 0) {
				throw new ApiException(HttpStatus.BAD_REQUEST, PUNTI_NEGATIVI);
			}
			if (!componenti.contains(g.utenteId())) {
				throw new ApiException(HttpStatus.BAD_REQUEST,
						"Il giocatore " + g.utenteId() + " non fa parte della squadra " + sp.squadraId());
			}
			if (!giocatoriVisti.add(g.utenteId())) {
				throw new ApiException(HttpStatus.BAD_REQUEST,
						"Indicare i punti di tutti i componenti della squadra o di nessuno");
			}
		}
		if (giocatoriVisti.size() != componenti.size()) {
			throw new ApiException(HttpStatus.BAD_REQUEST,
					"Indicare i punti di tutti i componenti della squadra o di nessuno");
		}
	}

	public List<MiaPartitaResponse> miePartite(Integer idUtente, Integer torneoId, StatoPartita stato) {
		if (torneoId != null && !torneoRepository.existsById(torneoId)) {
			throw new ApiException(HttpStatus.NOT_FOUND, "Torneo non trovato");
		}
		List<MiaPartitaResponse> partite = new ArrayList<>();
		for (Iscrizione iscrizione : iscrizioneRepository.findByUtenteId(idUtente)) {
			for (PartitaSquadra ps : partitaSquadraRepository.findBySquadraId(iscrizione.getSquadra().getId())) {
				Partita p = ps.getPartita();
				boolean torneoOk = torneoId == null || p.getTorneo().getId().equals(torneoId);
				boolean statoOk = stato == null || p.getStato() == stato;
				if (torneoOk && statoOk) {
					Integer mieiPunti = puntiGiocatoreRepository.findByPartitaIdAndUtenteId(p.getId(), idUtente)
							.map(PuntiGiocatore::getPunti)
							.orElse(ps.getPunti());
					partite.add(new MiaPartitaResponse(p.getId(), p.getTorneo().getId(), p.getTorneo().getNome(),
							p.getTurno(), p.getDataOra(), p.getStato(), ps.getSquadra().getId(), mieiPunti,
							riepilogo(p).squadre()));
				}
			}
		}
		partite.sort(Comparator.comparing(MiaPartitaResponse::dataOra, Comparator.nullsLast(Comparator.reverseOrder())));
		return partite;
	}

	private PartitaResponse riepilogo(Partita p) {
		List<PunteggioSquadraResponse> squadre = partitaSquadraRepository.findByPartitaIdOrderBySquadraId(p.getId()).stream()
				.map(ps -> new PunteggioSquadraResponse(ps.getSquadra().getId(), ps.getSquadra().getNome(), ps.getPunti()))
				.toList();
		return new PartitaResponse(p.getId(), p.getTorneo().getId(), p.getTurno(), p.getDataOra(), p.getStato(), squadre);
	}

	private Partita trovaPartita(Integer id) {
		return partitaRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Partita non trovata"));
	}
}
