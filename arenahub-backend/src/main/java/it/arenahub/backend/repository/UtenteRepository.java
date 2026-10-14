package it.arenahub.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.arenahub.backend.dto.PuntiCategoriaResponse;
import it.arenahub.backend.model.Utente;

public interface UtenteRepository extends JpaRepository<Utente, Integer> {

	boolean existsByEmailIgnoreCase(String email);

	boolean existsByEmailIgnoreCaseAndIdNot(String email, Integer id);

	Optional<Utente> findByEmailIgnoreCase(String email);

	@Query(value = "SELECT punti FROM classifica_generale WHERE id_utente = :idUtente", nativeQuery = true)
	Long puntiTotali(@Param("idUtente") Integer idUtente);

	@Query(value = "SELECT posizione FROM (SELECT id_utente, ROW_NUMBER() OVER (ORDER BY punti DESC, giocatore) AS posizione "
			+ "FROM classifica_generale) c WHERE id_utente = :idUtente", nativeQuery = true)
	Long posizioneGenerale(@Param("idUtente") Integer idUtente);

	@Query(value = "SELECT COUNT(*) FROM partita_giocatore WHERE id_utente = :idUtente AND stato = :stato", nativeQuery = true)
	Long contaPartite(@Param("idUtente") Integer idUtente, @Param("stato") String stato);

	@Query(value = "SELECT c.nome AS categoria, cc.punti AS punti, cc.posizione AS posizione "
			+ "FROM (SELECT id_categoria, id_utente, punti, "
			+ "ROW_NUMBER() OVER (PARTITION BY id_categoria ORDER BY punti DESC, giocatore) AS posizione "
			+ "FROM classifica_categoria) cc "
			+ "JOIN categoria c ON c.id_categoria = cc.id_categoria "
			+ "WHERE cc.id_utente = :idUtente ORDER BY c.nome", nativeQuery = true)
	List<PuntiCategoriaResponse> puntiPerCategoria(@Param("idUtente") Integer idUtente);
}
