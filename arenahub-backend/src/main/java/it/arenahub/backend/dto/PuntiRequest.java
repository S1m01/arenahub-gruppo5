package it.arenahub.backend.dto;

import java.util.List;

public record PuntiRequest(Boolean concludi, List<SquadraPunti> squadre) {

	public record SquadraPunti(Integer squadraId, Integer punti, List<GiocatorePunti> giocatori) {
	}

	public record GiocatorePunti(Integer utenteId, Integer punti) {
	}
}
