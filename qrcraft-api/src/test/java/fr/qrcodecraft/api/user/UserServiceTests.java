package fr.qrcodecraft.api.user;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import fr.qrcodecraft.api.TestcontainersConfiguration;

/**
 * US1 — création ou mise à jour du compte depuis l'identité Google, sans doublon
 * (FR-001 à FR-003, SC-002). Catégorie 2, contre un vrai PostgreSQL.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class UserServiceTests {

	private static final Instant T0 = Instant.parse("2026-11-14T10:00:00Z");

	@Autowired
	private UserRepository repository;

	private UserService serviceAt(Instant now) {
		return new UserService(repository, Clock.fixed(now, ZoneOffset.UTC));
	}

	private static GoogleIdentity identity(String email, String name, String picture) {
		return new GoogleIdentity("google-sub-1", email, true, name, picture);
	}

	@Test
	void firstLoginCreatesTheAccount() {
		UserService.LoginResult result = serviceAt(T0).loginWithGoogle(identity("a@example.com", "Alice", "https://img/a"));

		assertThat(result.newAccount()).isTrue();
		User user = repository.findByGoogleSubject("google-sub-1").orElseThrow();
		assertThat(user.getEmail()).isEqualTo("a@example.com");
		assertThat(user.getDisplayName()).isEqualTo("Alice");
		assertThat(user.getPictureUrl()).isEqualTo("https://img/a");
		assertThat(user.getCreatedAt()).isEqualTo(T0);
		assertThat(user.getLastLoginAt()).isEqualTo(T0);
	}

	@Test
	void nextLoginFindsTheSameAccountAndRefreshesProfile() {
		User created = serviceAt(T0).loginWithGoogle(identity("a@example.com", "Alice", "https://img/a")).user();
		Instant later = T0.plus(3, ChronoUnit.DAYS);

		UserService.LoginResult result = serviceAt(later).loginWithGoogle(identity("a@example.com", "Alice B.", "https://img/b"));

		assertThat(result.newAccount()).isFalse();
		assertThat(result.user().getId()).isEqualTo(created.getId());
		User user = repository.findById(created.getId()).orElseThrow();
		assertThat(user.getDisplayName()).isEqualTo("Alice B.");
		assertThat(user.getPictureUrl()).isEqualTo("https://img/b");
		assertThat(user.getCreatedAt()).isEqualTo(T0);
		assertThat(user.getLastLoginAt()).isEqualTo(later);
	}

	@Test
	void changedEmailStillFindsTheAccountByGoogleSubject() {
		User created = serviceAt(T0).loginWithGoogle(identity("old@example.com", "Alice", null)).user();

		User again = serviceAt(T0.plusSeconds(60)).loginWithGoogle(identity("new@example.com", "Alice", null)).user();

		assertThat(again.getId()).isEqualTo(created.getId());
		assertThat(repository.findById(created.getId()).orElseThrow().getEmail()).isEqualTo("new@example.com");
	}

	@Test
	void twentyLoginsNeverCreateDuplicates() {
		for (int i = 0; i < 20; i++) {
			serviceAt(T0.plusSeconds(i)).loginWithGoogle(identity("a@example.com", "Alice", null));
		}

		assertThat(repository.count()).isEqualTo(1);
	}

}
