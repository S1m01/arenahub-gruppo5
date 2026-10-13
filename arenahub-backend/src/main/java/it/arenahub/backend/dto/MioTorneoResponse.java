package it.arenahub.backend.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

public record MioTorneoResponse(
		@JsonUnwrapped TorneoResponse torneo,
		MiaSquadraResponse squadra,
		LocalDateTime dataIscrizione,
		Integer punti,
		Integer posizione) {
}
