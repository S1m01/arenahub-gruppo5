package it.arenahub.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import it.arenahub.backend.dto.LoginRequest;
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

	public Utente registra(RegistrazioneRequest req) {
		if (utenteRepository.existsByEmailIgnoreCase(req.email())) {
			throw new ApiException(HttpStatus.CONFLICT, "Email già in uso");
		}
		Utente utente = new Utente(req.nome(), req.cognome(), req.email(),
				passwordEncoder.encode(req.password()), Ruolo.UTENTE);
		return utenteRepository.save(utente);
	}

	public Utente login(LoginRequest req) {
		return utenteRepository.findByEmailIgnoreCase(req.email())
				.filter(u -> passwordEncoder.matches(req.password(), u.getPasswordHash()))
				.orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Email o password errate"));
	}

	public UtenteResponse me(Integer idUtente) {
		return utenteRepository.findById(idUtente)
				.map(UtenteResponse::da)
				.orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Utente non autenticato"));
	}
}
