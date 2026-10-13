package it.arenahub.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.arenahub.backend.dto.IscrittoResponse;
import it.arenahub.backend.dto.SquadraIscrittaResponse;
import it.arenahub.backend.dto.StatoRequest;
import it.arenahub.backend.dto.StatoResponse;
import it.arenahub.backend.dto.TorneoDettaglioResponse;
import it.arenahub.backend.dto.TorneoRequest;
import it.arenahub.backend.dto.TorneoResponse;
import it.arenahub.backend.exception.ApiException;
import it.arenahub.backend.model.Categoria;
import it.arenahub.backend.model.Iscrizione;
import it.arenahub.backend.model.StatoTorneo;
import it.arenahub.backend.model.Torneo;
import it.arenahub.backend.repository.CategoriaRepository;
import it.arenahub.backend.repository.IscrizioneRepository;
import it.arenahub.backend.repository.SquadraRepository;
import it.arenahub.backend.repository.TorneoRepository;

@Service
public class TorneoAdminService {

	private final TorneoRepository torneoRepository;
	private final CategoriaRepository categoriaRepository;
	private final SquadraRepository squadraRepository;
	private final IscrizioneRepository iscrizioneRepository;

	public TorneoAdminService(TorneoRepository torneoRepository, CategoriaRepository categoriaRepository,
			SquadraRepository squadraRepository, IscrizioneRepository iscrizioneRepository) {
		this.torneoRepository = torneoRepository;
		this.categoriaRepository = categoriaRepository;
		this.squadraRepository = squadraRepository;
		this.iscrizioneRepository = iscrizioneRepository;
	}

	@Transactional
	public TorneoDettaglioResponse crea(TorneoRequest req) {
		Categoria categoria = controlla(req);
		Torneo torneo = new Torneo();
		applica(torneo, req, categoria);
		torneo.setStato(StatoTorneo.aperto);
		torneo = torneoRepository.save(torneo);
		return new TorneoDettaglioResponse(TorneoResponse.da(torneo, 0), null);
	}

	@Transactional
	public TorneoDettaglioResponse modifica(Integer id, TorneoRequest req) {
		Torneo torneo = trovaTorneo(id);
		Categoria categoria = controlla(req);
		if (torneo.getStato() == StatoTorneo.concluso) {
			throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, "Un torneo concluso non è modificabile");
		}
		int iscritti = squadraRepository.countByTorneoId(id);
		if (req.postiMax() < iscritti) {
			throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, "Posti inferiori alle squadre già iscritte");
		}
		boolean formatoCambiato = req.modalita() != torneo.getModalita()
				|| req.giocatoriPerSquadra() != torneo.getGiocatoriPerSquadra().intValue();
		if (iscritti > 0 && formatoCambiato) {
			throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT,
					"Modalità e giocatori per squadra non si modificano con iscrizioni presenti");
		}
		applica(torneo, req, categoria);
		torneo = torneoRepository.save(torneo);
		return new TorneoDettaglioResponse(TorneoResponse.da(torneo, iscritti), null);
	}

	@Transactional
	public StatoResponse cambiaStato(Integer id, StatoRequest req) {
		Torneo torneo = trovaTorneo(id);
		StatoTorneo nuovo;
		if (req != null && "chiuso".equals(req.stato())) {
			nuovo = StatoTorneo.chiuso;
		} else if (req != null && "concluso".equals(req.stato())) {
			nuovo = StatoTorneo.concluso;
		} else {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Dati non validi: stato non ammesso");
		}

		if (nuovo == StatoTorneo.chiuso && torneo.getStato() == StatoTorneo.aperto) {
			if (squadraRepository.countByTorneoId(id) < 2) {
				throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT,
						"Servono almeno 2 squadre iscritte per chiudere il torneo");
			}
		} else if (nuovo == StatoTorneo.concluso && torneo.getStato() == StatoTorneo.chiuso) {
			if (torneoRepository.haPartiteNonConcluse(id)) {
				throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, "Ci sono partite non concluse");
			}
		} else {
			throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, "Cambio di stato non consentito");
		}

		torneo.setStato(nuovo);
		torneoRepository.save(torneo);
		return new StatoResponse(torneo.getId(), torneo.getStato());
	}

	public List<SquadraIscrittaResponse> iscritti(Integer id) {
		trovaTorneo(id);
		return squadraRepository.findByTorneoIdOrderById(id).stream()
				.map(s -> {
					List<Iscrizione> iscrizioni = iscrizioneRepository.findBySquadraIdOrderById(s.getId());
					Integer idCapitano = s.getCapitano().getId();
					return new SquadraIscrittaResponse(
							s.getId(),
							s.getNome(),
							idCapitano,
							iscrizioni.stream()
									.filter(i -> i.getUtente().getId().equals(idCapitano))
									.map(Iscrizione::getData)
									.findFirst()
									.orElse(null),
							iscrizioni.stream().map(i -> IscrittoResponse.da(i.getUtente())).toList());
				})
				.toList();
	}

	private Categoria controlla(TorneoRequest req) {
		if (req.dataFine().isBefore(req.dataOra())) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Dati non validi: la data di fine precede l'inizio");
		}
		int giocatori = req.giocatoriPerSquadra();
		switch (req.modalita()) {
			case singolo -> {
				if (giocatori != 1) {
					throw new ApiException(HttpStatus.BAD_REQUEST,
							"Dati non validi: un torneo singolo ha 1 giocatore per squadra");
				}
			}
			case duo -> {
				if (giocatori != 2) {
					throw new ApiException(HttpStatus.BAD_REQUEST,
							"Dati non validi: un torneo duo ha 2 giocatori per squadra");
				}
			}
			case squadra -> {
				if (giocatori < 3) {
					throw new ApiException(HttpStatus.BAD_REQUEST,
							"Dati non validi: un torneo a squadre ha almeno 3 giocatori per squadra");
				}
			}
		}
		return categoriaRepository.findByNomeIgnoreCase(req.categoria())
				.orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Dati non validi: categoria inesistente"));
	}

	private void applica(Torneo torneo, TorneoRequest req, Categoria categoria) {
		torneo.setNome(req.nome());
		torneo.setDescrizione(req.descrizione());
		torneo.setGioco(req.gioco());
		torneo.setCategoria(categoria);
		torneo.setModalita(req.modalita());
		torneo.setGiocatoriPerSquadra(req.giocatoriPerSquadra().shortValue());
		torneo.setDataInizio(req.dataOra());
		torneo.setDataFine(req.dataFine());
		torneo.setPostiMax(req.postiMax());
		torneo.setFoto(req.foto());
	}

	private Torneo trovaTorneo(Integer id) {
		return torneoRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Torneo non trovato"));
	}
}
