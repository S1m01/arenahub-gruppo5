package it.arenahub.backend.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.arenahub.backend.dto.CambioPasswordRequest;
import it.arenahub.backend.dto.CercaUtenteResponse;
import it.arenahub.backend.dto.MiaSquadraResponse;
import it.arenahub.backend.dto.MioTorneoResponse;
import it.arenahub.backend.dto.ProfiloRequest;
import it.arenahub.backend.dto.StatisticheResponse;
import it.arenahub.backend.dto.TorneoResponse;
import it.arenahub.backend.dto.UtenteResponse;
import it.arenahub.backend.exception.ApiException;
import it.arenahub.backend.model.Iscrizione;
import it.arenahub.backend.model.Torneo;
import it.arenahub.backend.model.Utente;
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
	private final PasswordEncoder passwordEncoder;
	private final ImpostazioneService impostazioneService;

	public UtenteService(UtenteRepository utenteRepository, IscrizioneRepository iscrizioneRepository,
			SquadraRepository squadraRepository, TorneoRepository torneoRepository, PasswordEncoder passwordEncoder,
			ImpostazioneService impostazioneService) {
		this.utenteRepository = utenteRepository;
		this.iscrizioneRepository = iscrizioneRepository;
		this.squadraRepository = squadraRepository;
		this.torneoRepository = torneoRepository;
		this.passwordEncoder = passwordEncoder;
		this.impostazioneService = impostazioneService;
	}

	@Transactional
	public UtenteResponse modificaProfilo(Integer idUtente, ProfiloRequest req) {
		Utente utente = trovaUtente(idUtente);
		if (utenteRepository.existsByEmailIgnoreCaseAndIdNot(req.email(), idUtente)) {
			throw new ApiException(HttpStatus.CONFLICT, "Email già in uso");
		}
		utente.setNome(req.nome());
		utente.setCognome(req.cognome());
		utente.setEmail(req.email());
		return UtenteResponse.da(utenteRepository.save(utente));
	}

	@Transactional
	public void cambiaPassword(Integer idUtente, CambioPasswordRequest req) {
		Utente utente = trovaUtente(idUtente);
		if (!passwordEncoder.matches(req.passwordAttuale(), utente.getPasswordHash())) {
			throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, "Password attuale errata");
		}
		utente.setPasswordHash(passwordEncoder.encode(req.passwordNuova()));
		utenteRepository.save(utente);
	}

	private Utente trovaUtente(Integer idUtente) {
		return utenteRepository.findById(idUtente)
				.orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Utente non autenticato"));
	}

	public CercaUtenteResponse cerca(String email) {
		if (email == null || email.isBlank()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Parametro non valido");
		}
		Utente utente = utenteRepository.findByEmailIgnoreCase(email.trim())
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Utente non registrato"));
		return new CercaUtenteResponse(utente.getId(), utente.getNome(), utente.getCognome(),
				impostazioneService.puoIscriversi(utente.getId()));
	}

	public List<MioTorneoResponse> mieiTornei(Integer idUtente) {
		return iscrizioneRepository.findByUtenteId(idUtente).stream()
				.sorted(Comparator.comparing((Iscrizione i) -> i.getTorneo().getDataInizio()).reversed())
				.map(i -> mioTorneo(i, idUtente))
				.toList();
	}

	public StatisticheResponse statistiche(Integer idUtente) {
		Long punti = utenteRepository.puntiTotali(idUtente);
		if (punti == null) {
			punti = 0L;
		}
		return new StatisticheResponse(
				punti,
				utenteRepository.posizioneGenerale(idUtente),
				iscrizioneRepository.countByUtenteId(idUtente),
				impostazioneService.torneiAttivi(idUtente),
				impostazioneService.maxTorneiAttivi(),
				utenteRepository.contaPartite(idUtente, "conclusa"),
				utenteRepository.contaPartite(idUtente, "programmata"),
				utenteRepository.puntiPerCategoria(idUtente));
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
