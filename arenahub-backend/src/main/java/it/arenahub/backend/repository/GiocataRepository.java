package it.arenahub.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import it.arenahub.backend.model.Giocata;

public interface GiocataRepository extends JpaRepository<Giocata, Integer> {

	List<Giocata> findAllByOrderByIdDesc();

	List<Giocata> findByTorneoIdOrderByIdDesc(Integer idTorneo);
}
