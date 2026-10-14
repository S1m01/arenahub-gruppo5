package it.arenahub.backend.dto;

import java.util.List;

public record StatisticheResponse(
		Long punti,
		Long posizione,
		Long tornei,
		Long torniAttivi,
		Integer maxTorneiAttivi,
		Long partiteGiocate,
		Long partiteDaGiocare,
		List<PuntiCategoriaResponse> perCategoria) {
}
