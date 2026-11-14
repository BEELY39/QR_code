package fr.qrcodecraft.api.scan.context;

import java.util.Optional;

/**
 * Ville et pays déduits d'une adresse IP. Ne contient jamais l'IP elle-même (FR-012).
 *
 * @param city        nom de la ville, en français si la base le fournit, sinon en anglais
 * @param countryCode code ISO 3166-1 alpha-2, en majuscules
 * @param countryName nom du pays, même règle de langue que {@code city}
 */
public record GeoLocation(Optional<String> city, Optional<String> countryCode, Optional<String> countryName) {

	private static final GeoLocation UNKNOWN = new GeoLocation(Optional.empty(), Optional.empty(), Optional.empty());

	public static GeoLocation unknown() {
		return UNKNOWN;
	}

}
