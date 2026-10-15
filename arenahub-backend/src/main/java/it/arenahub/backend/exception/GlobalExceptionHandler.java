package it.arenahub.backend.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import it.arenahub.backend.dto.ErroreResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(ApiException.class)
	public ResponseEntity<ErroreResponse> gestisciApi(ApiException e) {
		return ResponseEntity.status(e.getStatus()).body(new ErroreResponse(e.getMessage()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErroreResponse> gestisciValidazione(MethodArgumentNotValidException e) {
		return ResponseEntity.badRequest().body(new ErroreResponse("Dati non validi"));
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ErroreResponse> gestisciParametro(MethodArgumentTypeMismatchException e) {
		return ResponseEntity.badRequest().body(new ErroreResponse("Parametro non valido"));
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ErroreResponse> gestisciBodyIlleggibile(HttpMessageNotReadableException e) {
		return ResponseEntity.badRequest().body(new ErroreResponse("Dati non validi"));
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ErroreResponse> gestisciConflitto(DataIntegrityViolationException e) {
		return ResponseEntity.status(HttpStatus.CONFLICT)
				.body(new ErroreResponse("Dati già presenti: ricarica la pagina e riprova"));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErroreResponse> gestisciErrore(Exception e) {
		if (e instanceof ErrorResponse errore) {
			return ResponseEntity.status(errore.getStatusCode()).body(new ErroreResponse("Richiesta non valida"));
		}
		log.error("Errore non gestito", e);
		return ResponseEntity.internalServerError().body(new ErroreResponse("Errore interno del server"));
	}
}
