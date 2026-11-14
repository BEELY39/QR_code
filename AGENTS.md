# Instructions pour les agents (Claude Code, Antigravity)

Ce fichier est **la source commune** des deux agents. `CLAUDE.md` ne fait que l'importer.
Toute décision qui conditionne la suite du travail s'écrit ici, dans la constitution ou dans la spec
de la feature, jamais uniquement dans la mémoire privée d'un agent (constitution, principe VIII).

## Le projet

QRCraft : générateur de QR codes personnalisés (SVG vectoriel), site public prérendu, et bientôt un
espace connecté (QR dynamiques, campagnes, statistiques de scan).

| Dossier | Contenu |
|---|---|
| `frontend/` | Angular 21 standalone + Signals, SSR/SSG, Tailwind v4, tests Vitest via `ng test` |
| `qrcraft-api/` | Back-end Spring Boot 4.1 / Java 21 / Maven (socle 012, authentification 013) |
| `specs/NNN-*/` | Artefacts Spec Kit par feature : `spec.md`, `plan.md`, `tasks.md`, `contracts/`, `checklists/` |
| `.specify/` | Constitution (`memory/constitution.md`), gabarits et scripts Spec Kit, communs aux deux agents |
| `.claude/skills/`, `.agents/skills/` | Commandes Spec Kit de Claude Code et d'Antigravity, même version, mêmes noms |
| `modul_test/qrcraft-design-handoff/` | Maquettes de la refonte ; `models/stats.models.ts` = forme des réponses d'API attendues |

## Règles qui priment

**Lire `.specify/memory/constitution.md` avant toute spec, tout plan ou tout code.** En résumé :

- QR statiques générés à 100 % dans le navigateur ; le back-end ne sert qu'au dynamique (redirection
  `/r/{shortCode}`, comptes, campagnes, statistiques).
- Angular : tout élément créé via `ng generate` ; découpage service / smart / dumb ; pas de `any`.
- Génération par CLI et cycle de sprint (tests → code → build → tests) : voir « Directives de
  développement » ci-dessous — elles priment.
- Styles : Tailwind v4 et les tokens `qc-*` de `frontend/src/styles.css` ; CSS natif en dernier recours.
- Back-end : controller → service → repository, DTO en records, Flyway seul maître du schéma, pool
  Postgres à 5, threads virtuels, caches bornés, seul `/actuator/health` exposé, secrets en variables
  d'environnement, **adresse IP jamais stockée ni journalisée**.
- Toute dépendance non listée dans la constitution exige d'abord un amendement (`/speckit-constitution`).

## Commandes

Front-end, depuis `frontend/` :

- `npm start` : serveur de développement (port 4200)
- `npm run lint` : contrôle de typage
- `npm run test:ci` : tests (ne pas lancer `npx vitest` directement : les globals ne sont pas chargés)
- `npm run build` : build et prérendu des routes

Back-end, depuis `qrcraft-api/` (Docker Desktop démarré pour les tests de base de données) :

- `./mvnw test` (ou `mvnw.cmd test` sous PowerShell)
- `./mvnw spring-boot:run` (port 8081 ; le site de dev, `npm start`, l'appelle sur `http://localhost:8081`)

## Workflow Spec Kit

`/speckit-specify` → `/speckit-clarify` (facultatif) → `/speckit-plan` → `/speckit-tasks` →
`/speckit-implement`. La feature active est indiquée par `.specify/feature.json`.

**Reprise par l'autre agent** : l'avancement se lit dans `specs/NNN-*/tasks.md`. Cocher chaque tâche dès
qu'elle est terminée ; l'agent qui reprend part des cases non cochées et ne refait pas les autres.

## Directives de développement (règles de l'utilisateur, prioritaires)

### Génération par CLI — aucune création manuelle quand un générateur existe

- Tout squelette (composant, service, contrôleur, entité, garde, intercepteur, classe de test…) est
  **généré par le CLI officiel** quand il en existe un ; on édite ensuite le fichier généré pour y
  mettre la logique. Création à la main (éditeur, `touch`…) interdite dans ce cas.
- **Exception** : création manuelle tolérée uniquement quand aucun générateur ne couvre ce type de
  fichier (fichier de configuration spécifique, DTO simple, migration SQL…).
- Avant de créer un fichier, vérifier les générateurs disponibles dans le projet.

Générateurs disponibles (vérifié le 2026-11-14) :

| Projet | Générateur | Usage |
|---|---|---|
| `frontend/` | Angular CLI 21.2 (`npx ng generate …`) | composants, services, gardes, intercepteurs, directives, pipes, environnements — **toujours** |
| `qrcraft-api/` | aucun générateur de classe installé (ni Spring Boot CLI, ni JHipster, ni Yeoman ; le wrapper Maven ne génère pas de classe isolée) | **exception** : classes Java (entités, repositories, services, contrôleurs, DTO, tests) et migrations Flyway créées à la main, dans les paquets existants et selon leurs conventions |

Si un générateur Java est ajouté au projet un jour, il devient obligatoire et ce tableau est mis à jour.

### Cycle d'un sprint — ordre impératif, aucune étape sautée

1. **Squelettes et tests (TDD, phase rouge)** : générer par CLI les fichiers nécessaires, puis écrire
   les tests unitaires (logique métier) et d'intégration (`@SpringBootTest`, `@WebMvcTest`, tests de
   composants). Ils doivent échouer.
