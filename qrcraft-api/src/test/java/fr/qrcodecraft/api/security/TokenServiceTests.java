package fr.qrcodecraft.api.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Map;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

/**
 * US4 — contenu du jeton QRCraft émis (FR-014).
 */
class TokenServiceTests {

	private static final String SECRET = "0123456789abcdef0123456789abcdef";

	private final SecretKey key = new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");

	private final JwtProperties properties = new JwtProperties(SECRET, null, Duration.ofMinutes(30));

	@Test
	void issuedTokenCarriesStandardAndBusinessClaims() {
		Instant now = Instant.now().minusSeconds(5);
		TokenService service = new TokenService(NimbusJwtEncoder.withSecretKey(key).algorithm(MacAlgorithm.HS256).build(),
				properties, Clock.fixed(now, ZoneOffset.UTC));

		String token = service.issue("user-42", Map.of("email", "test@example.com", "iss", "tentative-de-surcharge"));
		Jwt jwt = NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build().decode(token);

		assertThat(jwt.getSubject()).isEqualTo("user-42");
		assertThat(jwt.getClaimAsString("iss")).isEqualTo("qrcraft-api");
		assertThat(jwt.getClaimAsString("email")).isEqualTo("test@example.com");
		assertThat(jwt.getIssuedAt()).isEqualTo(now.truncatedTo(java.time.temporal.ChronoUnit.SECONDS));
		assertThat(jwt.getExpiresAt()).isEqualTo(jwt.getIssuedAt().plus(Duration.ofMinutes(30)));
		assertThat(jwt.getHeaders()).containsEntry("alg", "HS256");
	}

}
