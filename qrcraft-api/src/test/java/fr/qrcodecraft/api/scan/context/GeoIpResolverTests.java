package fr.qrcodecraft.api.scan.context;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URISyntaxException;
import java.nio.file.Path;
import java.util.Objects;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

/**
 * US3 — géolocalisation hors ligne sur la base de test MaxMind (FR-009, SC-004).
 */
class GeoIpResolverTests {

	private static GeoIpResolver resolver;

	@BeforeAll
	static void openTestDatabase() throws URISyntaxException {
		Path database = Path.of(Objects.requireNonNull(
				GeoIpResolverTests.class.getResource("/geoip/GeoIP2-City-Test.mmdb")).toURI());
		resolver = new GeoIpResolver(new GeoIpProperties(database));
	}

	@AfterAll
	static void closeDatabase() {
		resolver.close();
	}

	@Test
	void knownAddressGivesCityAndCountryWithFrenchNamesFirst() {
		GeoLocation location = resolver.resolve("2.125.160.216");

		assertThat(location.city()).contains("Boxford");
		assertThat(location.countryCode()).contains("GB");
		assertThat(location.countryName()).contains("Royaume-Uni");
	}

	@Test
	void addressAbsentFromDatabaseIsUnknown() {
		assertThat(resolver.resolve("203.0.113.7")).isEqualTo(GeoLocation.unknown());
	}

	@ParameterizedTest
	@ValueSource(strings = { "10.0.0.1", "192.168.1.20", "172.16.4.2", "127.0.0.1", "169.254.1.1", "::1", "fd00::1", "fe80::1" })
	void nonPublicAddressesAreNeverLookedUp(String address) {
		assertThat(resolver.resolve(address)).isEqualTo(GeoLocation.unknown());
	}

	@ParameterizedTest
	@NullAndEmptySource
	@ValueSource(strings = { "pas-une-ip", "example.com", "999.1.1.1", "1.2.3", "  " })
	void invalidInputIsUnknownWithoutException(String address) {
		assertThat(resolver.resolve(address)).isEqualTo(GeoLocation.unknown());
	}

	@Test
	void missingDatabaseFileLeavesResolverEmptyButUsable() {
		GeoIpResolver withoutDatabase = new GeoIpResolver(new GeoIpProperties(Path.of("absent", "dbip-city-lite.mmdb")));

		assertThat(withoutDatabase.isAvailable()).isFalse();
		assertThat(withoutDatabase.resolve("2.125.160.216")).isEqualTo(GeoLocation.unknown());
		withoutDatabase.close();
	}

	@Test
	void unconfiguredDatabaseLeavesResolverEmptyButUsable() {
		GeoIpResolver unconfigured = new GeoIpResolver(new GeoIpProperties(null));

		assertThat(unconfigured.isAvailable()).isFalse();
		assertThat(unconfigured.resolve("2.125.160.216")).isEqualTo(GeoLocation.unknown());
		unconfigured.close();
	}

}
