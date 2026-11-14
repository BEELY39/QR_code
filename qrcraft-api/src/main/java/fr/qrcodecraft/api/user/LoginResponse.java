package fr.qrcodecraft.api.user;

/**
 * Réponse d'une connexion réussie. Le jeton n'y figure jamais : il part dans le cookie de session.
 *
 * @param newAccount {@code true} si le compte vient d'être créé (message de bienvenue)
 */
public record LoginResponse(UserResponse user, boolean newAccount) {
}
