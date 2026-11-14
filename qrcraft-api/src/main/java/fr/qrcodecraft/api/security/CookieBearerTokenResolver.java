package fr.qrcodecraft.api.security;

import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.web.util.WebUtils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Lit le jeton QRCraft dans l'en-tête {@code Authorization: Bearer …} s'il est présent (tests,
 * clients non navigateur), sinon dans le cookie de session posé par l'API.
 */
public class CookieBearerTokenResolver implements BearerTokenResolver {

	private final DefaultBearerTokenResolver headerResolver = new DefaultBearerTokenResolver();

	private final String cookieName;

	public CookieBearerTokenResolver(String cookieName) {
		this.cookieName = cookieName;
	}

	@Override
	public String resolve(HttpServletRequest request) {
		String fromHeader = headerResolver.resolve(request);
		if (fromHeader != null) {
			return fromHeader;
		}
		Cookie cookie = WebUtils.getCookie(request, cookieName);
		return (cookie == null || cookie.getValue().isBlank()) ? null : cookie.getValue();
	}

}
