package fr.qrcodecraft.api.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Identifiant client OAuth Google, audience attendue des jetons d'identité Google (FR-013).
 *
 * @param clientId {@code <n>.apps.googleusercontent.com} ({@code QRCRAFT_SECURITY_GOOGLE_CLIENT_ID})
 */
@ConfigurationProperties("qrcraft.security.google")
public record GoogleProperties(String clientId) {

	public GoogleProperties {
		if (clientId == null || clientId.isBlank()) {
			throw new IllegalArgumentException(
					"qrcraft.security.google.client-id est obligatoire (variable QRCRAFT_SECURITY_GOOGLE_CLIENT_ID)");
		}
	}

}
