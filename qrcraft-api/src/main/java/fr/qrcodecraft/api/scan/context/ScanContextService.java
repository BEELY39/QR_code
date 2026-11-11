package fr.qrcodecraft.api.scan.context;

import org.springframework.stereotype.Service;

/**
 * Contexte non identifiant d'un scan, consommé par la future redirection
 * {@code /r/{shortCode}} (cf. contracts/scan-context.md).
 *
 * <p>Garanties : aucune exception pour une entrée absente ou mal formée, aucune E/S
 * réseau, et l'adresse IP n'est ni conservée, ni journalisée, ni renvoyée (FR-012).
 */
@Service
public class ScanContextService {

	private final GeoIpResolver geoIpResolver;

	private final DeviceResolver deviceResolver;

	private final LanguageResolver languageResolver;

	public ScanContextService(GeoIpResolver geoIpResolver, DeviceResolver deviceResolver,
			LanguageResolver languageResolver) {
		this.geoIpResolver = geoIpResolver;
		this.deviceResolver = deviceResolver;
		this.languageResolver = languageResolver;
	}

	public ScanContext resolve(String clientIp, String userAgent, String acceptLanguage) {
		return new ScanContext(geoIpResolver.resolve(clientIp), deviceResolver.resolve(userAgent),
				languageResolver.resolve(acceptLanguage));
	}

}
