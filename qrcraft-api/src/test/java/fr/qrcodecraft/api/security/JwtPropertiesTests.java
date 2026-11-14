package fr.qrcodecraft.api.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

/**
 * US4 — l'application refuse de démarrer sans secret valable (FR-006, FR-014, cas limite
 * « clés de signature »).
 */
class JwtPropertiesTests {

	private static final String SECRET_32 = "0123456789abcdef0123456789abcdef";

	private final ApplicationContextRunner runner = new ApplicationContextRunner()
		.withUserConfiguration(JwtConfig.class)
		.withPropertyValues("qrcraft.security.google.client-id=client-id-de-test");

	@Test
	void missingSecretPreventsStartup() {
		runner.run(context -> assertThat(context).hasFailed()
			.getFailure().rootCause().hasMessageContaining("qrcraft.security.jwt.secret"));
	}

	@Test
	void secretShorterThan32BytesPreventsStartup() {
		runner.withPropertyValues("qrcraft.security.jwt.secret=" + SECRET_32.substring(1))
			.run(context -> assertThat(context).hasFailed()
				.getFailure().rootCause().hasMessageContaining("32 octets"));
	}

	@Test
	void secretOf32BytesStartsWithDefaults() {
		runner.withPropertyValues("qrcraft.security.jwt.secret=" + SECRET_32).run(context -> {
			assertThat(context).hasNotFailed();
			JwtProperties properties = context.getBean(JwtProperties.class);
			assertThat(properties.issuer()).isEqualTo("qrcraft-api");
			assertThat(properties.ttl()).hasHours(1);
			assertThat(properties.toString()).doesNotContain(SECRET_32);
		});
	}

	@Test
	void throwawaySecretIsRefusedOutsideDevAndTest() {
		runner.withPropertyValues("qrcraft.security.jwt.secret=test-only-" + SECRET_32)
			.run(context -> assertThat(context).hasFailed()
				.getFailure().rootCause().hasMessageContaining("refusé hors des profils dev et test"));
	}

	@Test
	void throwawaySecretIsAcceptedInTestProfile() {
		runner.withPropertyValues("qrcraft.security.jwt.secret=test-only-" + SECRET_32, "spring.profiles.active=test")
			.run(context -> assertThat(context).hasNotFailed());
	}

	@Test
	void missingGoogleClientIdPreventsStartup() {
		new ApplicationContextRunner().withUserConfiguration(JwtConfig.class)
			.withPropertyValues("qrcraft.security.jwt.secret=" + SECRET_32)
			.run(context -> assertThat(context).hasFailed()
				.getFailure().rootCause().hasMessageContaining("qrcraft.security.google.client-id"));
	}

}
