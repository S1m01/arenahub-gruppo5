package it.arenahub.backend.dto;

public record GiocataResponse(
		Integer id,
		Integer torneoId,
		String torneo,
		String titolo,
		String youtubeId,
		Integer inizioSec,
		Integer fineSec,
		Integer partitaId,
		String turno,
		Integer utenteId,
		String giocatore) {
}
