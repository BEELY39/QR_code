package fr.qrcodecraft.api.user;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.domain.Persistable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PostPersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

/**
 * Compte QRCraft, créé à la première connexion Google (data-model.md, table {@code users}).
 *
 * <p>L'identifiant est attribué par l'application ; {@link Persistable} évite à Spring Data une
 * lecture préalable inutile lors de la création.
 */
@Entity
@Table(name = "users")
public class User implements Persistable<UUID> {

	@Id
	private UUID id;

	@Column(name = "google_subject", nullable = false, unique = true, updatable = false)
	private String googleSubject;

	@Column(nullable = false, length = 320)
	private String email;

	@Column(name = "display_name", nullable = false)
	private String displayName;

	@Column(name = "picture_url", columnDefinition = "text")
	private String pictureUrl;

	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@Column(name = "last_login_at", nullable = false)
	private Instant lastLoginAt;

	@Transient
	private boolean isNew;

	protected User() {
		// Requis par JPA.
	}

	private User(UUID id, String googleSubject, Instant now) {
		this.id = id;
		this.googleSubject = googleSubject;
		this.createdAt = now;
		this.isNew = true;
	}

	/** Nouveau compte à partir d'une identité Google vérifiée. */
	public static User fromGoogle(GoogleIdentity identity, Instant now) {
		User user = new User(UUID.randomUUID(), identity.subject(), now);
		user.refreshFrom(identity, now);
		return user;
	}

	/** Reprend e-mail, nom et photo fournis par Google et note la connexion. */
	public void refreshFrom(GoogleIdentity identity, Instant now) {
		this.email = identity.email();
		this.displayName = identity.name();
		this.pictureUrl = identity.pictureUrl();
		this.lastLoginAt = now;
	}

	@PostLoad
	@PostPersist
	void markNotNew() {
		this.isNew = false;
	}

	@Override
	public UUID getId() {
		return id;
	}

	@Override
	public boolean isNew() {
		return isNew;
	}

	public String getGoogleSubject() {
		return googleSubject;
	}

	public String getEmail() {
		return email;
	}

	public String getDisplayName() {
		return displayName;
	}

	public String getPictureUrl() {
		return pictureUrl;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getLastLoginAt() {
		return lastLoginAt;
	}

}
