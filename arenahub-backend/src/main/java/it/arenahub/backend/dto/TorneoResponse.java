package it.arenahub.backend.dto;

import java.time.LocalDateTime;

import it.arenahub.backend.model.Modalita;
import it.arenahub.backend.model.StatoTorneo;
import it.arenahub.backend.model.Torneo;

public record TorneoResponse(
		Integer id,
		String nome,
		String descrizione,
		String gioco,
		String categoria,
		Modalita modalita,
		Short giocatoriPerSquadra,
		StatoTorneo stato,
		boolean inCorso,
		LocalDateTime dataOra,
		LocalDateTime dataFine,
		Integer postiMax,
		int iscritti,
		String foto) {

	public static TorneoResponse da(Torneo t, int iscritti) {
		return new TorneoResponse(t.getId(), t.getNome(), t.getDescrizione(), t.getGioco(),
				t.getCategoria().getNome(), t.getModalita(), t.getGiocatoriPerSquadra(), t.getStato(),
				t.isInCorso(), t.getDataInizio(), t.getDataFine(), t.getPostiMax(), iscritti, t.getFoto());
	}
}
