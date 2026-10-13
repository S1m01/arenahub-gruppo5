package it.arenahub.backend.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import it.arenahub.backend.dto.ComponenteResponse;
import it.arenahub.backend.dto.MiaSquadraResponse;
import it.arenahub.backend.dto.MioTorneoResponse;
import it.arenahub.backend.dto.TorneoResponse;
import it.arenahub.backend.exception.ApiException;
import it.arenahub.backend.model.Iscrizione;
import it.arenahub.backend.model.Torneo;
import it.arenahub.backend.repository.IscrizioneRepository;
import it.arenahub.backend.repository.SquadraRepository;
import it.arenahub.backend.repository.TorneoRepository;
import it.arenahub.backend.repository.UtenteRepository;

@Service
public class UtenteService {

	private final UtenteRepository utenteRepository;
	private final IscrizioneRepository iscrizioneRepository;
	private final SquadraRepository squadraRepository;
	private final TorneoRepository torneoRepository;

	public UtenteService(UtenteRepository utenteRepository, IscrizioneRepository iscrizioneRepository,
			SquadraRepository squadraRepository, TorneoRepository torneoRepository) {
		this.utenteRepository = utenteRepository;
		this.iscrizioneRepository = iscrizioneRepository;
		this.squadraRepository = squadraRepository;
		this.torneoRepository = torneoRepository;
	}

	public ComponenteResponse cerca(String email) {
		if (email == null || email.isBlank()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Parametro non valido");
		}
		return utenteRepository.findByEmailIgnoreCase(email.trim())
				.map(ComponenteResponse::da)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Utente non registrato"));
	}

	public List<MioTorneoResponse> mieiTornei(Integer idUtente) {
		return iscrizioneRepository.findByUtenteId(idUtente).stream()
				.sorted(Comparator.comparing((Iscrizione i) -> i.getTorneo().getDataInizio()).reversed())
				.map(i -> mioTorneo(i, idUtente))
				.toList();
	}

	private MioTorneoResponse mioTorneo(Iscrizione iscrizione, Integer idUtente) {
		Torneo torneo = iscrizione.getTorneo();
		Integer punti = null;
		Integer posizione = null;
		if (torneoRepository.haPartiteConcluse(torneo.getId())) {
			Long p = torneoRepository.puntiGiocatore(torneo.getId(), idUtente);
			Long pos = torneoRepository.posizioneSquadra(torneo.getId(), iscrizione.getSquadra().getId());
			punti = p == null ? 0 : p.intValue();
			posizione = pos == null ? null : pos.intValue();
		}
		return new MioTorneoResponse(
				TorneoResponse.da(torneo, squadraRepository.countByTorneoId(torneo.getId())),
				MiaSquadraResponse.da(iscrizione.getSquadra(), idUtente),
				iscrizione.getData(),
				punti,
				posizione);
	}
}
