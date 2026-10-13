package it.arenahub.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "punti_giocatore")
@IdClass(PuntiGiocatoreId.class)
public class PuntiGiocatore {

	@Id
	@ManyToOne
	@JoinColumn(name = "id_partita")
	private Partita partita;

	@Id
	@ManyToOne
	@JoinColumn(name = "id_utente")
	private Utente utente;

	@ManyToOne(optional = false)
	@JoinColumn(name = "id_squadra")
	private Squadra squadra;

	@Column(nullable = false)
	private Integer punti = 0;

	public PuntiGiocatore() {
	}

	public PuntiGiocatore(Partita partita, Utente utente, Squadra squadra, Integer punti) {
		this.partita = partita;
		this.utente = utente;
		this.squadra = squadra;
		this.punti = punti;
	}

	public Partita getPartita() {
		return partita;
	}

	public void setPartita(Partita partita) {
		this.partita = partita;
	}

	public Utente getUtente() {
		return utente;
	}

	public void setUtente(Utente utente) {
		this.utente = utente;
	}

	public Squadra getSquadra() {
		return squadra;
	}

	public void setSquadra(Squadra squadra) {
		this.squadra = squadra;
	}

	public Integer getPunti() {
		return punti;
	}

	public void setPunti(Integer punti) {
		this.punti = punti;
	}
}
