package it.arenahub.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.arenahub.backend.dto.ImpostazioniRequest;
import it.arenahub.backend.dto.ImpostazioniResponse;
import it.arenahub.backend.service.ImpostazioneService;

@RestController
@RequestMapping("/api/impostazioni")
public class ImpostazioneController {

	private final ImpostazioneService impostazioneService;

	public ImpostazioneController(ImpostazioneService impostazioneService) {
		this.impostazioneService = impostazioneService;
	}

	@GetMapping
	public ImpostazioniResponse leggi() {
		return impostazioneService.leggi();
	}

	@PutMapping
	public ImpostazioniResponse modifica(@RequestBody(required = false) ImpostazioniRequest req) {
		return impostazioneService.modifica(req);
	}
}