2. **Code** : compléter les fichiers générés jusqu'à satisfaire la spec Spec Kit et faire passer ces
   tests, en respectant l'architecture et les conventions.
3. **Build — bloquant** : lancer le build. En échec (compilation, typage, packaging) : **interdit** de
   lancer les tests ou de passer à la suite ; corriger et relancer jusqu'au succès complet.
4. **Tests — bloquant** : lancer toute la suite (unitaires + intégration). Un test en échec : corriger,
   relancer le build (étape 3), puis les tests (étape 4). Tout vert : sprint validé.

| Projet | Étape 3 — build | Étape 4 — tests |
|---|---|---|
| `qrcraft-api/` | `./mvnw clean package -DskipTests` | `./mvnw clean verify` (Docker Desktop démarré) |
| `frontend/` | `npm run lint && npm run build` (typage puis build) | `npm run test:ci` |

Sous PowerShell, `./mvnw` → `.\mvnw.cmd`. Le projet utilise le wrapper Maven : `mvn` n'est pas
installé globalement.

### Verrouillage entre sprints

Tant que le build ou les tests du sprint en cours ne sont pas au vert, il est **interdit** de démarrer
un nouveau sprint ou d'initialiser une nouvelle spécification. La boucle complète
(CLI + tests → code → build → tests) est répétée intégralement à chaque sprint.

Dans `tasks.md`, les tâches de génération et de test d'une story précèdent toujours ses tâches
d'implémentation, et chaque story se clôt par build puis tests.

## Conventions de travail

- Langue : français pour les échanges, les specs, les commits et les PR.
- Git : jamais de travail direct sur `main` ; une branche par feature (`feat/NNN-nom`) ; PR en fin de
  sprint. Messages de commit au format `type(portée): description`.
- GitHub : issues réelles avec priorité (`priority: P1-critique`, …), type (`type: …`), domaine
  (`area: …`) et jalon de la feature ; la PR reprend ces étiquettes et ferme ses issues (`Closes #n`).
- Ne pas fermer d'issue, fusionner une PR ni pousser sans accord explicite de l'utilisateur.

## État courant

- **011 — Refonte design public** : implémentée sur `feat/011-refonte-design-landing`, PR
  [#210](https://github.com/BEELY39/QR_code/pull/210) **fusionnée dans `main`**. Tâches restantes dans
  `specs/011-refonte-design-landing/tasks.md` (T066, T068, T073 – T076, T080).
- **012 — Socle back-end** : implémenté sur `feat/012-backend-dependencies` (branche partie de `main`).
  Ajouts : Caffeine, `maxmind-db` 4.2.0 (pas `geoip2`, qui tire Jackson 2), Yauaa 8.3.0,
  Testcontainers 2, `spring-boot-docker-compose`. Mode d'emploi : `qrcraft-api/README.md`.
  Issues #211 – #217, epic #218, jalon « 012 — Socle back-end ».
  `./mvnw clean verify` vert (71 tests, ~100 s) ; `spring-boot:run` validé (port 8081 sur le poste
  de l'utilisateur : CrowdSec occupe 8080). **Reste** : push et PR (T055), sur accord de l'utilisateur.
- **013 — Authentification Google** : **implémentée** sur `feat/013-google-jwt-auth` (branche issue de
  `feat/012-backend-dependencies`, toutes deux non poussées). Connexion par **fenêtre Google** (pas de
  secret client, pas d'URI de redirection), **Google uniquement**, session **7 jours** dans le cookie
  `qrcraft_session` (`HttpOnly`, `SameSite=Strict`, `Path=/api`) ; `POST /api/auth/google`,
  `GET /api/me`, `POST /api/auth/logout` ; table `users` (V1) ; site : `/connexion`, `/inscription`,
  `/app` (garde, rendu client), barre de navigation connectée. Guide : `docs/google-oauth.md`.
  Build et tests verts : 96 tests API, 206 tests site. Module Google absent de l'accueil (vérifié).
  **Reste** : essai réel avec un compte Google par le propriétaire (T075), puis push et PR (T077) sur
  son accord. Issues #219 – #224, epic #225.
- **Suite prévue** : entités `Campaign`, `QrCode`, `Scan`, `ScanDailyRollup` et leurs migrations
  Flyway, puis redirection `/r/{shortCode}`.
