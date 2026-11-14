package fr.qrcodecraft.api.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Origines du site autorisées à appeler l'API avec le cookie de session (FR-019).
 * Jamais {@code *} : interdit par les navigateurs dès que les cookies sont envoyés.
 *
 * @param allowedOrigins {@code QRCRAFT_CORS_ALLOWED_ORIGINS}, séparées par des virgules
 */
@ConfigurationProperties("qrcraft.cors")
public record CorsProperties(List<String> allowedOrigins) {

	public CorsProperties {
		if (allowedOrigins == null || allowedOrigins.isEmpty()) {
			throw new IllegalArgumentException("qrcraft.cors.allowed-origins doit déclarer au moins une origine");
		}
		if (allowedOrigins.stream().anyMatch(origin -> origin.contains("*"))) {
			throw new IllegalArgumentException("qrcraft.cors.allowed-origins n'accepte pas de joker '*'");
		}
		allowedOrigins = List.copyOf(allowedOrigins);
	}

}
