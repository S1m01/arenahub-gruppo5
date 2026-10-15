package it.arenahub.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.arenahub.backend.dto.ClassificaGeneraleResponse;
import it.arenahub.backend.dto.PuntiCategoriaResponse;
import it.arenahub.backend.model.Utente;
import jakarta.persistence.LockModeType;

public interface UtenteRepository extends JpaRepository<Utente, Integer> {

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT u FROM Utente u WHERE u.id = :id")
	Optional<Utente> findByIdForUpdate(@Param("id") Integer id);

	boolean existsByEmailIgnoreCase(String email);

	boolean existsByEmailIgnoreCaseAndIdNot(String email, Integer id);

	Optional<Utente> findByEmailIgnoreCase(String email);

	@Query(value = "SELECT punti FROM classifica_generale WHERE id_utente = :idUtente", nativeQuery = true)
	Long puntiTotali(@Param("idUtente") Integer idUtente);

	@Query(value = "SELECT posizione FROM (SELECT id_utente, RANK() OVER (ORDER BY punti DESC) AS posizione "
			+ "FROM classifica_generale) c WHERE id_utente = :idUtente", nativeQuery = true)
	Long posizioneGenerale(@Param("idUtente") Integer idUtente);

	@Query(value = "SELECT COUNT(*) FROM partita_giocatore WHERE id_utente = :idUtente AND stato = :stato", nativeQuery = true)
	Long contaPartite(@Param("idUtente") Integer idUtente, @Param("stato") String stato);

	@Query(value = "SELECT c.nome AS categoria, cc.punti AS punti, cc.posizione AS posizione "
			+ "FROM (SELECT id_categoria, id_utente, punti, "
			+ "RANK() OVER (PARTITION BY id_categoria ORDER BY punti DESC) AS posizione "
			+ "FROM classifica_categoria) cc "
			+ "JOIN categoria c ON c.id_categoria = cc.id_categoria "
			+ "WHERE cc.id_utente = :idUtente ORDER BY c.nome", nativeQuery = true)
	List<PuntiCategoriaResponse> puntiPerCategoria(@Param("idUtente") Integer idUtente);

	@Query(value = "SELECT RANK() OVER (ORDER BY punti DESC) AS posizione, id_utente AS \"utenteId\", "
			+ "giocatore, punti FROM classifica_generale ORDER BY posizione, giocatore", nativeQuery = true)
	List<ClassificaGeneraleResponse> classificaGenerale();

	@Query(value = "SELECT RANK() OVER (ORDER BY punti DESC) AS posizione, id_utente AS \"utenteId\", "
			+ "giocatore, punti FROM classifica_generale ORDER BY posizione, giocatore LIMIT 3", nativeQuery = true)
	List<ClassificaGeneraleResponse> classificaTop();

	@Query(value = "SELECT RANK() OVER (ORDER BY punti DESC) AS posizione, id_utente AS \"utenteId\", "
			+ "giocatore, punti FROM classifica_categoria WHERE id_categoria = :idCategoria ORDER BY posizione, giocatore", nativeQuery = true)
	List<ClassificaGeneraleResponse> classificaCategoria(@Param("idCategoria") Integer idCategoria);
}
