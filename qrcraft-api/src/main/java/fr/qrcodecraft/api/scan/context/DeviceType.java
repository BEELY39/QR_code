package fr.qrcodecraft.api.scan.context;

import com.fasterxml.jackson.annotation.JsonValue;

/** Type d'appareil, aligné sur {@code DeviceType} du front ({@code stats.models.ts}). */
public enum DeviceType {

	MOBILE, TABLET, DESKTOP;

	@JsonValue
	public String json() {
		return name().toLowerCase(java.util.Locale.ROOT);
	}

}
