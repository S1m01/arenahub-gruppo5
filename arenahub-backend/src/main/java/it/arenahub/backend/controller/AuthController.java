package it.arenahub.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.arenahub.backend.dto.LoginRequest;
import it.arenahub.backend.dto.LoginResponse;
import it.arenahub.backend.dto.RegistrazioneRequest;
import it.arenahub.backend.dto.UtenteResponse;
import it.arenahub.backend.model.Utente;
import it.arenahub.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;
	private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/registrazione")
	@ResponseStatus(HttpStatus.CREATED)
	public UtenteResponse registrazione(@Valid @RequestBody RegistrazioneRequest req,
			HttpServletRequest request, HttpServletResponse response) {
		Utente utente = authService.registra(req);
		apriSessione(utente, request, response);
		return UtenteResponse.da(utente);
	}

	@PostMapping("/login")
	public LoginResponse login(@Valid @RequestBody LoginRequest req,
			HttpServletRequest request, HttpServletResponse response) {
		Utente utente = authService.login(req);
		apriSessione(utente, request, response);
		return LoginResponse.da(utente);
	}

	private void apriSessione(Utente utente, HttpServletRequest request, HttpServletResponse response) {
		UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
				utente.getId(), null, List.of(new SimpleGrantedAuthority("ROLE_" + utente.getRuolo().name())));
		SecurityContext context = SecurityContextHolder.createEmptyContext();
		context.setAuthentication(auth);
		SecurityContextHolder.setContext(context);
		securityContextRepository.saveContext(context, request, response);
	}

	@PostMapping("/logout")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void logout(HttpServletRequest request) {
		HttpSession sessione = request.getSession(false);
		if (sessione != null) {
			sessione.invalidate();
		}
		SecurityContextHolder.clearContext();
	}

	@GetMapping("/me")
	public UtenteResponse me(@AuthenticationPrincipal Integer idUtente) {
		return authService.me(idUtente);
	}
}
