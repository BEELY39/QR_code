# qrcraft-api

API back-end de QRCraft : redirection des QR dynamiques, comptes, campagnes et statistiques de scan.
Les QR statiques, eux, restent générés à 100 % dans le navigateur (`../frontend/`).

**Stack** : Spring Boot 4.1 · Java 21 · Maven (wrapper) · Spring MVC + threads virtuels ·
PostgreSQL + Flyway · Spring Security (serveur de ressources OAuth2) · Caffeine.

## Prérequis

- JDK 21 ou plus récent (`java -version`)
- Docker Desktop **démarré** (`docker info`), pour les tests et la base locale de développement

## Commandes

Depuis ce dossier (sous PowerShell, remplacer `./mvnw` par `.\mvnw.cmd`) :

| Commande | Effet |
|---|---|
| `./mvnw verify` | compile et lance toute la suite de tests ; les tests de démarrage utilisent un PostgreSQL éphémère (Testcontainers) |
| `./mvnw spring-boot:run` | lance l'API en profil `dev` sur `http://localhost:8080` ; Docker Compose démarre `compose.yaml` |
| `./mvnw -DskipTests package` | produit `target/qrcraft-api-0.0.1-SNAPSHOT.jar`, sans profil ni Docker Compose |

Vérification rapide une fois lancée :

```bash
curl -i http://localhost:8080/actuator/health
```

→ `200 {"groups":["liveness","readiness"],"status":"UP"}`, sans aucun détail de composant. Tout
autre chemin répond `401` sans jeton.

## Profils

| Profil | Activé par | Base | Secrets |
|---|---|---|---|
| *(aucun)* = production | `java -jar …`, Dokploy | variables `SPRING_DATASOURCE_*` | variables d'environnement, **aucune valeur par défaut** |
| `dev` | `./mvnw spring-boot:run` | Docker Compose (`compose.yaml`) | valeurs jetables `dev-only-…` |
| `test` | les tests | Testcontainers | valeurs jetables `test-only-…` |

Un secret préfixé `dev-only-` ou `test-only-` fait échouer le démarrage hors de ces deux profils.

## Variables d'environnement de production

| Variable | Obligatoire | Format |
|---|---|---|
| `SPRING_DATASOURCE_URL` | oui | `jdbc:postgresql://<hôte>:5432/qrcraft` |
| `SPRING_DATASOURCE_USERNAME` | oui | — |
| `SPRING_DATASOURCE_PASSWORD` | oui | — |
| `QRCRAFT_SECURITY_JWT_SECRET` | oui | ≥ 32 octets aléatoires, par ex. `openssl rand -base64 48` |
| `QRCRAFT_SECURITY_JWT_TTL` | non | durée ISO-8601, `PT1H` par défaut |
| `QRCRAFT_SECURITY_GOOGLE_CLIENT_ID` | oui | `<n>.apps.googleusercontent.com` |
| `QRCRAFT_GEOIP_DATABASE_PATH` | non | chemin du fichier `.mmdb` ; absent = ville et pays non renseignés |

Sans ces variables, le jar refuse de démarrer et nomme la première propriété manquante.

## Exploitation

**Pool de connexions** : 5 au plus (base mutualisée Dokploy). Seul `/actuator/health` est exposé,
sans détail : c'est la sonde à configurer dans Dokploy.

**Version de PostgreSQL** : les tests et la base locale utilisent `postgres:17-alpine`. Avant la mise
en production, exécuter `SELECT version();` sur l'instance Dokploy ; si sa version majeure n'est pas 17,
aligner l'image dans `compose.yaml` et dans `src/test/java/.../TestcontainersConfiguration.java`.

**Base de géolocalisation (DB-IP Lite)** : l'adresse IP d'un scan sert uniquement à déduire ville et
pays à partir d'une base locale, puis elle est jetée — jamais stockée, journalisée ni transmise.

1. Télécharger chaque mois `dbip-city-lite-AAAA-MM.mmdb.gz` sur
   <https://db-ip.com/db/download/ip-to-city-lite> (gratuit, sans compte).
2. Le décompresser hors du dépôt (`*.mmdb` est ignoré par git) et pointer
   `QRCRAFT_GEOIP_DATABASE_PATH` dessus, puis redémarrer l'API.
3. Licence CC-BY 4.0 : la mention « IP Geolocation by DB-IP » figure sur la page
   `/confidentialite` du site. Elle doit y rester.

**Empreinte mémoire** : l'analyseur de User-Agent (Yauaa, restreint à 3 champs) occupe environ
**110 Mo de tas** et s'initialise en **~3 s** au démarrage (mesure du 2026-11-11, JDK 25). Prévoir au
moins 512 Mo de mémoire pour le conteneur. Si l'hébergement ne le permet pas, le repli documenté est
`uap-java` (plus léger, mais sans détection fiable des tablettes ni des robots).

## Dépannage

| Symptôme | Cause | Solution |
|---|---|---|
| Tests en échec avec `Could not find a valid Docker environment` | Docker Desktop arrêté | démarrer Docker Desktop, attendre que `docker info` réponde, relancer |
| `Failed to configure a DataSource: 'url' attribute is not specified` au lancement du jar | variables de base absentes | définir `SPRING_DATASOURCE_*`, ou utiliser `./mvnw spring-boot:run` en local |
| `qrcraft.security.jwt.secret est obligatoire` | secret JWT absent | définir `QRCRAFT_SECURITY_JWT_SECRET` |
| `Port 8080 was already in use` avec `spring-boot:run` | un autre service occupe 8080 (par exemple CrowdSec) | `./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081` |
| Le conteneur `qrcraft-api-postgres-1` reste actif après un arrêt brutal | l'API n'a pas pu l'arrêter elle-même | `docker compose stop` depuis ce dossier |
| Avertissement `Géolocalisation désactivée` au démarrage | `QRCRAFT_GEOIP_DATABASE_PATH` absent ou fichier illisible | normal en dev ; en production, fournir la base DB-IP Lite |
