package fr.qrcodecraft.api.security;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.RemoteKeySourceException;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.gen.RSAKeyGenerator;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

/**
 * Faux « Google » pour les tests : une clé RSA locale signe des jetons d'identité, et un décodeur
 * construit par {@link GoogleIdTokenDecoderFactory} les vérifie — sans aucun appel réseau.
 *
 * <p>{@link #setUnavailable(boolean)} simule des clés Google injoignables.
 */
public final class TestGoogleKeys {

	/** Identifiant client de test (cf. application-test.properties). */
	public static final String CLIENT_ID = "test-only-client-id";

	public static final String ISSUER = "https://accounts.google.com";

	private static final RSAKey GOOGLE_KEY = generate("google-test-kid");

	private static final RSAKey OTHER_KEY = generate("google-test-kid");

	private static volatile boolean unavailable;

	private TestGoogleKeys() {
	}

	/** Décodeur à utiliser à la place du bean {@code googleIdTokenDecoder}. */
	public static JwtDecoder decoder() {
		JWKSource<SecurityContext> publicKeys = new ImmutableJWKSet<>(new JWKSet(GOOGLE_KEY.toPublicJWK()));
		JWKSource<SecurityContext> source = (selector, context) -> {
			if (unavailable) {
				throw new RemoteKeySourceException("clés Google injoignables (simulation)", null);
			}
			return publicKeys.get(selector, context);
		};
		return GoogleIdTokenDecoderFactory.create(CLIENT_ID, source);
	}

	public static void setUnavailable(boolean value) {
		unavailable = value;
	}

	/** Jeton « Google » valide pour {@code sub}, signé par la clé de test. */
	public static String validToken(String subject, String email) {
		return token(GOOGLE_KEY, Map.of("sub", subject, "email", email, "email_verified", true, "name", "Prénom Nom",
				"picture", "https://lh3.googleusercontent.com/a/test"), CLIENT_ID, ISSUER, Instant.now().plusSeconds(600));
	}

	public static String token(Map<String, Object> claims, String audience, String issuer, Instant expiresAt) {
		return token(GOOGLE_KEY, claims, audience, issuer, expiresAt);
	}

	/** Même identifiant de clé, autre clé privée : la signature doit être refusée. */
	public static String tokenSignedByOtherKey(String subject, String email) {
		return token(OTHER_KEY, Map.of("sub", subject, "email", email, "email_verified", true), CLIENT_ID, ISSUER,
				Instant.now().plusSeconds(600));
	}

	private static String token(RSAKey key, Map<String, Object> claims, String audience, String issuer, Instant expiresAt) {
		Map<String, Object> all = new LinkedHashMap<>(claims);
		JwtClaimsSet claimsSet = JwtClaimsSet.builder()
			.claims(existing -> existing.putAll(all))
			.issuer(issuer)
			.audience(List.of(audience))
			.issuedAt(expiresAt.minusSeconds(3600))
			.expiresAt(expiresAt)
			.build();
		JwsHeader header = JwsHeader.with(SignatureAlgorithm.RS256).keyId(key.getKeyID()).type("JWT").build();
		return new NimbusJwtEncoder(new ImmutableJWKSet<>(new JWKSet(key))).encode(JwtEncoderParameters.from(header, claimsSet))
			.getTokenValue();
	}

	private static RSAKey generate(String keyId) {
		try {
			return new RSAKeyGenerator(2048).keyID(keyId).generate();
		}
		catch (JOSEException ex) {
			throw new IllegalStateException(ex);
		}
	}

}
