package fr.qrcodecraft.api.scan.context;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;

/**
 * US3 — système, type d'appareil et robots depuis le User-Agent (FR-010).
 */
class DeviceResolverTests {

	static final String IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 "
			+ "(KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

	static final String IPAD = "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 "
			+ "(KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

	static final String ANDROID_PHONE = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 "
			+ "(KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36";

	static final String CHROME_WINDOWS = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
			+ "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

	static final String GOOGLEBOT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

	private static DeviceResolver resolver;

	@BeforeAll
	static void buildAnalyzer() {
		resolver = new DeviceResolver();
	}

	@Test
	void iphoneIsAnIosMobile() {
		DeviceInfo device = resolver.resolve(IPHONE);

		assertThat(device.os()).contains("iOS");
		assertThat(device.type()).isEqualTo(DeviceType.MOBILE);
		assertThat(device.bot()).isFalse();
	}

	@Test
	void androidPhoneIsAnAndroidMobile() {
		DeviceInfo device = resolver.resolve(ANDROID_PHONE);

		assertThat(device.os()).contains("Android");
		assertThat(device.type()).isEqualTo(DeviceType.MOBILE);
	}

	@Test
	void ipadIsATablet() {
		assertThat(resolver.resolve(IPAD).type()).isEqualTo(DeviceType.TABLET);
	}

	@Test
	void chromeOnWindowsIsADesktop() {
		DeviceInfo device = resolver.resolve(CHROME_WINDOWS);

		assertThat(device.os()).contains("Windows NT");
		assertThat(device.type()).isEqualTo(DeviceType.DESKTOP);
		assertThat(device.bot()).isFalse();
	}

	@Test
	void googlebotIsFlaggedAsBot() {
		assertThat(resolver.resolve(GOOGLEBOT).bot()).isTrue();
	}

	@ParameterizedTest
	@NullAndEmptySource
	void missingUserAgentIsUnknown(String userAgent) {
		assertThat(resolver.resolve(userAgent)).isEqualTo(DeviceInfo.unknown());
	}

}
