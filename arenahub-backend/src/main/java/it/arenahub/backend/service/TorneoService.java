package it.arenahub.backend.service;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import it.arenahub.backend.dto.ComponenteResponse;
import it.arenahub.backend.dto.MiaSquadraResponse;
import it.arenahub.backend.dto.SquadraResponse;
import it.arenahub.backend.dto.TorneoDettaglioResponse;
import it.arenahub.backend.dto.TorneoResponse;
import it.arenahub.backend.exception.ApiException;
import it.arenahub.backend.model.StatoTorneo;
import it.arenahub.backend.model.Torneo;
import it.arenahub.backend.repository.CategoriaRepository;
import it.arenahub.backend.repository.IscrizioneRepository;
import it.arenahub.backend.repository.SquadraRepository;
import it.arenahub.backend.repository.TorneoRepository;

@Service
public class TorneoService {

	private final TorneoRepository torneoRepository;
	private final CategoriaRepository categoriaRepository;
	private final SquadraRepository squadraRepository;
	private final IscrizioneRepository iscrizioneRepository;

	public TorneoService(TorneoRepository torneoRepository, CategoriaRepository categoriaRepository,
			SquadraRepository squadraRepository, IscrizioneRepository iscrizioneRepository) {
		this.torneoRepository = torneoRepository;
		this.categoriaRepository = categoriaRepository;
		this.squadraRepository = squadraRepository;
		this.iscrizioneRepository = iscrizioneRepository;
	}

	public TorneoDettaglioResponse dettaglio(Integer id, Integer idUtente) {
		Torneo torneo = torneoRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Torneo non trovato"));
		MiaSquadraResponse miaSquadra = idUtente == null ? null
				: iscrizioneRepository.findByTorneoIdAndUtenteId(id, idUtente)
						.map(i -> MiaSquadraResponse.da(i.getSquadra(), idUtente))
						.orElse(null);
		return new TorneoDettaglioResponse(TorneoResponse.da(torneo, squadraRepository.countByTorneoId(id)), miaSquadra);
	}

	public List<SquadraResponse> squadre(Integer idTorneo) {
		if (!torneoRepository.existsById(idTorneo)) {
			throw new ApiException(HttpStatus.NOT_FOUND, "Torneo non trovato");
		}
		return squadraRepository.findByTorneoIdOrderById(idTorneo).stream()
				.map(s -> SquadraResponse.da(s, iscrizioneRepository.findBySquadraIdOrderById(s.getId()).stream()
						.map(i -> ComponenteResponse.da(i.getUtente()))
						.toList()))
				.toList();
	}

	public List<TorneoResponse> elenco(String stato, String inCorso, String gioco, String categoria,
			String cerca, String ordina, String direzione) {
		Stream<TorneoResponse> tornei = tutti().stream();

		if (stato != null) {
			Set<StatoTorneo> stati = new HashSet<>();
			for (String s : stato.split(",")) {
				try {
					stati.add(StatoTorneo.valueOf(s.trim()));
				} catch (IllegalArgumentException e) {
					throw new ApiException(HttpStatus.BAD_REQUEST, "Parametro non valido");
				}
			}
			tornei = tornei.filter(t -> stati.contains(t.stato()));
		}
		if (inCorso != null) {
			if (!inCorso.equals("true") && !inCorso.equals("false")) {
				throw new ApiException(HttpStatus.BAD_REQUEST, "Parametro non valido");
			}
			boolean valore = Boolean.parseBoolean(inCorso);
			tornei = tornei.filter(t -> t.inCorso() == valore);
		}
		if (categoria != null) {
			String nomeCategoria = categoriaRepository.findByNomeIgnoreCase(categoria)
					.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Categoria non trovata"))
					.getNome();
			tornei = tornei.filter(t -> t.categoria().equals(nomeCategoria));
		}
		if (gioco != null) {
			tornei = tornei.filter(t -> t.gioco().equalsIgnoreCase(gioco));
		}
		if (cerca != null) {
			String testo = cerca.toLowerCase();
			tornei = tornei.filter(t -> t.nome().toLowerCase().contains(testo));
		}

		Comparator<TorneoResponse> ordine = switch (ordina == null ? "dataOra" : ordina) {
			case "dataOra" -> Comparator.comparing(TorneoResponse::dataOra);
			case "nome" -> Comparator.comparing(TorneoResponse::nome, String.CASE_INSENSITIVE_ORDER);
			case "postiLiberi" -> Comparator.comparingInt(t -> t.postiMax() - t.iscritti());
			default -> throw new ApiException(HttpStatus.BAD_REQUEST, "Parametro non valido");
		};
		if (direzione != null && !direzione.equals("asc") && !direzione.equals("desc")) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Parametro non valido");
		}
		if ("desc".equals(direzione)) {
			ordine = ordine.reversed();
		}
		return tornei.sorted(ordine).toList();
	}

	public List<TorneoResponse> top() {
		return tutti().stream()
				.sorted(Comparator.comparingInt(TorneoResponse::iscritti)
						.thenComparing(TorneoResponse::dataOra).reversed())
				.limit(3)
				.toList();
	}

	public List<TorneoResponse> live() {
		return tutti().stream()
				.filter(TorneoResponse::inCorso)
				.sorted(Comparator.comparing(TorneoResponse::dataOra))
				.toList();
	}

	private List<TorneoResponse> tutti() {
		return torneoRepository.findAll().stream()
				.map(t -> TorneoResponse.da(t, squadraRepository.countByTorneoId(t.getId())))
				.toList();
	}
}
