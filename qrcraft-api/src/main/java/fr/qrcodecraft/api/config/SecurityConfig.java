package fr.qrcodecraft.api.config;

import java.time.Duration;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import fr.qrcodecraft.api.security.CookieBearerTokenResolver;
import fr.qrcodecraft.api.security.SessionCookieProperties;

/**
 * Chaîne de sécurité de l'API : sans état, authentification par jeton QRCraft lu dans le cookie de
 * session (ou l'en-tête {@code Authorization}), CORS limité aux origines du site
 * (contracts/auth-api.md, contracts/session-cookie.md).
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties({ CorsProperties.class, SessionCookieProperties.class })
public class SecurityConfig {

	static final List<String> CORS_METHODS = List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");

	static final Duration CORS_MAX_AGE = Duration.ofHours(1);

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http, @Qualifier("qrcraftJwtDecoder") JwtDecoder qrcraftJwtDecoder,
			SessionCookieProperties sessionCookie, CorsConfigurationSource corsConfigurationSource) throws Exception {
		HttpStatusEntryPoint unauthorized = new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED);
		http
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.cors(cors -> cors.configurationSource(corsConfigurationSource))
			// Cookie SameSite=Strict : aucun autre site ne peut l'envoyer, donc pas de CSRF possible.
			.csrf(AbstractHttpConfigurer::disable)
			.formLogin(AbstractHttpConfigurer::disable)
			.httpBasic(AbstractHttpConfigurer::disable)
			.logout(AbstractHttpConfigurer::disable)
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/actuator/health").permitAll()
				.requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
				.requestMatchers(HttpMethod.POST, "/api/auth/google", "/api/auth/logout").permitAll()
				.anyRequest().authenticated())
			// Jeton QRCraft uniquement ; le décodeur Google n'est jamais branché ici.
			.oauth2ResourceServer(resourceServer -> resourceServer
				.bearerTokenResolver(new CookieBearerTokenResolver(sessionCookie.name()))
				.jwt(jwt -> jwt.decoder(qrcraftJwtDecoder))
				.authenticationEntryPoint(unauthorized))
			// 401 (et non 403) pour toute requête anonyme sur un chemin protégé.
			.exceptionHandling(errors -> errors.authenticationEntryPoint(unauthorized));
		return http.build();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource(CorsProperties properties) {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(properties.allowedOrigins());
		configuration.setAllowedMethods(CORS_METHODS);
		configuration.setAllowedHeaders(List.of("Content-Type"));
		configuration.setAllowCredentials(true);
		configuration.setMaxAge(CORS_MAX_AGE);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/api/**", configuration);
		return source;
	}

}
