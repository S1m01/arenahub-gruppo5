package it.arenahub.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.arenahub.backend.model.Torneo;

public interface TorneoRepository extends JpaRepository<Torneo, Integer> {

	@Query(value = "SELECT COUNT(*) > 0 FROM partita WHERE id_torneo = :idTorneo AND stato = 'conclusa'", nativeQuery = true)
	boolean haPartiteConcluse(@Param("idTorneo") Integer idTorneo);

	@Query(value = "SELECT punti FROM classifica_giocatori_torneo WHERE id_torneo = :idTorneo AND id_utente = :idUtente", nativeQuery = true)
	Long puntiGiocatore(@Param("idTorneo") Integer idTorneo, @Param("idUtente") Integer idUtente);

	@Query(value = "SELECT posizione FROM (SELECT id_squadra, ROW_NUMBER() OVER (ORDER BY punti DESC, squadra) AS posizione "
			+ "FROM classifica_torneo WHERE id_torneo = :idTorneo) c WHERE id_squadra = :idSquadra", nativeQuery = true)
	Long posizioneSquadra(@Param("idTorneo") Integer idTorneo, @Param("idSquadra") Integer idSquadra);
}
