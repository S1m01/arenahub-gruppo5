package it.arenahub.backend.dto;

import java.time.LocalDateTime;

public record IscrizioneResponse(Integer torneoId, LocalDateTime data, SquadraResponse squadra) {
}
