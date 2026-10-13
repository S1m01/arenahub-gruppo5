package it.arenahub.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import it.arenahub.backend.model.Torneo;

public interface TorneoRepository extends JpaRepository<Torneo, Integer> {
}
