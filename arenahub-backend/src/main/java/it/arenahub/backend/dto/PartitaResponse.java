package it.arenahub.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import it.arenahub.backend.model.StatoPartita;

public record PartitaResponse(
		Integer id,
		Integer torneoId,
		String turno,
		LocalDateTime dataOra,
		StatoPartita stato,
		List<PunteggioSquadraResponse> squadre) {
}
