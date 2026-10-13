package it.arenahub.backend.dto;

import java.time.LocalDateTime;

import it.arenahub.backend.model.Modalita;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TorneoRequest(
		@NotBlank @Size(max = 100) String nome,
		String descrizione,
		@NotBlank @Size(max = 80) String gioco,
		@NotBlank String categoria,
		@NotNull Modalita modalita,
		@NotNull @Min(1) @Max(100) Integer giocatoriPerSquadra,
		@NotNull LocalDateTime dataOra,
		@NotNull LocalDateTime dataFine,
		@NotNull @Min(1) Integer postiMax,
		@Size(max = 255) String foto) {
}
