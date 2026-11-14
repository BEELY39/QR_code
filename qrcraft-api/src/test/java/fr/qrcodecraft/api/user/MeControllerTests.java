package fr.qrcodecraft.api.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import fr.qrcodecraft.api.TestcontainersConfiguration;
import fr.qrcodecraft.api.security.JwtProperties;
import fr.qrcodecraft.api.security.TokenService;
import jakarta.servlet.http.Cookie;

/**
 * US2 — {@code GET /api/me} et CORS : la session est lue dans le cookie (ou l'en-tête Bearer),
 * tout le reste est refusé (SC-007, FR-019). Catégorie 3.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class MeControllerTests {

	private static final String SITE_ORIGIN = "http://localhost:4200";

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository repository;

	@Autowired
	private TokenService tokenService;

	@Autowired
	private JwtEncoder encoder;

	@Autowired
	private JwtProperties jwtProperties;

	private User user;

	@BeforeEach
	void createUser() {
		repository.deleteAll();
		user = repository.save(User.fromGoogle(
				new GoogleIdentity("sub-me", "me@example.com", true, "Moi", "https://img/me"), Instant.now()));
	}

	private String tokenFor(UUID subject) {
		return tokenService.issue(subject.toString(), Map.of());
	}

	@Test
	void sessionCookieIdentifiesTheUser() throws Exception {
		mockMvc.perform(get("/api/me").cookie(new Cookie("qrcraft_session", tokenFor(user.getId()))))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.id").value(user.getId().toString()))
			.andExpect(jsonPath("$.email").value("me@example.com"))
			.andExpect(jsonPath("$.displayName").value("Moi"))
			.andExpect(jsonPath("$.pictureUrl").value("https://img/me"))
			.andExpect(jsonPath("$.googleSubject").doesNotExist());
	}

	@Test
	void bearerHeaderIsAcceptedToo() throws Exception {
		mockMvc.perform(get("/api/me").header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenFor(user.getId())))
			.andExpect(status().isOk());
	}

	@Test
	void noSessionIsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/me")).andExpect(status().isUnauthorized());
	}

	@Test
	void expiredSessionIsUnauthorized() throws Exception {
		Instant issuedAt = Instant.now().minus(jwtProperties.ttl()).minusSeconds(3600);
		JwtClaimsSet claims = JwtClaimsSet.builder()
			.issuer(jwtProperties.issuer())
			.subject(user.getId().toString())
			.issuedAt(issuedAt)
			.expiresAt(issuedAt.plus(jwtProperties.ttl()))
			.build();
		String expired = encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).type("JWT").build(), claims))
			.getTokenValue();

		mockMvc.perform(get("/api/me").cookie(new Cookie("qrcraft_session", expired))).andExpect(status().isUnauthorized());
	}

	@Test
	void tamperedSessionIsUnauthorized() throws Exception {
		String token = tokenFor(user.getId());
		String tampered = token.substring(0, token.length() - 3) + (token.endsWith("AAA") ? "BBB" : "AAA");

		mockMvc.perform(get("/api/me").cookie(new Cookie("qrcraft_session", tampered))).andExpect(status().isUnauthorized());
	}

	@Test
	void sessionOfADeletedUserIsUnauthorizedAndCleared() throws Exception {
		MvcResult result = mockMvc.perform(get("/api/me").cookie(new Cookie("qrcraft_session", tokenFor(UUID.randomUUID()))))
			.andExpect(status().isUnauthorized())
			.andReturn();

		assertThat(result.getResponse().getHeader(HttpHeaders.SET_COOKIE)).startsWith("qrcraft_session=")
			.contains("Max-Age=0", "Path=/api");
	}

	@Test
	void preflightFromTheSiteIsAllowedWithCredentials() throws Exception {
		mockMvc.perform(options("/api/me")
				.header(HttpHeaders.ORIGIN, SITE_ORIGIN)
				.header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
			.andExpect(status().isOk())
			.andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, SITE_ORIGIN))
			.andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"));
	}

	@Test
	void preflightFromAnUnknownOriginIsNotAllowed() throws Exception {
		mockMvc.perform(options("/api/me")
				.header(HttpHeaders.ORIGIN, "https://exemple-malveillant.test")
				.header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
			.andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
	}

}
