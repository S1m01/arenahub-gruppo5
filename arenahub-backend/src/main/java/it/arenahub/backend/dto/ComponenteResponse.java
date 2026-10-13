package it.arenahub.backend.dto;

import it.arenahub.backend.model.Utente;

public record ComponenteResponse(Integer utenteId, String nome, String cognome) {

	public static ComponenteResponse da(Utente u) {
		return new ComponenteResponse(u.getId(), u.getNome(), u.getCognome());
	}
}
