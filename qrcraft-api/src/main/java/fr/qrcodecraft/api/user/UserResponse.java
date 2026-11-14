package fr.qrcodecraft.api.user;

import java.util.UUID;

/** Utilisateur tel qu'exposé au site (contracts/auth-api.md). Jamais l'identifiant Google. */
public record UserResponse(UUID id, String email, String displayName, String pictureUrl) {

	public static UserResponse from(User user) {
		return new UserResponse(user.getId(), user.getEmail(), user.getDisplayName(), user.getPictureUrl());
	}

}
