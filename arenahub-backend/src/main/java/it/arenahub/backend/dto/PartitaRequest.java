package it.arenahub.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.Size;

public record PartitaRequest(
		@Size(max = 40) String turno,
		LocalDateTime dataOra,
		List<Integer> squadre) {
}
