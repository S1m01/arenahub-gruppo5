package it.arenahub.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.arenahub.backend.dto.ClassificaGiocatoreResponse;
import it.arenahub.backend.dto.ClassificaSquadraResponse;
import it.arenahub.backend.model.Torneo;
import jakarta.persistence.LockModeType;

public interface TorneoRepository extends JpaRepository<Torneo, Integer> {

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT t FROM Torneo t WHERE t.id = :id")
	Optional<Torneo> findByIdForUpdate(@Param("id") Integer id);

	@Query(value = "SELECT COUNT(*) > 0 FROM partita WHERE id_torneo = :idTorneo AND stato = 'conclusa'", nativeQuery = true)
	boolean haPartiteConcluse(@Param("idTorneo") Integer idTorneo);

	@Query(value = "SELECT COUNT(*) > 0 FROM partita WHERE id_torneo = :idTorneo AND stato <> 'conclusa'", nativeQuery = true)
	boolean haPartiteNonConcluse(@Param("idTorneo") Integer idTorneo);

	@Query(value = "SELECT punti FROM classifica_giocatori_torneo WHERE id_torneo = :idTorneo AND id_utente = :idUtente", nativeQuery = true)
	Long puntiGiocatore(@Param("idTorneo") Integer idTorneo, @Param("idUtente") Integer idUtente);

	@Query(value = "SELECT posizione FROM (SELECT id_squadra, RANK() OVER (ORDER BY punti DESC) AS posizione "
			+ "FROM classifica_torneo WHERE id_torneo = :idTorneo) c WHERE id_squadra = :idSquadra", nativeQuery = true)
	Long posizioneSquadra(@Param("idTorneo") Integer idTorneo, @Param("idSquadra") Integer idSquadra);

	@Query(value = "SELECT RANK() OVER (ORDER BY punti DESC) AS posizione, id_squadra AS \"squadraId\", "
			+ "squadra, punti, partite_giocate AS \"partiteGiocate\" "
			+ "FROM classifica_torneo WHERE id_torneo = :idTorneo ORDER BY posizione, squadra", nativeQuery = true)
	List<ClassificaSquadraResponse> classificaSquadre(@Param("idTorneo") Integer idTorneo);

	@Query(value = "SELECT RANK() OVER (ORDER BY punti DESC) AS posizione, id_utente AS \"utenteId\", "
			+ "giocatore, squadra, punti "
			+ "FROM classifica_giocatori_torneo WHERE id_torneo = :idTorneo ORDER BY posizione, giocatore", nativeQuery = true)
	List<ClassificaGiocatoreResponse> classificaGiocatori(@Param("idTorneo") Integer idTorneo);
}
