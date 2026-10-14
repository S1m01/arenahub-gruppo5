package it.arenahub.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import it.arenahub.backend.dto.ClassificaGeneraleResponse;
import it.arenahub.backend.dto.ClassificaGiocatoreResponse;
import it.arenahub.backend.dto.ClassificaSquadraResponse;
import it.arenahub.backend.exception.ApiException;
import it.arenahub.backend.model.Categoria;
import it.arenahub.backend.repository.CategoriaRepository;
import it.arenahub.backend.repository.TorneoRepository;
import it.arenahub.backend.repository.UtenteRepository;

@Service
public class ClassificaService {

	private final TorneoRepository torneoRepository;
	private final UtenteRepository utenteRepository;
	private final CategoriaRepository categoriaRepository;

	public ClassificaService(TorneoRepository torneoRepository, UtenteRepository utenteRepository,
			CategoriaRepository categoriaRepository) {
		this.torneoRepository = torneoRepository;
		this.utenteRepository = utenteRepository;
		this.categoriaRepository = categoriaRepository;
	}

	public List<ClassificaSquadraResponse> classificaTorneo(Integer idTorneo) {
		controllaTorneo(idTorneo);
		return torneoRepository.classificaSquadre(idTorneo);
	}

	public List<ClassificaGiocatoreResponse> classificaGiocatoriTorneo(Integer idTorneo) {
		controllaTorneo(idTorneo);
		return torneoRepository.classificaGiocatori(idTorneo);
	}

	public List<ClassificaGeneraleResponse> classificaGenerale() {
		return utenteRepository.classificaGenerale();
	}

	public List<ClassificaGeneraleResponse> classificaTop() {
		return utenteRepository.classificaTop();
	}

	public List<ClassificaGeneraleResponse> classificaCategoria(String nome) {
		Categoria categoria = categoriaRepository.findByNomeIgnoreCase(nome)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Categoria non trovata"));
		return utenteRepository.classificaCategoria(categoria.getId());
	}

	private void controllaTorneo(Integer idTorneo) {
		if (!torneoRepository.existsById(idTorneo)) {
			throw new ApiException(HttpStatus.NOT_FOUND, "Torneo non trovato");
		}
	}
}
