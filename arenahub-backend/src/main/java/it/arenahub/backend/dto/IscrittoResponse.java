package it.arenahub.backend.dto;

import it.arenahub.backend.model.Utente;

public record IscrittoResponse(Integer utenteId, String nome, String cognome, String email) {

	public static IscrittoResponse da(Utente u) {
		return new IscrittoResponse(u.getId(), u.getNome(), u.getCognome(), u.getEmail());
	}
}
