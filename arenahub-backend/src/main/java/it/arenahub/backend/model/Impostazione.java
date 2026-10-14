package it.arenahub.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "impostazione")
public class Impostazione {

	@Id
	@Column(length = 40)
	private String chiave;

	@Column(nullable = false)
	private Integer valore;

	public Impostazione() {
	}

	public Impostazione(String chiave, Integer valore) {
		this.chiave = chiave;
		this.valore = valore;
	}

	public String getChiave() {
		return chiave;
	}

	public Integer getValore() {
		return valore;
	}
}
