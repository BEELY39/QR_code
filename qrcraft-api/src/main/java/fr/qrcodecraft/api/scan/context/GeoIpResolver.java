package fr.qrcodecraft.api.scan.context;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.maxmind.db.MaxMindDbConstructor;
import com.maxmind.db.MaxMindDbParameter;
import com.maxmind.db.Reader;

import jakarta.annotation.PreDestroy;

/**
 * Déduit ville et pays d'une adresse IP à partir d'une base MMDB locale (DB-IP Lite),
 * sans aucun appel réseau (FR-009, SC-004).
 *
 * <p>L'IP n'est ni conservée ni journalisée (FR-012). Toute entrée absente, invalide,
 * non publique ou inconnue de la base donne {@link GeoLocation#unknown()}.
 */
@Component
public class GeoIpResolver implements AutoCloseable {

	private static final Logger log = LoggerFactory.getLogger(GeoIpResolver.class);

	private static final Pattern IPV4 = Pattern.compile("^(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}$");

	private static final Pattern IPV6 = Pattern.compile("^[0-9a-fA-F:.]+$");

	private final Reader reader;

	public GeoIpResolver(GeoIpProperties properties) {
		this.reader = open(properties.databasePath());
	}

	private static Reader open(Path databasePath) {
		if (databasePath == null) {
			log.warn("Géolocalisation désactivée : qrcraft.geoip.database-path n'est pas renseigné");
			return null;
		}
		if (!Files.isReadable(databasePath)) {
			log.warn("Géolocalisation désactivée : base introuvable ou illisible ({})", databasePath);
			return null;
		}
		try {
			return new Reader(databasePath.toFile(), Reader.FileMode.MEMORY_MAPPED);
		}
		catch (IOException ex) {
			throw new UncheckedIOException("Base de géolocalisation invalide : " + databasePath, ex);
		}
	}

	/** {@code true} si une base est chargée. */
	public boolean isAvailable() {
		return reader != null;
	}

	public GeoLocation resolve(String ip) {
		if (reader == null) {
			return GeoLocation.unknown();
		}
		Optional<InetAddress> address = parsePublicAddress(ip);
		if (address.isEmpty()) {
			return GeoLocation.unknown();
		}
		try {
			CityRecord record = reader.get(address.get(), CityRecord.class);
			return record == null ? GeoLocation.unknown() : record.toGeoLocation();
		}
		catch (IOException ex) {
			// Message sans l'IP : seule la nature de l'erreur est utile.
			log.warn("Lecture de la base de géolocalisation impossible : {}", ex.getClass().getSimpleName());
			return GeoLocation.unknown();
		}
	}

	/**
	 * Analyse un littéral IP sans résolution DNS (un nom d'hôte est refusé avant tout
	 * appel à {@link InetAddress}) et écarte les adresses non publiques.
	 */
	private static Optional<InetAddress> parsePublicAddress(String ip) {
		if (ip == null) {
			return Optional.empty();
		}
		String candidate = ip.strip();
		boolean literal = IPV4.matcher(candidate).matches()
				|| (candidate.indexOf(':') >= 0 && IPV6.matcher(candidate).matches());
		if (!literal) {
			return Optional.empty();
		}
		try {
			InetAddress address = InetAddress.getByName(candidate);
			return isPublic(address) ? Optional.of(address) : Optional.empty();
		}
		catch (UnknownHostException ex) {
			return Optional.empty();
		}
	}

	private static boolean isPublic(InetAddress address) {
		if (address.isAnyLocalAddress() || address.isLoopbackAddress() || address.isLinkLocalAddress()
				|| address.isSiteLocalAddress() || address.isMulticastAddress()) {
			return false;
		}
		// Adresses IPv6 locales uniques fc00::/7, non couvertes par isSiteLocalAddress().
		return !(address instanceof Inet6Address && (address.getAddress()[0] & 0xFE) == 0xFC);
	}

	@Override
	@PreDestroy
	public void close() {
		if (reader != null) {
			try {
				reader.close();
			}
			catch (IOException ex) {
				log.warn("Fermeture de la base de géolocalisation impossible : {}", ex.getClass().getSimpleName());
			}
		}
	}

	/** Seuls les champs utiles sont décodés : {@code city.names} et {@code country}. */
	public record CityRecord(Names city, Country country) {

		@MaxMindDbConstructor
		public CityRecord(@MaxMindDbParameter(name = "city") Names city,
				@MaxMindDbParameter(name = "country") Country country) {
			this.city = city;
			this.country = country;
		}

		GeoLocation toGeoLocation() {
			Optional<String> cityName = city == null ? Optional.empty() : city.preferred();
			Optional<String> code = country == null ? Optional.empty() : Optional.ofNullable(country.isoCode());
			Optional<String> countryName = country == null ? Optional.empty() : country.preferred();
			return new GeoLocation(cityName, code, countryName);
		}

	}

	public record Names(Map<String, String> names) {

		@MaxMindDbConstructor
		public Names(@MaxMindDbParameter(name = "names") Map<String, String> names) {
			this.names = names;
		}

		Optional<String> preferred() {
			return preferredName(names);
		}

	}

	public record Country(String isoCode, Map<String, String> names) {

		@MaxMindDbConstructor
		public Country(@MaxMindDbParameter(name = "iso_code") String isoCode,
				@MaxMindDbParameter(name = "names") Map<String, String> names) {
			this.isoCode = isoCode;
			this.names = names;
		}

		Optional<String> preferred() {
			return preferredName(names);
		}

	}

	/** Nom français si la base le fournit, sinon anglais. */
	private static Optional<String> preferredName(Map<String, String> names) {
		if (names == null) {
			return Optional.empty();
		}
		return Optional.ofNullable(names.getOrDefault("fr", names.get("en")));
	}

}
