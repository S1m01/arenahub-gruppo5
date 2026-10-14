package it.arenahub.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import it.arenahub.backend.dto.ClassificaGeneraleResponse;
import it.arenahub.backend.dto.ClassificaGiocatoreResponse;
import it.arenahub.backend.dto.ClassificaSquadraResponse;
import it.arenahub.backend.service.ClassificaService;

@RestController
public class ClassificaController {

	private final ClassificaService classificaService;

	public ClassificaController(ClassificaService classificaService) {
		this.classificaService = classificaService;
	}

	@GetMapping("/api/tornei/{id}/classifica")
	public List<ClassificaSquadraResponse> classificaTorneo(@PathVariable Integer id) {
		return classificaService.classificaTorneo(id);
	}

	@GetMapping("/api/tornei/{id}/classifica-giocatori")
	public List<ClassificaGiocatoreResponse> classificaGiocatoriTorneo(@PathVariable Integer id) {
		return classificaService.classificaGiocatoriTorneo(id);
	}

	@GetMapping("/api/classifica")
	public List<ClassificaGeneraleResponse> classificaGenerale() {
		return classificaService.classificaGenerale();
	}

	@GetMapping("/api/classifica/top")
	public List<ClassificaGeneraleResponse> classificaTop() {
		return classificaService.classificaTop();
	}

	@GetMapping("/api/classifica/categorie/{categoria}")
	public List<ClassificaGeneraleResponse> classificaCategoria(@PathVariable String categoria) {
		return classificaService.classificaCategoria(categoria);
	}
}
