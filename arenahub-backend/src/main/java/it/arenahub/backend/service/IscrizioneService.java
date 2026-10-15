package it.arenahub.backend.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.arenahub.backend.dto.ComponenteResponse;
import it.arenahub.backend.dto.IscrizioneRequest;
import it.arenahub.backend.dto.IscrizioneResponse;
import it.arenahub.backend.dto.SquadraResponse;
import it.arenahub.backend.exception.ApiException;
import it.arenahub.backend.model.Iscrizione;
import it.arenahub.backend.model.Modalita;
import it.arenahub.backend.model.Squadra;
import it.arenahub.backend.model.StatoTorneo;
import it.arenahub.backend.model.Torneo;
import it.arenahub.backend.model.Utente;
import it.arenahub.backend.repository.IscrizioneRepository;
import it.arenahub.backend.repository.SquadraRepository;
import it.arenahub.backend.repository.TorneoRepository;
import it.arenahub.backend.repository.UtenteRepository;

@Service
public class IscrizioneService {

	private final TorneoRepository torneoRepository;
	private final UtenteRepository utenteRepository;
	private final SquadraRepository squadraRepository;
	private final IscrizioneRepository iscrizioneRepository;
	private final ImpostazioneService impostazioneService;

	public IscrizioneService(TorneoRepository torneoRepository, UtenteRepository utenteRepository,
			SquadraRepository squadraRepository, IscrizioneRepository iscrizioneRepository,
			ImpostazioneService impostazioneService) {
		this.torneoRepository = torneoRepository;
		this.utenteRepository = utenteRepository;
		this.squadraRepository = squadraRepository;
		this.iscrizioneRepository = iscrizioneRepository;
		this.impostazioneService = impostazioneService;
	}

	@Transactional
	public IscrizioneResponse iscrivi(Integer idTorneo, Integer idUtente, IscrizioneRequest req) {
		Torneo torneo = torneoRepository.findByIdForUpdate(idTorneo)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Torneo non trovato"));
		Utente capitano = utenteRepository.findByIdForUpdate(idUtente)
				.orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Utente non autenticato"));

		if (iscrizioneRepository.existsByTorneoIdAndUtenteId(idTorneo, idUtente)) {
			throw new ApiException(HttpStatus.CONFLICT, "Sei già iscritto a questo torneo");
		}
		if (torneo.getStato() != StatoTorneo.aperto
				|| squadraRepository.countByTorneoId(idTorneo) >= torneo.getPostiMax()) {
			throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, "Torneo chiuso o senza posti liberi");
		}
		int limite = impostazioneService.maxTorneiAttivi();
		if (!impostazioneService.puoIscriversi(idUtente)) {
			throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT,
					"Hai già raggiunto il limite di " + limite + " tornei attivi");
		}

		String nomeSquadra;
		List<Utente> membri = new ArrayList<>();
		membri.add(capitano);

		if (torneo.getModalita() == Modalita.singolo) {
			nomeSquadra = capitano.getNome() + " " + capitano.getCognome();
		} else {
			String erroreSquadra = "La squadra deve avere " + torneo.getGiocatoriPerSquadra() + " componenti";
			nomeSquadra = req == null || req.squadraNome() == null ? "" : req.squadraNome().trim();
			List<String> email = req == null || req.componenti() == null ? List.of() : req.componenti();
			if (nomeSquadra.isEmpty() || nomeSquadra.length() > 60
					|| email.size() != torneo.getGiocatoriPerSquadra() - 1) {
				throw new ApiException(HttpStatus.BAD_REQUEST, erroreSquadra);
			}
			Set<String> emailViste = new HashSet<>();
			for (String e : email) {
				if (e == null || e.isBlank()) {
					throw new ApiException(HttpStatus.BAD_REQUEST, "Inserisci l'email di tutti i componenti");
				}
				String normalizzata = e.trim().toLowerCase();
				if (normalizzata.equals(capitano.getEmail().toLowerCase())) {
					throw new ApiException(HttpStatus.BAD_REQUEST, "Non puoi inserire la tua email");
				}
				if (!emailViste.add(normalizzata)) {
					throw new ApiException(HttpStatus.BAD_REQUEST, "Hai inserito due volte la stessa email");
				}
			}
			if (squadraRepository.existsByTorneoIdAndNomeIgnoreCase(idTorneo, nomeSquadra)) {
				throw new ApiException(HttpStatus.CONFLICT, "Nome squadra già usato in questo torneo");
			}
			for (String e : email) {
				Utente componente = utenteRepository.findByEmailIgnoreCase(e.trim())
						.orElseThrow(() -> new ApiException(HttpStatus.UNPROCESSABLE_CONTENT,
								e.trim() + " non è registrato: deve prima creare un account"));
				if (iscrizioneRepository.existsByTorneoIdAndUtenteId(idTorneo, componente.getId())) {
					throw new ApiException(HttpStatus.CONFLICT,
							componente.getNome() + " " + componente.getCognome() + " è già iscritto a questo torneo");
				}
				if (!impostazioneService.puoIscriversi(componente.getId())) {
					throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, componente.getNome() + " "
							+ componente.getCognome() + " ha già raggiunto il limite di " + limite + " tornei attivi");
				}
				membri.add(componente);
			}
		}

		Squadra squadra = squadraRepository.save(new Squadra(torneo, nomeSquadra, capitano));
		List<Iscrizione> iscrizioni = membri.stream()
				.map(u -> new Iscrizione(torneo, u, squadra))
				.toList();
		iscrizioneRepository.saveAll(iscrizioni);

		List<ComponenteResponse> componenti = membri.stream().map(ComponenteResponse::da).toList();
		return new IscrizioneResponse(idTorneo, iscrizioni.get(0).getData(), SquadraResponse.da(squadra, componenti));
	}

	@Transactional
	public void annulla(Integer idTorneo, Integer idUtente) {
		Torneo torneo = trovaTorneo(idTorneo);
		Iscrizione iscrizione = iscrizioneRepository.findByTorneoIdAndUtenteId(idTorneo, idUtente)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Iscrizione non trovata"));
		if (torneo.getStato() != StatoTorneo.aperto) {
			throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, "Il torneo non è più aperto");
		}
		Squadra squadra = iscrizione.getSquadra();
		if (!squadra.getCapitano().getId().equals(idUtente)) {
			throw new ApiException(HttpStatus.FORBIDDEN, "Solo il capitano può annullare l'iscrizione della squadra");
		}
		iscrizioneRepository.deleteAll(iscrizioneRepository.findBySquadraIdOrderById(squadra.getId()));
		squadraRepository.delete(squadra);
	}

	private Torneo trovaTorneo(Integer idTorneo) {
		return torneoRepository.findById(idTorneo)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Torneo non trovato"));
	}
}
