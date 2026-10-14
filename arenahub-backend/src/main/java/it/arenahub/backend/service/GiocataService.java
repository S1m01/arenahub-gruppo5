package it.arenahub.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import it.arenahub.backend.dto.GiocataRequest;
import it.arenahub.backend.dto.GiocataResponse;
import it.arenahub.backend.exception.ApiException;
import it.arenahub.backend.model.Categoria;
import it.arenahub.backend.model.Giocata;
import it.arenahub.backend.model.Partita;
import it.arenahub.backend.model.Torneo;
import it.arenahub.backend.model.Utente;
import it.arenahub.backend.repository.CategoriaRepository;
import it.arenahub.backend.repository.GiocataRepository;
import it.arenahub.backend.repository.PartitaRepository;
import it.arenahub.backend.repository.TorneoRepository;
import it.arenahub.backend.repository.UtenteRepository;

@Service
public class GiocataService {

	private final GiocataRepository giocataRepository;
	private final TorneoRepository torneoRepository;
	private final CategoriaRepository categoriaRepository;
	private final PartitaRepository partitaRepository;
	private final UtenteRepository utenteRepository;

	public GiocataService(GiocataRepository giocataRepository, TorneoRepository torneoRepository,
			CategoriaRepository categoriaRepository, PartitaRepository partitaRepository,
			UtenteRepository utenteRepository) {
		this.giocataRepository = giocataRepository;
		this.torneoRepository = torneoRepository;
		this.categoriaRepository = categoriaRepository;
		this.partitaRepository = partitaRepository;
		this.utenteRepository = utenteRepository;
	}

	public List<GiocataResponse> elenco(Integer torneoId, String categoria) {
		if (torneoId != null && !torneoRepository.existsById(torneoId)) {
			throw new ApiException(HttpStatus.NOT_FOUND, "Torneo non trovato");
		}
		Categoria categoriaScelta = null;
		if (categoria != null) {
			categoriaScelta = categoriaRepository.findByNomeIgnoreCase(categoria)
					.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Categoria non trovata"));
		}

		List<GiocataResponse> giocate = new ArrayList<>();
		for (Giocata g : giocataRepository.findAllByOrderByIdDesc()) {
			Torneo torneo = g.getTorneo();
			boolean torneoOk = torneoId == null || torneo.getId().equals(torneoId);
			boolean categoriaOk = categoriaScelta == null || torneo.getCategoria().getId().equals(categoriaScelta.getId());
			if (torneoOk && categoriaOk) {
				giocate.add(risposta(g));
			}
		}
		return giocate;
	}

	public GiocataResponse crea(Integer idTorneo, GiocataRequest req) {
		Torneo torneo = torneoRepository.findById(idTorneo)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Torneo non trovato"));
		if (req.fineSec() <= req.inizioSec()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "La fine deve essere dopo l'inizio");
		}

		Partita partita = null;
		if (req.partitaId() != null) {
			partita = partitaRepository.findById(req.partitaId())
					.filter(p -> p.getTorneo().getId().equals(idTorneo))
					.orElseThrow(() -> new ApiException(HttpStatus.UNPROCESSABLE_CONTENT,
							"La partita " + req.partitaId() + " non appartiene a questo torneo"));
		}

		Utente utente = null;
		if (req.utenteId() != null) {
			utente = utenteRepository.findById(req.utenteId())
					.orElseThrow(() -> new ApiException(HttpStatus.UNPROCESSABLE_CONTENT,
							"Il giocatore " + req.utenteId() + " non esiste"));
		}

		Giocata giocata = new Giocata(torneo, partita, utente, req.titolo().trim(), req.youtubeId().trim(),
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
		Integer partitaId = null;
		String turno = null;
		if (g.getPartita() != null) {
			partitaId = g.getPartita().getId();
			turno = g.getPartita().getTurno();
		}

		Integer utenteId = null;
		String giocatore = null;
		if (g.getUtente() != null) {
			utenteId = g.getUtente().getId();
			giocatore = g.getUtente().getNome() + " " + g.getUtente().getCognome();
		}

		return new GiocataResponse(g.getId(), g.getTorneo().getId(), g.getTorneo().getNome(), g.getTitolo(),
				g.getYoutubeId(), g.getInizioSec(), g.getFineSec(), partitaId, turno, utenteId, giocatore);
	}
}
