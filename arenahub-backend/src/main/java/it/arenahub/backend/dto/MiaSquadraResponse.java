package it.arenahub.backend.dto;

import it.arenahub.backend.model.Squadra;

public record MiaSquadraResponse(Integer id, String nome, boolean sonoCapitano) {

	public static MiaSquadraResponse da(Squadra s, Integer idUtente) {
		return new MiaSquadraResponse(s.getId(), s.getNome(), s.getCapitano().getId().equals(idUtente));
	}
}
