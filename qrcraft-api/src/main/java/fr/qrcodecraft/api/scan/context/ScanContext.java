package fr.qrcodecraft.api.scan.context;

import java.util.Optional;

/**
 * Contexte non identifiant d'un scan, destiné à la future entité {@code Scan}.
 * Aucun champ ne contient l'adresse IP (FR-012).
 *
 * @param language langue préférée en balise BCP 47 ({@code fr-FR}), vide si inconnue
 */
public record ScanContext(GeoLocation location, DeviceInfo device, Optional<String> language) {
}
