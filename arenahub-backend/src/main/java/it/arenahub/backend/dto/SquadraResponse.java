package it.arenahub.backend.dto;

import java.util.List;

import it.arenahub.backend.model.Squadra;

public record SquadraResponse(Integer id, String nome, Integer capitanoId, List<ComponenteResponse> componenti) {

	public static SquadraResponse da(Squadra s, List<ComponenteResponse> componenti) {
		return new SquadraResponse(s.getId(), s.getNome(), s.getCapitano().getId(), componenti);
	}
}
