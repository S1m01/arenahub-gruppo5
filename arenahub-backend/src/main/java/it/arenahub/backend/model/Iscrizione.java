package it.arenahub.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "iscrizione")
public class Iscrizione {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_iscrizione")
	private Integer id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "id_torneo")
	private Torneo torneo;

	@ManyToOne(optional = false)
	@JoinColumn(name = "id_utente")
	private Utente utente;

	@ManyToOne(optional = false)
	@JoinColumn(name = "id_squadra")
	private Squadra squadra;

	@Column(nullable = false)
	private LocalDateTime data = LocalDateTime.now();

	public Iscrizione() {
	}

	public Iscrizione(Torneo torneo, Utente utente, Squadra squadra) {
		this.torneo = torneo;
		this.utente = utente;
		this.squadra = squadra;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Torneo getTorneo() {
		return torneo;
	}

	public void setTorneo(Torneo torneo) {
		this.torneo = torneo;
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

	public LocalDateTime getData() {
		return data;
	}

	public void setData(LocalDateTime data) {
		this.data = data;
	}
}
