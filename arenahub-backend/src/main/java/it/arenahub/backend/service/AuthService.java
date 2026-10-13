package it.arenahub.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import it.arenahub.backend.dto.RegistrazioneRequest;
import it.arenahub.backend.dto.UtenteResponse;
import it.arenahub.backend.exception.ApiException;
import it.arenahub.backend.model.Ruolo;
import it.arenahub.backend.model.Utente;
import it.arenahub.backend.repository.UtenteRepository;

@Service
public class AuthService {

	private final UtenteRepository utenteRepository;
	private final PasswordEncoder passwordEncoder;

	public AuthService(UtenteRepository utenteRepository, PasswordEncoder passwordEncoder) {
		this.utenteRepository = utenteRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public UtenteResponse registra(RegistrazioneRequest req) {
		if (utenteRepository.existsByEmailIgnoreCase(req.email())) {
			throw new ApiException(HttpStatus.CONFLICT, "Email già in uso");
		}
		Utente utente = new Utente(req.nome(), req.cognome(), req.email(),
				passwordEncoder.encode(req.password()), Ruolo.UTENTE);
		return UtenteResponse.da(utenteRepository.save(utente));
	}
}
