package it.arenahub.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record GiocataRequest(
		@NotBlank @Size(max = 100) String titolo,
		@NotBlank @Size(max = 50) String idYoutube,
		@NotNull @Min(0) Integer inizioSec,
		@NotNull Integer fineSec,
		Integer partitaId,
		Integer utenteId) {
}
