package fr.qrcodecraft.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.sql.SQLException;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.flywaydb.core.api.MigrationState;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.zaxxer.hikari.HikariDataSource;

/**
 * US1 — le socle démarre contre un vrai PostgreSQL et n'expose que sa santé
 * (FR-003 à FR-005, FR-017, SC-007).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class QrcraftApiApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private Flyway flyway;

	@Autowired
	private DataSource dataSource;

	@Autowired
	private Environment environment;

	@Test
	void contextLoads() {
		// Le démarrage lui-même est l'assertion : base, Flyway, JPA et sécurité câblés.
	}

	@Test
	void flywayHasNoFailedMigration() {
		MigrationInfo[] migrations = flyway.info().all();
		assertThat(migrations).noneMatch(info -> info.getState() == MigrationState.FAILED);
	}

	@Test
	void healthIsPublicAndUp() throws Exception {
		mockMvc.perform(get("/actuator/health"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.status").value("UP"))
			.andExpect(jsonPath("$.components").doesNotExist());
	}

	@Test
	void otherActuatorEndpointsAreNotReachable() throws Exception {
		mockMvc.perform(get("/actuator/env")).andExpect(status().isUnauthorized());
		mockMvc.perform(get("/actuator/info")).andExpect(status().isUnauthorized());
		mockMvc.perform(get("/actuator")).andExpect(status().isUnauthorized());
	}

	@Test
	void connectionPoolIsCappedAtFive() throws SQLException {
		assertThat(dataSource.unwrap(HikariDataSource.class).getMaximumPoolSize()).isEqualTo(5);
	}

	@Test
	void virtualThreadsAreEnabled() {
		assertThat(environment.getProperty("spring.threads.virtual.enabled", Boolean.class)).isTrue();
	}

}
