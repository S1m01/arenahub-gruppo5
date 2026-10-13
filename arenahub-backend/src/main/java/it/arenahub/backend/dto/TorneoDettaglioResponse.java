package it.arenahub.backend.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

public record TorneoDettaglioResponse(
		@JsonUnwrapped TorneoResponse torneo,
		MiaSquadraResponse miaSquadra) {
}
