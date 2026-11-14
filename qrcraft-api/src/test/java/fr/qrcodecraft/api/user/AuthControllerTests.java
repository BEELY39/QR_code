package fr.qrcodecraft.api.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.convention.TestBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

import fr.qrcodecraft.api.TestcontainersConfiguration;
import fr.qrcodecraft.api.security.TestGoogleKeys;

/**
 * US1 — {@code POST /api/auth/google} : création ou connexion, cookie de session, refus de toute
 * preuve invalide sans toucher aux comptes (contracts/auth-api.md, SC-003). Catégorie 3.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class AuthControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository repository;

	/** Remplace le décodeur Google réel par celui de la clé de test, hors ligne. */
	@TestBean(name = "googleIdTokenDecoder", methodName = "testGoogleDecoder")
	private JwtDecoder googleIdTokenDecoder;

	static JwtDecoder testGoogleDecoder() {
		return TestGoogleKeys.decoder();
	}

	@BeforeEach
	void emptyUsers() {
		repository.deleteAll();
	}

	@AfterEach
	void googleBackOnline() {
		TestGoogleKeys.setUnavailable(false);
	}

	private ResultActions login(String credential) throws Exception {
		String body = credential == null ? "{}" : "{\"credential\":\"" + credential + "\"}";
		return mockMvc.perform(post("/api/auth/google").contentType(MediaType.APPLICATION_JSON).content(body));
	}

	@Test
	void firstLoginCreatesAccountAndSetsSessionCookie() throws Exception {
		MvcResult result = login(TestGoogleKeys.validToken("sub-1", "a@example.com"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.newAccount").value(true))
			.andExpect(jsonPath("$.user.email").value("a@example.com"))
			.andExpect(jsonPath("$.user.displayName").value("Prénom Nom"))
			.andExpect(jsonPath("$.user.id").isNotEmpty())
			.andReturn();

		String setCookie = result.getResponse().getHeader(HttpHeaders.SET_COOKIE);
		assertThat(setCookie).startsWith("qrcraft_session=")
			.contains("HttpOnly", "Secure", "SameSite=Strict", "Path=/api", "Max-Age=604800");
		String token = setCookie.substring("qrcraft_session=".length(), setCookie.indexOf(';'));
		assertThat(token).isNotBlank();
		assertThat(result.getResponse().getContentAsString()).doesNotContain(token);
		assertThat(repository.count()).isEqualTo(1);
	}

	@Test
	void secondLoginIsNotANewAccount() throws Exception {
		login(TestGoogleKeys.validToken("sub-1", "a@example.com")).andExpect(status().isOk());

		login(TestGoogleKeys.validToken("sub-1", "a@example.com"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.newAccount").value(false));
		assertThat(repository.count()).isEqualTo(1);
	}

	@Test
	void missingCredentialIsABadRequest() throws Exception {
		login(null).andExpect(status().isBadRequest()).andExpect(jsonPath("$.error").value("invalid_request"));
		login("").andExpect(status().isBadRequest()).andExpect(jsonPath("$.error").value("invalid_request"));
		assertThat(repository.count()).isZero();
	}

	@Test
	void tokenSignedByAnotherKeyIsRejected() throws Exception {
		assertInvalidGoogleToken(TestGoogleKeys.tokenSignedByOtherKey("sub-1", "a@example.com"));
	}

	@Test
	void tokenForAnotherApplicationIsRejected() throws Exception {
		assertInvalidGoogleToken(TestGoogleKeys.token(claims(true), "autre-client.apps.googleusercontent.com",
				TestGoogleKeys.ISSUER, Instant.now().plusSeconds(600)));
	}

	@Test
	void tokenFromAnotherIssuerIsRejected() throws Exception {
		assertInvalidGoogleToken(TestGoogleKeys.token(claims(true), TestGoogleKeys.CLIENT_ID, "https://evil.example.com",
				Instant.now().plusSeconds(600)));
	}

	@Test
	void expiredTokenIsRejected() throws Exception {
		assertInvalidGoogleToken(TestGoogleKeys.token(claims(true), TestGoogleKeys.CLIENT_ID, TestGoogleKeys.ISSUER,
				Instant.now().minusSeconds(3600)));
	}

	@Test
	void malformedTokenIsRejected() throws Exception {
		assertInvalidGoogleToken("pas-un-jeton");
	}

	@Test
	void unverifiedEmailIsForbidden() throws Exception {
		login(TestGoogleKeys.token(claims(false), TestGoogleKeys.CLIENT_ID, TestGoogleKeys.ISSUER, Instant.now().plusSeconds(600)))
			.andExpect(status().isForbidden())
			.andExpect(jsonPath("$.error").value("email_not_verified"));
		assertThat(repository.count()).isZero();
	}

	@Test
	void missingEmailVerifiedClaimIsForbidden() throws Exception {
		login(TestGoogleKeys.token(Map.of("sub", "sub-1", "email", "a@example.com"), TestGoogleKeys.CLIENT_ID,
				TestGoogleKeys.ISSUER, Instant.now().plusSeconds(600)))
			.andExpect(status().isForbidden())
			.andExpect(jsonPath("$.error").value("email_not_verified"));
		assertThat(repository.count()).isZero();
	}

	@Test
	void unreachableGoogleKeysGiveServiceUnavailable() throws Exception {
		TestGoogleKeys.setUnavailable(true);

		login(TestGoogleKeys.validToken("sub-1", "a@example.com"))
			.andExpect(status().isServiceUnavailable())
			.andExpect(jsonPath("$.error").value("google_unavailable"));
		assertThat(repository.count()).isZero();
	}

	private void assertInvalidGoogleToken(String credential) throws Exception {
		MvcResult result = login(credential)
			.andExpect(status().isUnauthorized())
			.andExpect(jsonPath("$.error").value("invalid_google_token"))
			.andReturn();
		assertThat(result.getResponse().getHeader(HttpHeaders.SET_COOKIE)).isNull();
		assertThat(repository.count()).isZero();
	}

	private static Map<String, Object> claims(boolean emailVerified) {
		return Map.of("sub", "sub-1", "email", "a@example.com", "email_verified", emailVerified, "name", "Alice");
	}

}
