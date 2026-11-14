package fr.qrcodecraft.api.scan.context;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.springframework.stereotype.Component;

/**
 * Déduit la langue préférée de l'en-tête {@code Accept-Language}, avec le JDK seul
 * (FR-011, R4).
 */
@Component
public class LanguageResolver {

	private static final String WILDCARD = "*";

	private static final String UNDETERMINED = "und";

	public Optional<String> resolve(String acceptLanguage) {
		if (acceptLanguage == null || acceptLanguage.isBlank()) {
			return Optional.empty();
		}
		List<Locale.LanguageRange> ranges;
		try {
			// La liste est déjà triée par poids décroissant.
			ranges = Locale.LanguageRange.parse(acceptLanguage);
		}
		catch (IllegalArgumentException ex) {
			return Optional.empty();
		}
		return ranges.stream()
			.map(Locale.LanguageRange::getRange)
			.filter(range -> !WILDCARD.equals(range))
			.map(range -> Locale.forLanguageTag(range).toLanguageTag())
			.filter(tag -> !UNDETERMINED.equals(tag))
			.findFirst();
	}

}
