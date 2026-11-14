package fr.qrcodecraft.api.config;

import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Un spec Caffeine par cache, sous {@code qrcraft.cache.specs.<nom>} (FR-008).
 *
 * <p>Chaque spec doit borner la taille <strong>et</strong> la durée de vie : un cache
 * non borné ferait grossir la mémoire sans limite, ce que la constitution interdit
 * (principe VII).
 */
@ConfigurationProperties("qrcraft.cache")
public record CacheProperties(Map<String, String> specs) {

	private static final Pattern SIZE_BOUND = Pattern.compile("(^|,)\\s*maximumSize=\\d+");

	private static final Pattern TIME_BOUND = Pattern.compile("(^|,)\\s*expireAfter(Write|Access)=\\w+");

	public CacheProperties {
		if (specs == null || specs.isEmpty()) {
			throw new IllegalArgumentException("qrcraft.cache.specs doit déclarer au moins un cache");
		}
		specs.forEach((name, spec) -> {
			if (!SIZE_BOUND.matcher(spec).find() || !TIME_BOUND.matcher(spec).find()) {
				throw new IllegalArgumentException("Le cache '" + name
						+ "' doit être borné en taille (maximumSize) et en durée (expireAfterWrite ou expireAfterAccess) : " + spec);
			}
		});
		specs = Map.copyOf(specs);
	}

}
