package it.arenahub.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record SquadraIscrittaResponse(
		Integer squadraId,
		String squadra,
		Integer capitanoId,
		LocalDateTime data,
		List<IscrittoResponse> componenti) {
}
