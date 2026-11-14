package fr.qrcodecraft.api.scan.context;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URISyntaxException;
import java.nio.file.Path;
import java.util.Objects;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;

/**
 * US3 — assemblage du contexte de scan, sans jamais laisser fuir l'IP (FR-012, SC-005).
 */
@ExtendWith(OutputCaptureExtension.class)
class ScanContextServiceTests {

	private static final String CLIENT_IP = "2.125.160.216";

	private static GeoIpResolver geoIpResolver;

	private static ScanContextService service;

	@BeforeAll
	static void buildService() throws URISyntaxException {
		Path database = Path.of(Objects.requireNonNull(
				ScanContextServiceTests.class.getResource("/geoip/GeoIP2-City-Test.mmdb")).toURI());
		geoIpResolver = new GeoIpResolver(new GeoIpProperties(database));
		service = new ScanContextService(geoIpResolver, new DeviceResolver(), new LanguageResolver());
	}

	@AfterAll
	static void closeDatabase() {
		geoIpResolver.close();
	}

	@Test
	void assemblesLocationDeviceAndLanguage() {
		ScanContext context = service.resolve(CLIENT_IP, DeviceResolverTests.IPHONE, "fr-FR,fr;q=0.9");

		assertThat(context.location().city()).contains("Boxford");
		assertThat(context.location().countryCode()).contains("GB");
		assertThat(context.device().os()).contains("iOS");
		assertThat(context.device().type()).isEqualTo(DeviceType.MOBILE);
		assertThat(context.language()).contains("fr-FR");
	}

	@Test
	void missingInputsGiveAnEmptyContext() {
		ScanContext context = service.resolve(null, null, null);

		assertThat(context.location()).isEqualTo(GeoLocation.unknown());
		assertThat(context.device()).isEqualTo(DeviceInfo.unknown());
		assertThat(context.language()).isEmpty();
	}

	@Test
	void clientIpNeverAppearsInLogsOrResult(CapturedOutput output) {
		ScanContext context = service.resolve(CLIENT_IP, DeviceResolverTests.GOOGLEBOT, "en");
		service.resolve("pas-une-ip", null, null);

		assertThat(output.getAll()).doesNotContain(CLIENT_IP);
		assertThat(context.toString()).doesNotContain(CLIENT_IP);
	}

}
