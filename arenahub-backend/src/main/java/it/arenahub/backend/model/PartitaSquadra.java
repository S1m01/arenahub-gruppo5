package it.arenahub.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "partita_squadra")
@IdClass(PartitaSquadraId.class)
public class PartitaSquadra {

	@Id
	@ManyToOne
	@JoinColumn(name = "id_partita")
	private Partita partita;

	@Id
	@ManyToOne
	@JoinColumn(name = "id_squadra")
	private Squadra squadra;

	@Column(name = "id_torneo", nullable = false)
	private Integer idTorneo;

	private Integer punti;

	public PartitaSquadra() {
	}

	public PartitaSquadra(Partita partita, Squadra squadra) {
		this.partita = partita;
		this.squadra = squadra;
		this.idTorneo = partita.getTorneo().getId();
	}

	public Partita getPartita() {
		return partita;
	}

	public void setPartita(Partita partita) {
		this.partita = partita;
	}

	public Squadra getSquadra() {
		return squadra;
	}

	public void setSquadra(Squadra squadra) {
		this.squadra = squadra;
	}

	public Integer getIdTorneo() {
		return idTorneo;
	}

	public void setIdTorneo(Integer idTorneo) {
		this.idTorneo = idTorneo;
	}

	public Integer getPunti() {
		return punti;
	}

	public void setPunti(Integer punti) {
		this.punti = punti;
	}
}
