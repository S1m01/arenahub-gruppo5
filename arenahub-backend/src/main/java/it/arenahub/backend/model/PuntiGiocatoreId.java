package it.arenahub.backend.model;

import java.io.Serializable;
import java.util.Objects;

public class PuntiGiocatoreId implements Serializable {

	private Integer partita;
	private Integer utente;

	public PuntiGiocatoreId() {
	}

	public PuntiGiocatoreId(Integer partita, Integer utente) {
		this.partita = partita;
		this.utente = utente;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (!(o instanceof PuntiGiocatoreId other)) {
			return false;
		}
		return Objects.equals(partita, other.partita) && Objects.equals(utente, other.utente);
	}

	@Override
	public int hashCode() {
		return Objects.hash(partita, utente);
	}
}
