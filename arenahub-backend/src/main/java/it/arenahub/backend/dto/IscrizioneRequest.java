package it.arenahub.backend.dto;

import java.util.List;

public record IscrizioneRequest(String squadraNome, List<String> componenti) {
}
