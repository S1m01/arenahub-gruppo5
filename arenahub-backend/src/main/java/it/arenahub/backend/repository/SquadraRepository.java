package it.arenahub.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import it.arenahub.backend.model.Squadra;

public interface SquadraRepository extends JpaRepository<Squadra, Integer> {

	List<Squadra> findByTorneoIdOrderById(Integer idTorneo);

	int countByTorneoId(Integer idTorneo);

	boolean existsByTorneoIdAndNomeIgnoreCase(Integer idTorneo, String nome);
}
