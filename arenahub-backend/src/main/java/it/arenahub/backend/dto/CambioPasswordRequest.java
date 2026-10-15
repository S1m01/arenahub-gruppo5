package it.arenahub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CambioPasswordRequest(
		@NotBlank String passwordAttuale,
		@NotBlank @Size(min = 8, max = 72) String passwordNuova) {
}
