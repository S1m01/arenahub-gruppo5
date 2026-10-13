package it.arenahub.backend.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import it.arenahub.backend.dto.TorneoDettaglioResponse;
import it.arenahub.backend.dto.TorneoResponse;
import it.arenahub.backend.service.TorneoService;

@RestController
@RequestMapping("/api/tornei")
public class TorneoController {

	private final TorneoService torneoService;

	public TorneoController(TorneoService torneoService) {
		this.torneoService = torneoService;
	}

	@GetMapping
	public List<TorneoResponse> elenco(
			@RequestParam(required = false) String stato,
			@RequestParam(required = false) String inCorso,
			@RequestParam(required = false) String gioco,
			@RequestParam(required = false) String categoria,
			@RequestParam(required = false) String cerca,
			@RequestParam(required = false) String ordina,
			@RequestParam(required = false) String direzione) {
		return torneoService.elenco(stato, inCorso, gioco, categoria, cerca, ordina, direzione);
	}

	@GetMapping("/top")
	public List<TorneoResponse> top() {
		return torneoService.top();
	}

	@GetMapping("/live")
	public List<TorneoResponse> live() {
		return torneoService.live();
	}

	@GetMapping("/{id}")
	public TorneoDettaglioResponse dettaglio(@PathVariable Integer id,
			@AuthenticationPrincipal Integer idUtente) {
		return torneoService.dettaglio(id, idUtente);
	}
}
