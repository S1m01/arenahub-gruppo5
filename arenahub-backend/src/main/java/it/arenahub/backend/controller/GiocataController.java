package it.arenahub.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.arenahub.backend.dto.GiocataRequest;
import it.arenahub.backend.dto.GiocataResponse;
import it.arenahub.backend.service.GiocataService;
import jakarta.validation.Valid;

@RestController
public class GiocataController {

	private final GiocataService giocataService;

	public GiocataController(GiocataService giocataService) {
		this.giocataService = giocataService;
	}

	@GetMapping("/api/giocate")
	public List<GiocataResponse> elenco(@RequestParam(required = false) Integer torneoId,
			@RequestParam(required = false) String categoria) {
		return giocataService.elenco(torneoId, categoria);
	}

	@PostMapping("/api/tornei/{id}/giocate")
	@ResponseStatus(HttpStatus.CREATED)
	public GiocataResponse crea(@PathVariable Integer id, @Valid @RequestBody GiocataRequest req) {
		return giocataService.crea(id, req);
	}

	@DeleteMapping("/api/giocate/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void elimina(@PathVariable Integer id) {
		giocataService.elimina(id);
	}
}
