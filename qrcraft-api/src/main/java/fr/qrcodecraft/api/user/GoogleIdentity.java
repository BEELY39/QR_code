package fr.qrcodecraft.api.user;

import org.springframework.security.oauth2.jwt.Jwt;

/**
 * Identité extraite d'un jeton d'identité Google déjà vérifié (signature, émetteur, audience,
 * expiration).
 *
 * @param subject       identifiant Google stable ({@code sub}) — clé de recherche du compte
 * @param email         adresse e-mail Google
 * @param emailVerified {@code true} si Google atteste l'adresse ({@code email_verified})
 * @param name          nom affiché ; à défaut, partie locale de l'e-mail
 * @param pictureUrl    URL de la photo de profil, éventuellement {@code null}
 */
public record GoogleIdentity(String subject, String email, boolean emailVerified, String name, String pictureUrl) {

	public static GoogleIdentity from(Jwt jwt) {
		String email = jwt.getClaimAsString("email");
		String name = jwt.getClaimAsString("name");
		if ((name == null || name.isBlank()) && email != null) {
			int at = email.indexOf('@');
			name = at > 0 ? email.substring(0, at) : email;
		}
		return new GoogleIdentity(jwt.getSubject(), email, isTrue(jwt.getClaim("email_verified")), name,
				jwt.getClaimAsString("picture"));
	}

	/** Google renvoie un booléen, parfois une chaîne {@code "true"}. */
	private static boolean isTrue(Object claim) {
		return claim instanceof Boolean flag ? flag : claim != null && Boolean.parseBoolean(claim.toString());
	}

}
