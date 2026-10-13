package it.arenahub.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import it.arenahub.backend.model.Partita;

public interface PartitaRepository extends JpaRepository<Partita, Integer> {

	List<Partita> findByTorneoIdOrderByDataOraAscIdAsc(Integer idTorneo);
}
