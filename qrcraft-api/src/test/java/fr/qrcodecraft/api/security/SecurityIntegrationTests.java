package fr.qrcodecraft.api.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import fr.qrcodecraft.api.config.SecurityConfig;

/**
 * US4 — la chaîne de sécurité n'accepte que des jetons QRCraft valides (FR-014,
 * contracts/health.md). Tranche web seule : pas de base nécessaire.
 */
@WebMvcTest(controllers = SecurityIntegrationTests.MeController.class)
@Import({ SecurityConfig.class, JwtConfig.class, TokenService.class, SecurityIntegrationTests.MeController.class })
@ActiveProfiles("test")
class SecurityIntegrationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private TokenService tokenService;

	@Autowired
	private JwtEncoder encoder;

	@Autowired
	private JwtProperties properties;

	@Test
	void validTokenIsAccepted() throws Exception {
		String token = tokenService.issue("user-42", Map.of());

		mockMvc.perform(get("/test/me").header("Authorization", "Bearer " + token))
			.andExpect(status().isOk())
			.andExpect(content().string("user-42"));
	}

	@Test
	void missingTokenIsRejected() throws Exception {
		mockMvc.perform(get("/test/me")).andExpect(status().isUnauthorized());
	}

	@Test
	void tamperedTokenIsRejected() throws Exception {
		String token = tokenService.issue("user-42", Map.of());
		int signatureStart = token.lastIndexOf('.') + 1;
		char original = token.charAt(signatureStart + 4);
		String tampered = token.substring(0, signatureStart + 4) + (original == 'A' ? 'B' : 'A')
				+ token.substring(signatureStart + 5);

		mockMvc.perform(get("/test/me").header("Authorization", "Bearer " + tampered))
			.andExpect(status().isUnauthorized());
	}

	@Test
	void expiredTokenIsRejected() throws Exception {
		// Émis il y a « durée de vie + 1 h » : expiré quelle que soit la durée configurée (7 j depuis 013).
		Instant issuedAt = Instant.now().minus(properties.ttl()).minusSeconds(3600);
		String token = new TokenService(encoder, properties, Clock.fixed(issuedAt, ZoneOffset.UTC)).issue("user-42", Map.of());

		mockMvc.perform(get("/test/me").header("Authorization", "Bearer " + token))
			.andExpect(status().isUnauthorized());
	}

	@Test
	void tokenFromAnotherIssuerIsRejected() throws Exception {
		Instant now = Instant.now();
		JwtClaimsSet claims = JwtClaimsSet.builder()
			.issuer("autre-emetteur")
			.subject("user-42")
			.issuedAt(now)
			.expiresAt(now.plusSeconds(600))
			.build();
		String token = encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).type("JWT").build(), claims))
			.getTokenValue();

		mockMvc.perform(get("/test/me").header("Authorization", "Bearer " + token))
			.andExpect(status().isUnauthorized());
	}

	@RestController
	static class MeController {

		@GetMapping("/test/me")
		String me(@AuthenticationPrincipal Jwt jwt) {
			return jwt.getSubject();
		}

	}

}
