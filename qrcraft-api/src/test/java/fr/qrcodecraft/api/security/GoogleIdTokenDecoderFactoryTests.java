package fr.qrcodecraft.api.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Instant;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.gen.RSAKeyGenerator;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;

/**
 * US4 — vérification hors ligne d'un jeton d'identité « Google » signé par une clé RSA
 * locale (FR-013, R6).
 */
class GoogleIdTokenDecoderFactoryTests {

	private static final String CLIENT_ID = "1234.apps.googleusercontent.com";

	private static RSAKey googleKey;

	private static RSAKey otherKey;

	private static JwtDecoder decoder;

	@BeforeAll
	static void generateKeys() throws JOSEException {
		googleKey = new RSAKeyGenerator(2048).keyID("google-kid").generate();
		otherKey = new RSAKeyGenerator(2048).keyID("google-kid").generate();
		decoder = GoogleIdTokenDecoderFactory.create(CLIENT_ID, new ImmutableJWKSet<>(new JWKSet(googleKey.toPublicJWK())));
	}

	@ParameterizedTest
	@ValueSource(strings = { "accounts.google.com", "https://accounts.google.com" })
	void bothGoogleIssuerFormsAreAccepted(String issuer) {
		String token = sign(googleKey, issuer, CLIENT_ID, Instant.now().plusSeconds(600));

		assertThat(decoder.decode(token).getSubject()).isEqualTo("google-user-1");
	}

	@Test
	void foreignIssuerIsRejected() {
		String token = sign(googleKey, "https://evil.example.com", CLIENT_ID, Instant.now().plusSeconds(600));

		assertThatThrownBy(() -> decoder.decode(token)).isInstanceOf(JwtException.class);
	}

	@Test
	void foreignAudienceIsRejected() {
		String token = sign(googleKey, "accounts.google.com", "autre-client.apps.googleusercontent.com", Instant.now().plusSeconds(600));

		assertThatThrownBy(() -> decoder.decode(token)).isInstanceOf(JwtException.class);
	}

	@Test
	void expiredTokenIsRejected() {
		String token = sign(googleKey, "accounts.google.com", CLIENT_ID, Instant.now().minusSeconds(3600));

		assertThatThrownBy(() -> decoder.decode(token)).isInstanceOf(JwtException.class);
	}

	@Test
	void tokenSignedByAnotherKeyIsRejected() {
		String token = sign(otherKey, "accounts.google.com", CLIENT_ID, Instant.now().plusSeconds(600));

		assertThatThrownBy(() -> decoder.decode(token)).isInstanceOf(JwtException.class);
	}

	private static String sign(RSAKey key, String issuer, String audience, Instant expiresAt) {
		JwtEncoder encoder = new NimbusJwtEncoder(new ImmutableJWKSet<>(new JWKSet(key)));
		JwtClaimsSet claims = JwtClaimsSet.builder()
			.issuer(issuer)
			.subject("google-user-1")
			.audience(List.of(audience))
			.issuedAt(expiresAt.minusSeconds(3600))
			.expiresAt(expiresAt)
			.build();
		JwsHeader header = JwsHeader.with(SignatureAlgorithm.RS256).keyId(key.getKeyID()).type("JWT").build();
		return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
	}

}
