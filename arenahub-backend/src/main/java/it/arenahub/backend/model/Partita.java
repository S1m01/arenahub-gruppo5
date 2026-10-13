package it.arenahub.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "partita")
public class Partita {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_partita")
	private Integer id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "id_torneo")
	private Torneo torneo;

	@Column(length = 40)
	private String turno;

	@Column(name = "data_ora")
	private LocalDateTime dataOra;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 12)
	private StatoPartita stato = StatoPartita.programmata;

	public Partita() {
	}

	public Partita(Torneo torneo, String turno, LocalDateTime dataOra) {
		this.torneo = torneo;
		this.turno = turno;
		this.dataOra = dataOra;
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

	public String getTurno() {
		return turno;
	}

	public void setTurno(String turno) {
		this.turno = turno;
	}

	public LocalDateTime getDataOra() {
		return dataOra;
	}

	public void setDataOra(LocalDateTime dataOra) {
		this.dataOra = dataOra;
	}

	public StatoPartita getStato() {
		return stato;
	}

	public void setStato(StatoPartita stato) {
		this.stato = stato;
	}
}
