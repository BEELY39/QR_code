package fr.qrcodecraft.api.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import fr.qrcodecraft.api.user.GoogleLoginException;

/** Traduit les erreurs en réponses {@link ApiError} (contracts/auth-api.md). */
@RestControllerAdvice
public class ApiExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

	@ExceptionHandler({ MethodArgumentNotValidException.class, HttpMessageNotReadableException.class })
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	ApiError invalidRequest() {
		return new ApiError(ApiError.INVALID_REQUEST);
	}

	/**
	 * Raison technique journalisée côté serveur, sans e-mail ni jeton ; le navigateur ne reçoit
	 * qu'un code stable (FR-007).
	 */
	@ExceptionHandler(GoogleLoginException.class)
	ResponseEntity<ApiError> googleLogin(GoogleLoginException ex) {
		String cause = ex.getCause() == null ? "-" : ex.getCause().getClass().getSimpleName();
		log.info("Connexion Google refusée : {} (cause : {})", ex.reason().code(), cause);
		return ResponseEntity.status(ex.reason().status()).body(new ApiError(ex.reason().code()));
	}

}
