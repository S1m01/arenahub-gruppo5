package it.arenahub.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import it.arenahub.backend.model.Iscrizione;
import it.arenahub.backend.model.StatoTorneo;

public interface IscrizioneRepository extends JpaRepository<Iscrizione, Integer> {

	Optional<Iscrizione> findByTorneoIdAndUtenteId(Integer idTorneo, Integer idUtente);

	boolean existsByTorneoIdAndUtenteId(Integer idTorneo, Integer idUtente);

	List<Iscrizione> findBySquadraIdOrderById(Integer idSquadra);

	List<Iscrizione> findByUtenteId(Integer idUtente);

	long countByUtenteId(Integer idUtente);

	long countByUtenteIdAndTorneoStatoNot(Integer idUtente, StatoTorneo stato);
}
