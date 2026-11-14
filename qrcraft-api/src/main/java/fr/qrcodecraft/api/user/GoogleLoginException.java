package fr.qrcodecraft.api.user;

import org.springframework.http.HttpStatus;

/** Échec de la connexion Google, traduit en {@code ApiError} par {@code ApiExceptionHandler}. */
public class GoogleLoginException extends RuntimeException {

	public enum Reason {

		INVALID_GOOGLE_TOKEN(HttpStatus.UNAUTHORIZED, "invalid_google_token"),
		EMAIL_NOT_VERIFIED(HttpStatus.FORBIDDEN, "email_not_verified"),
		GOOGLE_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, "google_unavailable");

		private final HttpStatus status;

		private final String code;

		Reason(HttpStatus status, String code) {
			this.status = status;
			this.code = code;
		}

		public HttpStatus status() {
			return status;
		}

		public String code() {
			return code;
		}

	}

	private final Reason reason;

	public GoogleLoginException(Reason reason, Throwable cause) {
		super(reason.code(), cause);
		this.reason = reason;
	}

	public Reason reason() {
		return reason;
	}

}
