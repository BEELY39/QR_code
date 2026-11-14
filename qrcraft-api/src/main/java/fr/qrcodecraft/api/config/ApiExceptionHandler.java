package fr.qrcodecraft.api.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Traduit les erreurs en réponses {@link ApiError} (contracts/auth-api.md). */
@RestControllerAdvice
public class ApiExceptionHandler {

	@ExceptionHandler({ MethodArgumentNotValidException.class, HttpMessageNotReadableException.class })
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	ApiError invalidRequest() {
		return new ApiError(ApiError.INVALID_REQUEST);
	}

}
