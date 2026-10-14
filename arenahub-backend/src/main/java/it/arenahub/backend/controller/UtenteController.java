package it.arenahub.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.arenahub.backend.dto.CambioPasswordRequest;
import it.arenahub.backend.dto.ComponenteResponse;
import it.arenahub.backend.dto.MiaPartitaResponse;
import it.arenahub.backend.dto.MioTorneoResponse;
import it.arenahub.backend.dto.ProfiloRequest;
import it.arenahub.backend.dto.StatisticheResponse;
import it.arenahub.backend.dto.UtenteResponse;
import it.arenahub.backend.model.StatoPartita;
import it.arenahub.backend.service.PartitaService;
import it.arenahub.backend.service.UtenteService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/utenti")
public class UtenteController {

	private final UtenteService utenteService;
	private final PartitaService partitaService;

	public UtenteController(UtenteService utenteService, PartitaService partitaService) {
		this.utenteService = utenteService;
		this.partitaService = partitaService;
	}

	@GetMapping("/me/statistiche")
	public StatisticheResponse statistiche(@AuthenticationPrincipal Integer idUtente) {
		return utenteService.statistiche(idUtente);
	}

	@GetMapping("/me/partite")
	public List<MiaPartitaResponse> miePartite(@AuthenticationPrincipal Integer idUtente,
			@RequestParam(required = false) Integer torneoId, @RequestParam(required = false) StatoPartita stato) {
		return partitaService.miePartite(idUtente, torneoId, stato);
	}

	@GetMapping("/cerca")
	public ComponenteResponse cerca(@RequestParam(required = false) String email) {
		return utenteService.cerca(email);
	}

	@GetMapping("/me/tornei")
	public List<MioTorneoResponse> mieiTornei(@AuthenticationPrincipal Integer idUtente) {
		return utenteService.mieiTornei(idUtente);
	}

	@PutMapping("/me")
	public UtenteResponse modificaProfilo(@AuthenticationPrincipal Integer idUtente,
			@Valid @RequestBody ProfiloRequest req) {
		return utenteService.modificaProfilo(idUtente, req);
	}

	@PutMapping("/me/password")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void cambiaPassword(@AuthenticationPrincipal Integer idUtente,
			@Valid @RequestBody CambioPasswordRequest req) {
		utenteService.cambiaPassword(idUtente, req);
	}
}
