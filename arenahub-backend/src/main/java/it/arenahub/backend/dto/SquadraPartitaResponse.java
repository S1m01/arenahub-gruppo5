package it.arenahub.backend.dto;

import java.util.List;

public record SquadraPartitaResponse(
		Integer squadraId,
		String nome,
		Integer punti,
		List<GiocatorePuntiResponse> giocatori) {
}
