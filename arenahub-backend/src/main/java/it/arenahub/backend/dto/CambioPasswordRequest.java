package it.arenahub.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record CambioPasswordRequest(
		@NotBlank String passwordAttuale,
		@NotBlank String passwordNuova) {
}
