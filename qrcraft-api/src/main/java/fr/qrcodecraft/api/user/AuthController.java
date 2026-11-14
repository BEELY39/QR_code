package fr.qrcodecraft.api.user;

import java.util.Map;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fr.qrcodecraft.api.security.SessionCookieService;
import fr.qrcodecraft.api.security.TokenService;
import jakarta.validation.Valid;

/**
 * Connexion par Google (contracts/auth-api.md). Le jeton QRCraft part dans un cookie
 * {@code HttpOnly}, jamais dans le corps de la réponse.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final JwtDecoder googleIdTokenDecoder;

	private final UserService userService;

	private final TokenService tokenService;

	private final SessionCookieService sessionCookie;

	public AuthController(@Qualifier("googleIdTokenDecoder") JwtDecoder googleIdTokenDecoder, UserService userService,
			TokenService tokenService, SessionCookieService sessionCookie) {
		this.googleIdTokenDecoder = googleIdTokenDecoder;
		this.userService = userService;
		this.tokenService = tokenService;
		this.sessionCookie = sessionCookie;
	}

	@PostMapping("/google")
	public ResponseEntity<LoginResponse> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
		GoogleIdentity identity = GoogleIdentity.from(verify(request.credential()));
		if (!identity.emailVerified()) {
			throw new GoogleLoginException(GoogleLoginException.Reason.EMAIL_NOT_VERIFIED, null);
		}
		UserService.LoginResult result = userService.loginWithGoogle(identity);
		String token = tokenService.issue(result.user().getId().toString(), Map.of());
		return ResponseEntity.ok()
			.header(HttpHeaders.SET_COOKIE, sessionCookie.create(token).toString())
			.body(new LoginResponse(UserResponse.from(result.user()), result.newAccount()));
	}

	/**
	 * Signature, émetteur, audience ou expiration refusés → 401 ; tout autre échec du décodage
	 * (clés publiques de Google injoignables) → 503.
	 */
	private Jwt verify(String credential) {
		try {
			return googleIdTokenDecoder.decode(credential);
		}
		catch (BadJwtException invalid) {
			throw new GoogleLoginException(GoogleLoginException.Reason.INVALID_GOOGLE_TOKEN, invalid);
		}
		catch (JwtException unavailable) {
			throw new GoogleLoginException(GoogleLoginException.Reason.GOOGLE_UNAVAILABLE, unavailable);
		}
	}

}
