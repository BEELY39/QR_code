package fr.qrcodecraft.api.config;

/**
 * Corps d'erreur uniforme de l'API : un code stable, sans détail technique (FR-007).
 *
 * @param error code lisible par le site ({@code invalid_request}, {@code invalid_google_token}…)
 */
public record ApiError(String error) {

	public static final String INVALID_REQUEST = "invalid_request";

}
