package it.arenahub.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import it.arenahub.backend.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

	List<Categoria> findAllByOrderByNomeAsc();

	Optional<Categoria> findByNomeIgnoreCase(String nome);
}
