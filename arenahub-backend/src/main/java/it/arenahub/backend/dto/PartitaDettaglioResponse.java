package it.arenahub.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import it.arenahub.backend.model.StatoPartita;

public record PartitaDettaglioResponse(
		Integer id,
		Integer torneoId,
		String torneo,
		String turno,
		LocalDateTime dataOra,
		StatoPartita stato,
		List<SquadraPartitaResponse> squadre) {
}
