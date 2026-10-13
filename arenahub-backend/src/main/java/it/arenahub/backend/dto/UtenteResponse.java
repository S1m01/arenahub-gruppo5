package it.arenahub.backend.dto;

import it.arenahub.backend.model.Utente;

public record UtenteResponse(Integer id, String nome, String cognome, String email, String ruolo) {

	public static UtenteResponse da(Utente u) {
		return new UtenteResponse(u.getId(), u.getNome(), u.getCognome(), u.getEmail(),
				u.getRuolo().name().toLowerCase());
	}
}
