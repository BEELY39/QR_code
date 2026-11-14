# Connexion Google — configuration de la console et des variables

QRCraft se connecte **uniquement avec Google**, par la fenêtre de choix de compte ouverte depuis le
site (Google Identity Services). Le site transmet le jeton d'identité Google à l'API, qui le vérifie
et pose son propre jeton de session dans un cookie `HttpOnly`.

**Conséquence pour la console Google : pas d'URI de redirection, et le secret client n'est jamais
utilisé.**

## 1. Écran de consentement OAuth

Console Google Cloud → **API et services → Écran de consentement OAuth**.

| Champ | Valeur |
|---|---|
| Type d'utilisateur | **Externe** |
| Nom de l'application | QRCraft |
| E-mail d'assistance | une adresse du propriétaire |
| Page d'accueil | `https://qrcode-craft.fr` |
| Règles de confidentialité | `https://qrcode-craft.fr/confidentialite` |
| Conditions d'utilisation | `https://qrcode-craft.fr/mentions-legales` |
| Domaines autorisés | `qrcode-craft.fr` |
| Portées | `openid`, `…/auth/userinfo.email`, `…/auth/userinfo.profile` — **rien d'autre** |
| Statut | « En test » au départ (ajouter les comptes testeurs), puis « En production » |

Avec ces seules portées, Google n'exige pas de validation de l'application.

## 2. Identifiant client OAuth

**Identifiants → Créer des identifiants → ID client OAuth → Application Web**

| Champ | Valeur |
|---|---|
| Origines JavaScript autorisées | `http://localhost:4200` · `http://localhost` · `https://qrcode-craft.fr` · `https://www.qrcode-craft.fr` |
| URI de redirection autorisés | **aucun** |

`http://localhost` sans port est exigé par Google, en plus de `http://localhost:4200`, pour afficher
le bouton en développement.

Identifiant en service : `984838546224-vnk721eak0da8nhvvht54jhdtkoq8cce.apps.googleusercontent.com`.

## 3. Ce qui est public, ce qui est secret

| Valeur | Statut | Où elle va |
|---|---|---|
| **ID client** (`….apps.googleusercontent.com`) | **public** — visible dans le code de toute page qui affiche le bouton | `frontend/src/environments/environment*.ts` et `QRCRAFT_SECURITY_GOOGLE_CLIENT_ID` (API) |
| **Secret client** (`GOCSPX-…`) | **secret** | **nulle part** : ce flux ne s'en sert pas |
| Fichier JSON téléchargé depuis la console | contient le secret | à supprimer du poste après avoir noté l'ID client ; jamais dans le dépôt |

Si ce fichier a circulé, le secret peut être réinitialisé dans la console (« Réinitialiser le
secret ») sans aucun impact sur QRCraft.

## 4. Variables à renseigner

| Où | Variable | Valeur | Secret ? |
|---|---|---|---|
| API (Dokploy) | `QRCRAFT_SECURITY_GOOGLE_CLIENT_ID` | l'ID client | non |
| API (Dokploy) | `QRCRAFT_CORS_ALLOWED_ORIGINS` | `https://qrcode-craft.fr,https://www.qrcode-craft.fr` | non |
| API (Dokploy) | `QRCRAFT_SECURITY_JWT_SECRET` | 48 octets aléatoires : `openssl rand -base64 48` | **oui** |
| Site | — | rien : l'ID client et l'URL de l'API sont dans `frontend/src/environments/` | — |

En développement, l'API (`./mvnw spring-boot:run`, port 8081) a déjà l'ID client par défaut, et le
site (`npm start`, port 4200) l'appelle sur `http://localhost:8081`.

## 5. Domaine de l'API

Le cookie de session est `SameSite=Strict` : l'API doit être sur un **sous-domaine de
`qrcode-craft.fr`** (prévu : `https://api.qrcode-craft.fr`). Sur un autre domaine, le navigateur
refuserait le cookie. Si l'adresse change, mettre à jour `apiBaseUrl` dans
`frontend/src/environments/environment.ts`.

## 6. Vérifier

1. API : `./mvnw spring-boot:run` dans `qrcraft-api/`.
2. Site : `npm start` dans `frontend/`, ouvrir `http://localhost:4200/inscription`.
3. « S'inscrire avec Google », choisir un compte → arrivée sur `/app` avec « Bonjour, … » et le
   message de bienvenue.
