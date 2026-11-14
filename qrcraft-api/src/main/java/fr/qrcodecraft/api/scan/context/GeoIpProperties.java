package fr.qrcodecraft.api.scan.context;

import java.nio.file.Path;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Emplacement de la base de géolocalisation hors ligne DB-IP Lite (FR-009).
 *
 * @param databasePath chemin du fichier {@code .mmdb} ; absent = géolocalisation désactivée
 */
@ConfigurationProperties("qrcraft.geoip")
public record GeoIpProperties(Path databasePath) {
}
