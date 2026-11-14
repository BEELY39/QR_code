package fr.qrcodecraft.api.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Cookie qui porte le jeton QRCraft (contracts/session-cookie.md).
 *
 * @param name   nom du cookie, {@code qrcraft_session} par défaut
 * @param secure attribut {@code Secure} ; {@code true} par défaut, {@code false} en dev (http://localhost)
 */
@ConfigurationProperties("qrcraft.session.cookie")
public record SessionCookieProperties(String name, Boolean secure) {

	static final String DEFAULT_NAME = "qrcraft_session";

	public SessionCookieProperties {
		name = (name == null || name.isBlank()) ? DEFAULT_NAME : name;
		secure = (secure == null) ? Boolean.TRUE : secure;
	}

}
