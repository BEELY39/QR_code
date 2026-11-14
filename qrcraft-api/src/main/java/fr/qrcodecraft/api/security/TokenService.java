package fr.qrcodecraft.api.security;

import java.time.Clock;
import java.time.Instant;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

/**
 * Émet les jetons QRCraft, sans état serveur (FR-014). Appelé par le futur point de
 * connexion, une fois le jeton Google vérifié.
 */
@Service
public class TokenService {

	private final JwtEncoder encoder;

	private final JwtProperties properties;

	private final Clock clock;

	@Autowired
	public TokenService(JwtEncoder encoder, JwtProperties properties) {
		this(encoder, properties, Clock.systemUTC());
	}

	TokenService(JwtEncoder encoder, JwtProperties properties, Clock clock) {
		this.encoder = encoder;
		this.properties = properties;
		this.clock = clock;
	}

	/**
	 * @param subject identifiant stable de l'utilisateur
	 * @param claims  revendications métier ; {@code iss}, {@code sub}, {@code iat} et
	 *                {@code exp} sont toujours fixés par ce service
	 */
	public String issue(String subject, Map<String, Object> claims) {
		Instant now = clock.instant();
		JwtClaimsSet claimsSet = JwtClaimsSet.builder()
			.claims(existing -> existing.putAll(claims))
			.issuer(properties.issuer())
			.subject(subject)
			.issuedAt(now)
			.expiresAt(now.plus(properties.ttl()))
			.build();
		JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).type("JWT").build();
		return encoder.encode(JwtEncoderParameters.from(header, claimsSet)).getTokenValue();
	}

}
