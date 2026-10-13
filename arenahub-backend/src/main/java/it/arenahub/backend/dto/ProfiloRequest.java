package it.arenahub.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfiloRequest(
		@NotBlank @Size(max = 50) String nome,
		@NotBlank @Size(max = 50) String cognome,
		@NotBlank @Email @Size(max = 120) String email) {
}
