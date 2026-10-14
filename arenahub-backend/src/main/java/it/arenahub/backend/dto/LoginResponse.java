package it.arenahub.backend.dto;

import it.arenahub.backend.model.Utente;

public record LoginResponse(Integer id, String nome, String cognome, String ruolo) {

	public static LoginResponse da(Utente u) {
		return new LoginResponse(u.getId(), u.getNome(), u.getCognome(), u.getRuolo().name().toLowerCase());
	}
}
