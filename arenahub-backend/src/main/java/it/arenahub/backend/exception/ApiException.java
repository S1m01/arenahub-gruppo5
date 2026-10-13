package it.arenahub.backend.exception;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

	private final HttpStatus status;

	public ApiException(HttpStatus status, String messaggio) {
		super(messaggio);
		this.status = status;
	}

	public HttpStatus getStatus() {
		return status;
	}
}
