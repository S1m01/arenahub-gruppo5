package it.arenahub.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import it.arenahub.backend.model.StatoPartita;

public record MiaPartitaResponse(
		Integer id,
		Integer torneoId,
		String torneo,
		String turno,
		LocalDateTime dataOra,
		StatoPartita stato,
		Integer miaSquadraId,
		Integer mieiPunti,
		List<PunteggioSquadraResponse> squadre) {
}
