package fr.qrcodecraft.api.security;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

/**
 * Jetons QRCraft signés HS256 et vérification des jetons d'identité Google
 * (FR-013, FR-014, R5, R6). Aucune bibliothèque ajoutée : tout vient de
 * {@code spring-security-oauth2-jose} (FR-015).
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties({ JwtProperties.class, GoogleProperties.class })
public class JwtConfig {

	private static final String HMAC_SHA256 = "HmacSHA256";

	/** Préfixes des valeurs jetables des profils dev et test. */
	private static final String[] THROWAWAY_PREFIXES = { "dev-only-", "test-only-" };

	@Bean
	SecretKey qrcraftJwtKey(JwtProperties properties, Environment environment) {
		rejectThrowawaySecretOutsideDevAndTest(properties.secret(), environment);
		return new SecretKeySpec(properties.secret().getBytes(StandardCharsets.UTF_8), HMAC_SHA256);
	}

	@Bean
	JwtEncoder qrcraftJwtEncoder(SecretKey qrcraftJwtKey) {
		return NimbusJwtEncoder.withSecretKey(qrcraftJwtKey).algorithm(MacAlgorithm.HS256).build();
	}

	/** Seul décodeur du serveur de ressources : l'API n'accepte que les jetons QRCraft. */
	@Bean
	@Primary
	JwtDecoder qrcraftJwtDecoder(SecretKey qrcraftJwtKey, JwtProperties properties) {
		NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(qrcraftJwtKey).macAlgorithm(MacAlgorithm.HS256).build();
		decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(properties.issuer()));
		return decoder;
	}

	/**
	 * Vérifie un jeton d'identité Google ; réservé au futur point de connexion,
	 * jamais branché sur la chaîne de sécurité.
	 */
	@Bean
	JwtDecoder googleIdTokenDecoder(GoogleProperties properties) {
		return GoogleIdTokenDecoderFactory.create(properties.clientId());
	}

	private static void rejectThrowawaySecretOutsideDevAndTest(String secret, Environment environment) {
		boolean devOrTest = environment.acceptsProfiles(Profiles.of("dev | test"));
		for (String prefix : THROWAWAY_PREFIXES) {
			if (secret.startsWith(prefix) && !devOrTest) {
				throw new IllegalStateException("Secret JWT jetable (" + prefix
						+ "…) refusé hors des profils dev et test : définir QRCRAFT_SECURITY_JWT_SECRET");
			}
		}
	}

}
