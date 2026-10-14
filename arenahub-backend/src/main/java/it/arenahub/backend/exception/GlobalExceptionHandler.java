package it.arenahub.backend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import it.arenahub.backend.dto.ErroreResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

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
}
