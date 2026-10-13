package it.arenahub.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import it.arenahub.backend.model.PartitaSquadra;
import it.arenahub.backend.model.PartitaSquadraId;

public interface PartitaSquadraRepository extends JpaRepository<PartitaSquadra, PartitaSquadraId> {

	List<PartitaSquadra> findByPartitaIdOrderBySquadraId(Integer idPartita);
}
