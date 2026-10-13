package it.arenahub.backend.model;

import java.io.Serializable;
import java.util.Objects;

public class PartitaSquadraId implements Serializable {

	private Integer partita;
	private Integer squadra;

	public PartitaSquadraId() {
	}

	public PartitaSquadraId(Integer partita, Integer squadra) {
		this.partita = partita;
		this.squadra = squadra;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (!(o instanceof PartitaSquadraId other)) {
			return false;
		}
		return Objects.equals(partita, other.partita) && Objects.equals(squadra, other.squadra);
	}

	@Override
	public int hashCode() {
		return Objects.hash(partita, squadra);
	}
}
