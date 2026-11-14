package fr.qrcodecraft.api.user;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

/** Accès aux comptes ; un compte se retrouve par son identifiant Google, jamais par l'e-mail. */
public interface UserRepository extends JpaRepository<User, UUID> {

	Optional<User> findByGoogleSubject(String googleSubject);

}
