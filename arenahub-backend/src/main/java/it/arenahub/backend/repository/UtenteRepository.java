package it.arenahub.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import it.arenahub.backend.model.Utente;

public interface UtenteRepository extends JpaRepository<Utente, Integer> {

	boolean existsByEmailIgnoreCase(String email);

	Optional<Utente> findByEmailIgnoreCase(String email);
}
