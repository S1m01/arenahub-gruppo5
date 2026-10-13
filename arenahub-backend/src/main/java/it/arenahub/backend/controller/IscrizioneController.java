package it.arenahub.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.arenahub.backend.dto.IscrizioneRequest;
import it.arenahub.backend.dto.IscrizioneResponse;
import it.arenahub.backend.service.IscrizioneService;

@RestController
@RequestMapping("/api/tornei/{id}/iscrizioni")
public class IscrizioneController {

	private final IscrizioneService iscrizioneService;

	public IscrizioneController(IscrizioneService iscrizioneService) {
		this.iscrizioneService = iscrizioneService;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public IscrizioneResponse iscrivi(@PathVariable Integer id, @AuthenticationPrincipal Integer idUtente,
			@RequestBody(required = false) IscrizioneRequest req) {
		return iscrizioneService.iscrivi(id, idUtente, req);
	}

	@DeleteMapping
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void annulla(@PathVariable Integer id, @AuthenticationPrincipal Integer idUtente) {
		iscrizioneService.annulla(id, idUtente);
	}
}
