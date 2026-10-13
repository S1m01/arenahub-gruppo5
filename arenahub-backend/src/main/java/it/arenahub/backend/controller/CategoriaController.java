package it.arenahub.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.arenahub.backend.model.Categoria;
import it.arenahub.backend.repository.CategoriaRepository;

@RestController
@RequestMapping("/api/categorie")
public class CategoriaController {

	private final CategoriaRepository categoriaRepository;

	public CategoriaController(CategoriaRepository categoriaRepository) {
		this.categoriaRepository = categoriaRepository;
	}

	@GetMapping
	public List<String> elenco() {
		return categoriaRepository.findAllByOrderByNomeAsc().stream()
				.map(Categoria::getNome)
				.toList();
	}
}
