package it.arenahub.backend.dto;

public record GiocataResponse(
		Integer id,
		Integer torneoId,
		String torneo,
		String categoria,
		Integer partitaId,
		String turno,
		String titolo,
		String idYoutube,
		Integer inizioSec,
		Integer fineSec,
		String giocatore,
		String squadra) {
}
