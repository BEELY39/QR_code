package fr.qrcodecraft.api.scan.context;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

/**
 * US3 — langue préférée depuis l'en-tête Accept-Language (FR-011).
 */
class LanguageResolverTests {

	private final LanguageResolver resolver = new LanguageResolver();

	@ParameterizedTest
	@CsvSource(delimiter = '|', value = {
		"fr-FR,fr;q=0.9,en;q=0.8 | fr-FR",
		"en                      | en",
		"en-us                   | en-US",
		"de;q=0.5,es-ES;q=0.9    | es-ES",
		"*,fr;q=0.5              | fr"
	})
	void preferredLanguageIsReturnedAsBcp47Tag(String header, String expected) {
		assertThat(resolver.resolve(header)).contains(expected);
	}

	@ParameterizedTest
	@NullAndEmptySource
	@ValueSource(strings = { "*", ";;;", "fr;q=abc", "   " })
	void missingOrInvalidHeaderIsEmpty(String header) {
		assertThat(resolver.resolve(header)).isEmpty();
	}

}
