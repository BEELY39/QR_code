-- Feature 013 : comptes utilisateurs créés à la première connexion Google.
-- Aucune autre donnée personnelle que celles-ci (FR-002) ; recherche par google_subject, jamais par e-mail.
CREATE TABLE users (
    id             uuid         PRIMARY KEY,
    google_subject varchar(255) NOT NULL,
    email          varchar(320) NOT NULL,
    display_name   varchar(255) NOT NULL,
    picture_url    text,
    created_at     timestamptz  NOT NULL,
    last_login_at  timestamptz  NOT NULL,
    CONSTRAINT uk_users_google_subject UNIQUE (google_subject)
);
