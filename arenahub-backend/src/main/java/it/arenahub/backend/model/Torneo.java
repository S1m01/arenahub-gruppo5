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
@Table(name = "torneo")
public class Torneo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_torneo")
	private Integer id;

	@Column(nullable = false, length = 100)
	private String nome;

	@Column(columnDefinition = "text")
	private String descrizione;

	@Column(nullable = false, length = 80)
	private String gioco;

	@ManyToOne(optional = false)
	@JoinColumn(name = "id_categoria")
	private Categoria categoria;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 10)
	private Modalita modalita = Modalita.singolo;

	@Column(name = "giocatori_per_squadra", nullable = false)
	private Short giocatoriPerSquadra = 1;

	@Column(name = "data_inizio", nullable = false)
	private LocalDateTime dataInizio;

	@Column(name = "data_fine", nullable = false)
	private LocalDateTime dataFine;

	@Column(name = "posti_max", nullable = false)
	private Integer postiMax;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 10)
	private StatoTorneo stato = StatoTorneo.aperto;

	@Column(length = 255)
	private String foto;

	public Torneo() {
	}

	public boolean isInCorso() {
		LocalDateTime adesso = LocalDateTime.now();
		return stato == StatoTorneo.chiuso && !adesso.isBefore(dataInizio) && !adesso.isAfter(dataFine);
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getDescrizione() {
		return descrizione;
	}

	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}

	public String getGioco() {
		return gioco;
	}

	public void setGioco(String gioco) {
		this.gioco = gioco;
	}

	public Categoria getCategoria() {
		return categoria;
	}

	public void setCategoria(Categoria categoria) {
		this.categoria = categoria;
	}

	public Modalita getModalita() {
		return modalita;
	}

	public void setModalita(Modalita modalita) {
		this.modalita = modalita;
	}

	public Short getGiocatoriPerSquadra() {
		return giocatoriPerSquadra;
	}

	public void setGiocatoriPerSquadra(Short giocatoriPerSquadra) {
		this.giocatoriPerSquadra = giocatoriPerSquadra;
	}

	public LocalDateTime getDataInizio() {
		return dataInizio;
	}

	public void setDataInizio(LocalDateTime dataInizio) {
		this.dataInizio = dataInizio;
	}

	public LocalDateTime getDataFine() {
		return dataFine;
	}

	public void setDataFine(LocalDateTime dataFine) {
		this.dataFine = dataFine;
	}

	public Integer getPostiMax() {
		return postiMax;
	}

	public void setPostiMax(Integer postiMax) {
		this.postiMax = postiMax;
	}

	public StatoTorneo getStato() {
		return stato;
	}

	public void setStato(StatoTorneo stato) {
		this.stato = stato;
	}

	public String getFoto() {
		return foto;
	}

	public void setFoto(String foto) {
		this.foto = foto;
	}
}
