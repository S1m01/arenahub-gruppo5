package it.arenahub.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.arenahub.backend.model.Torneo;

public interface TorneoRepository extends JpaRepository<Torneo, Integer> {

	@Query(value = "SELECT COUNT(*) FROM squadra WHERE id_torneo = :idTorneo", nativeQuery = true)
	int contaIscritti(@Param("idTorneo") Integer idTorneo);
}
