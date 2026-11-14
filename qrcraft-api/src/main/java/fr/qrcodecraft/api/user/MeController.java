package fr.qrcodecraft.api.user;

import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import fr.qrcodecraft.api.security.SessionCookieService;

/**
 * {@code GET /api/me} : l'utilisateur de la session (contracts/auth-api.md). Un jeton valide dont
 * le compte n'existe plus est traité comme une session expirée, et son cookie effacé.
 */
@RestController
public class MeController {

	private final UserRepository repository;

	private final SessionCookieService sessionCookie;

	public MeController(UserRepository repository, SessionCookieService sessionCookie) {
		this.repository = repository;
		this.sessionCookie = sessionCookie;
	}

	@GetMapping("/api/me")
	public ResponseEntity<UserResponse> me(@AuthenticationPrincipal Jwt jwt) {
		return parseId(jwt.getSubject())
			.flatMap(repository::findById)
			.map(user -> ResponseEntity.ok(UserResponse.from(user)))
			.orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.header(HttpHeaders.SET_COOKIE, sessionCookie.clear().toString())
				.build());
	}

	private static Optional<UUID> parseId(String subject) {
		try {
			return Optional.of(UUID.fromString(subject));
		}
		catch (IllegalArgumentException | NullPointerException invalid) {
			return Optional.empty();
		}
	}

}
