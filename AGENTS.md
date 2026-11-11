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
| `qrcraft-api/` | Back-end Spring Boot 4.1 / Java 21 / Maven (socle en cours, spec 012) |
| `specs/NNN-*/` | Artefacts Spec Kit par feature : `spec.md`, `plan.md`, `tasks.md`, `contracts/`, `checklists/` |
| `.specify/` | Constitution (`memory/constitution.md`), gabarits et scripts Spec Kit, communs aux deux agents |
| `.claude/skills/`, `.agents/skills/` | Commandes Spec Kit de Claude Code et d'Antigravity, même version, mêmes noms |
| `modul_test/qrcraft-design-handoff/` | Maquettes de la refonte ; `models/stats.models.ts` = forme des réponses d'API attendues |

## Règles qui priment

**Lire `.specify/memory/constitution.md` avant toute spec, tout plan ou tout code.** En résumé :

- QR statiques générés à 100 % dans le navigateur ; le back-end ne sert qu'au dynamique (redirection
  `/r/{shortCode}`, comptes, campagnes, statistiques).
- Angular : tout élément créé via `ng generate` ; découpage service / smart / dumb ; pas de `any`.
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
- `./mvnw spring-boot:run`

## Workflow Spec Kit

`/speckit-specify` → `/speckit-clarify` (facultatif) → `/speckit-plan` → `/speckit-tasks` →
`/speckit-implement`. La feature active est indiquée par `.specify/feature.json`.

**Reprise par l'autre agent** : l'avancement se lit dans `specs/NNN-*/tasks.md`. Cocher chaque tâche dès
qu'elle est terminée ; l'agent qui reprend part des cases non cochées et ne refait pas les autres.

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
- **Suite prévue** : entités `User`, `Campaign`, `QrCode`, `Scan`, `ScanDailyRollup` et leurs
  migrations Flyway, puis redirection `/r/{shortCode}` et point de connexion Google.
