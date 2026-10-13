package it.arenahub.backend.service;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import it.arenahub.backend.dto.TorneoResponse;
import it.arenahub.backend.exception.ApiException;
import it.arenahub.backend.model.StatoTorneo;
import it.arenahub.backend.repository.CategoriaRepository;
import it.arenahub.backend.repository.TorneoRepository;

@Service
public class TorneoService {

	private final TorneoRepository torneoRepository;
	private final CategoriaRepository categoriaRepository;

	public TorneoService(TorneoRepository torneoRepository, CategoriaRepository categoriaRepository) {
		this.torneoRepository = torneoRepository;
		this.categoriaRepository = categoriaRepository;
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
					throw new ApiException(HttpStatus.BAD_REQUEST, "Parametro non valido: stato");
				}
			}
			tornei = tornei.filter(t -> stati.contains(t.stato()));
		}
		if (inCorso != null) {
			if (!inCorso.equals("true") && !inCorso.equals("false")) {
				throw new ApiException(HttpStatus.BAD_REQUEST, "Parametro non valido: inCorso");
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
			default -> throw new ApiException(HttpStatus.BAD_REQUEST, "Parametro non valido: ordina");
		};
		if (direzione != null && !direzione.equals("asc") && !direzione.equals("desc")) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Parametro non valido: direzione");
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
				.map(t -> TorneoResponse.da(t, torneoRepository.contaIscritti(t.getId())))
				.toList();
	}
}
