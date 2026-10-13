package it.arenahub.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.arenahub.backend.dto.PartitaDettaglioResponse;
import it.arenahub.backend.dto.PartitaRequest;
import it.arenahub.backend.dto.PartitaResponse;
import it.arenahub.backend.dto.PuntiRequest;
import it.arenahub.backend.service.PartitaService;
import jakarta.validation.Valid;

@RestController
public class PartitaController {

	private final PartitaService partitaService;

	public PartitaController(PartitaService partitaService) {
		this.partitaService = partitaService;
	}

	@GetMapping("/api/tornei/{id}/partite")
	public List<PartitaResponse> elenco(@PathVariable Integer id) {
		return partitaService.elenco(id);
	}

	@PostMapping("/api/tornei/{id}/partite")
	@ResponseStatus(HttpStatus.CREATED)
	public PartitaResponse crea(@PathVariable Integer id, @Valid @RequestBody PartitaRequest req) {
		return partitaService.crea(id, req);
	}

	@GetMapping("/api/partite/{id}")
	public PartitaDettaglioResponse dettaglio(@PathVariable Integer id) {
		return partitaService.dettaglio(id);
	}

	@PutMapping("/api/partite/{id}/punti")
	public PartitaDettaglioResponse inserisciPunti(@PathVariable Integer id,
			@RequestBody(required = false) PuntiRequest req) {
		return partitaService.inserisciPunti(id, req);
	}
}
