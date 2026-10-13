package it.arenahub.backend.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import it.arenahub.backend.dto.ComponenteResponse;
import it.arenahub.backend.dto.MioTorneoResponse;
import it.arenahub.backend.service.UtenteService;

@RestController
@RequestMapping("/api/utenti")
public class UtenteController {

	private final UtenteService utenteService;

	public UtenteController(UtenteService utenteService) {
		this.utenteService = utenteService;
	}

	@GetMapping("/cerca")
	public ComponenteResponse cerca(@RequestParam(required = false) String email) {
		return utenteService.cerca(email);
	}

	@GetMapping("/me/tornei")
	public List<MioTorneoResponse> mieiTornei(@AuthenticationPrincipal Integer idUtente) {
		return utenteService.mieiTornei(idUtente);
	}
}
