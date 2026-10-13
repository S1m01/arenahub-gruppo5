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
@Table(name = "squadra")
public class Squadra {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_squadra")
	private Integer id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "id_torneo")
	private Torneo torneo;

	@Column(nullable = false, length = 60)
	private String nome;

	@ManyToOne(optional = false)
	@JoinColumn(name = "id_capitano")
	private Utente capitano;

	public Squadra() {
	}

	public Squadra(Torneo torneo, String nome, Utente capitano) {
		this.torneo = torneo;
		this.nome = nome;
		this.capitano = capitano;
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

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public Utente getCapitano() {
		return capitano;
	}

	public void setCapitano(Utente capitano) {
		this.capitano = capitano;
	}
}
