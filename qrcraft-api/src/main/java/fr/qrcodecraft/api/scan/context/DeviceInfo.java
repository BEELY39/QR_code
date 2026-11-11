package fr.qrcodecraft.api.scan.context;

import java.util.Optional;

/**
 * Système, type d'appareil et caractère robot déduits du User-Agent.
 *
 * @param os   nom du système ({@code iOS}, {@code Android}, {@code Windows}…), vide si inconnu
 * @param type type d'appareil
 * @param bot  {@code true} pour un robot ou un prévisualiseur de liens, à exclure des statistiques
 */
public record DeviceInfo(Optional<String> os, DeviceType type, boolean bot) {

	private static final DeviceInfo UNKNOWN = new DeviceInfo(Optional.empty(), DeviceType.DESKTOP, false);

	public static DeviceInfo unknown() {
		return UNKNOWN;
	}

}
