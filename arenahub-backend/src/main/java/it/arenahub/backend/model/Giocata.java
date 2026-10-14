package it.arenahub.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "giocata")
public class Giocata {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_giocata")
	private Integer id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "id_torneo")
	private Torneo torneo;

	@ManyToOne
	@JoinColumn(name = "id_partita")
	private Partita partita;

	@ManyToOne
	@JoinColumn(name = "id_utente")
	private Utente utente;

	@Column(nullable = false, length = 100)
	private String titolo;

	@Column(name = "id_youtube", nullable = false, length = 20)
	private String youtubeId;

	@Column(name = "inizio_sec", nullable = false)
	private Integer inizioSec;

	@Column(name = "fine_sec", nullable = false)
	private Integer fineSec;

	public Giocata() {
	}

	public Giocata(Torneo torneo, Partita partita, Utente utente, String titolo, String youtubeId, Integer inizioSec,
			Integer fineSec) {
		this.torneo = torneo;
		this.partita = partita;
		this.utente = utente;
		this.titolo = titolo;
		this.youtubeId = youtubeId;
		this.inizioSec = inizioSec;
		this.fineSec = fineSec;
	}

	public Integer getId() {
		return id;
	}

	public Torneo getTorneo() {
		return torneo;
	}

	public Partita getPartita() {
		return partita;
	}

	public Utente getUtente() {
		return utente;
	}

	public String getTitolo() {
		return titolo;
	}

	public String getYoutubeId() {
		return youtubeId;
	}

	public Integer getInizioSec() {
		return inizioSec;
	}

	public Integer getFineSec() {
		return fineSec;
	}
}
