package it.arenahub.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import it.arenahub.backend.dto.GiocataRequest;
import it.arenahub.backend.dto.GiocataResponse;
import it.arenahub.backend.exception.ApiException;
import it.arenahub.backend.model.Giocata;
import it.arenahub.backend.model.Partita;
import it.arenahub.backend.model.Torneo;
import it.arenahub.backend.model.Utente;
import it.arenahub.backend.repository.GiocataRepository;
import it.arenahub.backend.repository.IscrizioneRepository;
import it.arenahub.backend.repository.PartitaRepository;
import it.arenahub.backend.repository.TorneoRepository;

@Service
public class GiocataService {

	private final GiocataRepository giocataRepository;
	private final TorneoRepository torneoRepository;
	private final PartitaRepository partitaRepository;
	private final IscrizioneRepository iscrizioneRepository;

	public GiocataService(GiocataRepository giocataRepository, TorneoRepository torneoRepository,
			PartitaRepository partitaRepository, IscrizioneRepository iscrizioneRepository) {
		this.giocataRepository = giocataRepository;
		this.torneoRepository = torneoRepository;
		this.partitaRepository = partitaRepository;
		this.iscrizioneRepository = iscrizioneRepository;
	}

	public List<GiocataResponse> elenco(Integer torneoId) {
		List<Giocata> giocate;
		if (torneoId == null) {
			giocate = giocataRepository.findAllByOrderByIdDesc();
		} else {
			giocate = giocataRepository.findByTorneoIdOrderByIdDesc(torneoId);
		}
		return giocate.stream().map(this::risposta).toList();
	}

	public GiocataResponse crea(Integer idTorneo, GiocataRequest req) {
		Torneo torneo = torneoRepository.findById(idTorneo)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Torneo non trovato"));
		if (req.fineSec() <= req.inizioSec()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Dati non validi: la fine deve essere dopo l'inizio");
		}

		Partita partita = null;
		if (req.partitaId() != null) {
			partita = partitaRepository.findById(req.partitaId())
					.filter(p -> p.getTorneo().getId().equals(idTorneo))
					.orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "La partita non è di questo torneo"));
		}

		Utente utente = null;
		if (req.utenteId() != null) {
			utente = iscrizioneRepository.findByTorneoIdAndUtenteId(idTorneo, req.utenteId())
					.orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Il giocatore non è iscritto a questo torneo"))
					.getUtente();
		}

		Giocata giocata = new Giocata(torneo, partita, utente, req.titolo().trim(), req.idYoutube().trim(),
				req.inizioSec(), req.fineSec());
		return risposta(giocataRepository.save(giocata));
	}

	public void elimina(Integer id) {
		if (!giocataRepository.existsById(id)) {
			throw new ApiException(HttpStatus.NOT_FOUND, "Giocata non trovata");
		}
		giocataRepository.deleteById(id);
	}

	private GiocataResponse risposta(Giocata g) {
		Torneo torneo = g.getTorneo();

		Integer partitaId = null;
		String turno = null;
		if (g.getPartita() != null) {
			partitaId = g.getPartita().getId();
			turno = g.getPartita().getTurno();
		}

		String giocatore = null;
		String squadra = null;
		if (g.getUtente() != null) {
			giocatore = g.getUtente().getNome() + " " + g.getUtente().getCognome();
			squadra = iscrizioneRepository.findByTorneoIdAndUtenteId(torneo.getId(), g.getUtente().getId())
					.map(i -> i.getSquadra().getNome())
					.orElse(null);
		}

		return new GiocataResponse(g.getId(), torneo.getId(), torneo.getNome(), torneo.getCategoria().getNome(),
				partitaId, turno, g.getTitolo(), g.getIdYoutube(), g.getInizioSec(), g.getFineSec(), giocatore, squadra);
	}
}
