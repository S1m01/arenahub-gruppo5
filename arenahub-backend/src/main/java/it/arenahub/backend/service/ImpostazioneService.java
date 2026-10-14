package it.arenahub.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import it.arenahub.backend.dto.ImpostazioniRequest;
import it.arenahub.backend.dto.ImpostazioniResponse;
import it.arenahub.backend.exception.ApiException;
import it.arenahub.backend.model.Impostazione;
import it.arenahub.backend.model.StatoTorneo;
import it.arenahub.backend.repository.ImpostazioneRepository;
import it.arenahub.backend.repository.IscrizioneRepository;

@Service
public class ImpostazioneService {

	private static final String MAX_TORNEI_ATTIVI = "max_tornei_attivi";

	private final ImpostazioneRepository impostazioneRepository;
	private final IscrizioneRepository iscrizioneRepository;

	public ImpostazioneService(ImpostazioneRepository impostazioneRepository,
			IscrizioneRepository iscrizioneRepository) {
		this.impostazioneRepository = impostazioneRepository;
		this.iscrizioneRepository = iscrizioneRepository;
	}

	public int maxTorneiAttivi() {
		return impostazioneRepository.findById(MAX_TORNEI_ATTIVI)
				.map(Impostazione::getValore)
				.orElse(3);
	}

	public long torneiAttivi(Integer idUtente) {
		return iscrizioneRepository.countByUtenteIdAndTorneoStatoNot(idUtente, StatoTorneo.concluso);
	}

	public boolean puoIscriversi(Integer idUtente) {
		return torneiAttivi(idUtente) < maxTorneiAttivi();
	}

	public ImpostazioniResponse leggi() {
		return new ImpostazioniResponse(maxTorneiAttivi());
	}

	public ImpostazioniResponse modifica(ImpostazioniRequest req) {
		if (req == null || !(req.maxTorneiAttivi() instanceof Integer valore) || valore < 1 || valore > 20) {
			throw new ApiException(HttpStatus.BAD_REQUEST,
					"Dati non validi: il limite deve essere un numero intero da 1 a 20");
		}
		impostazioneRepository.save(new Impostazione(MAX_TORNEI_ATTIVI, valore));
		return new ImpostazioniResponse(valore);
	}
}
