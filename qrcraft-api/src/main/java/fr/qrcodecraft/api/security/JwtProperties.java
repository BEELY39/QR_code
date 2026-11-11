package fr.qrcodecraft.api.security;

import java.nio.charset.StandardCharsets;
import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Paramètres du jeton QRCraft (FR-014, R5).
 *
 * <p>Le secret n'a aucune valeur par défaut : sans lui, l'application refuse de démarrer
 * au lieu de signer avec une clé connue.
 *
 * @param secret clé HMAC-SHA256, au moins 32 octets ({@code QRCRAFT_SECURITY_JWT_SECRET})
 * @param issuer émetteur des jetons, {@code qrcraft-api} par défaut
 * @param ttl    durée de vie des jetons, une heure par défaut
 */
@ConfigurationProperties("qrcraft.security.jwt")
public record JwtProperties(String secret, String issuer, Duration ttl) {

	/** 256 bits : taille minimale d'une clé HS256 (RFC 7518, §3.2). */
	static final int MIN_SECRET_BYTES = 32;

	static final String DEFAULT_ISSUER = "qrcraft-api";

	static final Duration DEFAULT_TTL = Duration.ofHours(1);

	public JwtProperties {
		if (secret == null || secret.isBlank()) {
			throw new IllegalArgumentException(
					"qrcraft.security.jwt.secret est obligatoire (variable QRCRAFT_SECURITY_JWT_SECRET)");
		}
		if (secret.getBytes(StandardCharsets.UTF_8).length < MIN_SECRET_BYTES) {
			throw new IllegalArgumentException(
					"qrcraft.security.jwt.secret doit faire au moins " + MIN_SECRET_BYTES + " octets");
		}
		issuer = (issuer == null || issuer.isBlank()) ? DEFAULT_ISSUER : issuer;
		ttl = (ttl == null) ? DEFAULT_TTL : ttl;
		if (ttl.isNegative() || ttl.isZero()) {
			throw new IllegalArgumentException("qrcraft.security.jwt.ttl doit être strictement positive");
		}
	}

	/** Le secret n'apparaît jamais dans un journal ni une trace. */
	@Override
	public String toString() {
		return "JwtProperties[secret=***, issuer=" + issuer + ", ttl=" + ttl + "]";
	}

}
