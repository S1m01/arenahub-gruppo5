package it.arenahub.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.arenahub.backend.model.PuntiGiocatore;
import it.arenahub.backend.model.PuntiGiocatoreId;

public interface PuntiGiocatoreRepository extends JpaRepository<PuntiGiocatore, PuntiGiocatoreId> {

	List<PuntiGiocatore> findByPartitaId(Integer idPartita);

	Optional<PuntiGiocatore> findByPartitaIdAndUtenteId(Integer idPartita, Integer idUtente);

	@Modifying
	@Query("DELETE FROM PuntiGiocatore p WHERE p.partita.id = :idPartita AND p.squadra.id = :idSquadra")
	void cancellaPuntiSquadra(@Param("idPartita") Integer idPartita, @Param("idSquadra") Integer idSquadra);
}
