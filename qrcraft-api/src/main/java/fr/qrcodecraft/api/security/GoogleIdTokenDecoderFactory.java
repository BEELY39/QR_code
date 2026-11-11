package fr.qrcodecraft.api.security;

import java.util.Set;

import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtAudienceValidator;
import org.springframework.security.oauth2.jwt.JwtClaimNames;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

/**
 * Décodeur des jetons d'identité Google (R6) : signature RS256 contre les clés publiques
 * de Google, émetteur Google, audience = notre identifiant client, expiration.
 */
public final class GoogleIdTokenDecoderFactory {

	/** Clés publiques de Google ; récupérées au premier décodage, pas au démarrage. */
	public static final String GOOGLE_JWK_SET_URI = "https://www.googleapis.com/oauth2/v3/certs";

	/** Google émet indifféremment l'une ou l'autre forme. */
	public static final Set<String> GOOGLE_ISSUERS = Set.of("accounts.google.com", "https://accounts.google.com");

	private GoogleIdTokenDecoderFactory() {
	}

	public static JwtDecoder create(String clientId) {
		NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(GOOGLE_JWK_SET_URI)
			.jwsAlgorithm(SignatureAlgorithm.RS256)
			.build();
		decoder.setJwtValidator(validator(clientId));
		return decoder;
	}

	/** Variante à source de clés injectable, pour vérifier hors ligne dans les tests. */
	public static JwtDecoder create(String clientId, JWKSource<SecurityContext> keySource) {
		NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSource(keySource)
			.jwsAlgorithm(SignatureAlgorithm.RS256)
			.build();
		decoder.setJwtValidator(validator(clientId));
		return decoder;
	}

	private static OAuth2TokenValidator<Jwt> validator(String clientId) {
		return new DelegatingOAuth2TokenValidator<>(
				new JwtTimestampValidator(),
				new JwtClaimValidator<Object>(JwtClaimNames.ISS, issuer -> issuer != null && GOOGLE_ISSUERS.contains(issuer.toString())),
				new JwtAudienceValidator(clientId));
	}

}
