package fr.qrcodecraft.api.security;

import java.time.Duration;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

/**
 * Pose et efface le cookie de session. Le jeton n'est jamais lisible par le JavaScript du site
 * ({@code HttpOnly}) et n'est envoyé qu'à l'API ({@code Path=/api}, host-only, {@code SameSite=Strict}).
 */
@Component
public class SessionCookieService {

	static final String PATH = "/api";

	static final String SAME_SITE = "Strict";

	private final SessionCookieProperties properties;

	private final JwtProperties jwtProperties;

	public SessionCookieService(SessionCookieProperties properties, JwtProperties jwtProperties) {
		this.properties = properties;
		this.jwtProperties = jwtProperties;
	}

	public ResponseCookie create(String token) {
		return base(token).maxAge(jwtProperties.ttl()).build();
	}

	public ResponseCookie clear() {
		return base("").maxAge(Duration.ZERO).build();
	}

	public String cookieName() {
		return properties.name();
	}

	private ResponseCookie.ResponseCookieBuilder base(String value) {
		return ResponseCookie.from(properties.name(), value)
			.httpOnly(true)
			.secure(properties.secure())
			.sameSite(SAME_SITE)
			.path(PATH);
	}

}
