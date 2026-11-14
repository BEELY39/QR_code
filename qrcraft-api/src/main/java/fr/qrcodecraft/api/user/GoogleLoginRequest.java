package fr.qrcodecraft.api.user;

import jakarta.validation.constraints.NotBlank;

/**
 * Corps de {@code POST /api/auth/google}.
 *
 * @param credential jeton d'identité remis par la fenêtre Google
 */
public record GoogleLoginRequest(@NotBlank String credential) {
}
