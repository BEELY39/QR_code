package fr.qrcodecraft.api.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

/**
 * Chaîne de sécurité de l'API : sans état, authentification par jeton QRCraft, seule la
 * santé est publique (cf. contracts/health.md).
 */
@Configuration(proxyBeanMethods = false)
public class SecurityConfig {

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http, @Qualifier("qrcraftJwtDecoder") JwtDecoder qrcraftJwtDecoder)
			throws Exception {
		http
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			// API à jeton porteur, sans cookie : pas de CSRF possible.
			.csrf(AbstractHttpConfigurer::disable)
			.formLogin(AbstractHttpConfigurer::disable)
			.httpBasic(AbstractHttpConfigurer::disable)
			.logout(AbstractHttpConfigurer::disable)
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/actuator/health").permitAll()
				.anyRequest().authenticated())
			// 401 (et non 403) pour toute requête anonyme sur un chemin protégé.
			// Jeton porteur QRCraft uniquement ; le décodeur Google n'est jamais branché ici.
			.oauth2ResourceServer(resourceServer -> resourceServer
				.jwt(jwt -> jwt.decoder(qrcraftJwtDecoder))
				.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
			.exceptionHandling(errors -> errors.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));
		return http.build();
	}

}
