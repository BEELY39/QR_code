package fr.qrcodecraft.api.user;

import java.time.Clock;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

/**
 * Crée ou retrouve le compte d'une identité Google vérifiée (FR-001 à FR-003).
 * Clé de recherche : l'identifiant Google ({@code sub}), jamais l'e-mail.
 *
 * <p>Pas de transaction englobante : chaque appel au dépôt a la sienne, ce qui permet de reprendre
 * proprement après une création simultanée (contrainte d'unicité violée par l'autre onglet).
 */
@Service
public class UserService {

	private final UserRepository repository;

	private final Clock clock;

	@Autowired
	public UserService(UserRepository repository) {
		this(repository, Clock.systemUTC());
	}

	UserService(UserRepository repository, Clock clock) {
		this.repository = repository;
		this.clock = clock;
	}

	/** Résultat d'une connexion : le compte, et s'il vient d'être créé. */
	public record LoginResult(User user, boolean newAccount) {
	}

	public LoginResult loginWithGoogle(GoogleIdentity identity) {
		var now = clock.instant();
		var existing = repository.findByGoogleSubject(identity.subject());
		if (existing.isPresent()) {
			return new LoginResult(refresh(existing.get(), identity, now), false);
		}
		try {
			return new LoginResult(repository.saveAndFlush(User.fromGoogle(identity, now)), true);
		}
		catch (DataIntegrityViolationException concurrentCreation) {
			// Deux premières connexions simultanées (deux onglets) : l'autre a créé le compte.
			User user = repository.findByGoogleSubject(identity.subject()).orElseThrow(() -> concurrentCreation);
			return new LoginResult(refresh(user, identity, now), false);
		}
	}

	private User refresh(User user, GoogleIdentity identity, Instant now) {
		user.refreshFrom(identity, now);
		return repository.save(user);
	}

}
