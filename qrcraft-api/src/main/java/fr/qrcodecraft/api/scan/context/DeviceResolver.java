package fr.qrcodecraft.api.scan.context;

import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Component;

import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;

/**
 * Déduit système, type d'appareil et caractère robot d'un User-Agent, hors ligne
 * (FR-010, R3).
 *
 * <p>L'analyseur est restreint aux seuls champs utiles pour limiter son empreinte
 * mémoire et son temps de démarrage.
 */
@Component
public class DeviceResolver {

	static final String DEVICE_CLASS = "DeviceClass";

	static final String OPERATING_SYSTEM_NAME = "OperatingSystemName";

	static final String AGENT_NAME = "AgentName";

	private static final Set<String> MOBILE_CLASSES = Set.of("Phone", "Mobile");

	private static final Set<String> TABLET_CLASSES = Set.of("Tablet", "eReader");

	private static final Set<String> BOT_CLASSES = Set.of("Robot", "Robot Mobile", "Robot Imitator", "Hacker", "Spy");

	private final UserAgentAnalyzer analyzer;

	public DeviceResolver() {
		this.analyzer = UserAgentAnalyzer.newBuilder()
			.withFields(DEVICE_CLASS, OPERATING_SYSTEM_NAME, AGENT_NAME)
			.withCache(10_000)
			.hideMatcherLoadStats()
			.dropTests()
			.immediateInitialization()
			.build();
	}

	public DeviceInfo resolve(String userAgent) {
		if (userAgent == null || userAgent.isBlank()) {
			return DeviceInfo.unknown();
		}
		UserAgent parsed = analyzer.parse(userAgent);
		String deviceClass = parsed.getValue(DEVICE_CLASS);
		return new DeviceInfo(known(parsed.getValue(OPERATING_SYSTEM_NAME)), toType(deviceClass),
				BOT_CLASSES.contains(deviceClass));
	}

	private static DeviceType toType(String deviceClass) {
		if (MOBILE_CLASSES.contains(deviceClass)) {
			return DeviceType.MOBILE;
		}
		if (TABLET_CLASSES.contains(deviceClass)) {
			return DeviceType.TABLET;
		}
		return DeviceType.DESKTOP;
	}

	/** Les valeurs « inconnues » de Yauaa ({@code Unknown}, {@code ??}) deviennent vides. */
	private static Optional<String> known(String value) {
		if (value == null || value.isBlank() || "Unknown".equals(value) || "??".equals(value)) {
			return Optional.empty();
		}
		return Optional.of(value);
	}

}
