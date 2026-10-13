package it.arenahub.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.arenahub.backend.dto.SquadraIscrittaResponse;
import it.arenahub.backend.dto.SquadraResponse;
import it.arenahub.backend.dto.StatoRequest;
import it.arenahub.backend.dto.StatoResponse;
import it.arenahub.backend.dto.TorneoDettaglioResponse;
import it.arenahub.backend.dto.TorneoRequest;
import it.arenahub.backend.dto.TorneoResponse;
import it.arenahub.backend.service.TorneoAdminService;
import it.arenahub.backend.service.TorneoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tornei")
public class TorneoController {

	private final TorneoService torneoService;
	private final TorneoAdminService torneoAdminService;

	public TorneoController(TorneoService torneoService, TorneoAdminService torneoAdminService) {
		this.torneoService = torneoService;
		this.torneoAdminService = torneoAdminService;
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

	@GetMapping("/{id}/squadre")
	public List<SquadraResponse> squadre(@PathVariable Integer id) {
		return torneoService.squadre(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public TorneoDettaglioResponse crea(@Valid @RequestBody TorneoRequest req) {
		return torneoAdminService.crea(req);
	}

	@PutMapping("/{id}")
	public TorneoDettaglioResponse modifica(@PathVariable Integer id, @Valid @RequestBody TorneoRequest req) {
		return torneoAdminService.modifica(id, req);
	}

	@PatchMapping("/{id}/stato")
	public StatoResponse cambiaStato(@PathVariable Integer id, @RequestBody(required = false) StatoRequest req) {
		return torneoAdminService.cambiaStato(id, req);
	}

	@GetMapping("/{id}/iscritti")
	public List<SquadraIscrittaResponse> iscritti(@PathVariable Integer id) {
		return torneoAdminService.iscritti(id);
	}
}
