# Specification Quality Checklist: Génération de QR Code Réel en Direct (Live Simulator)

**Purpose**: Valider la conformité, la testabilité et la complétude de la spécification avant planification.

## Checklist d'Exigences Qualité

- [X] **Fidélité au Design Existant** : La disposition, la carte simulateur et les espacements de la maquette d'origine sont préservés sans altération visuelle.
- [X] **Génération Vectorielle Réelle** : Utilisation certifiée de `QrEngineService` pour remplacer l'illustration statique par un vrai SVG scannable.
- [X] **Tolérance Optique 30%** : Exigence explicite de fixation de l'Error Correction Level (ECL) à 'H' (30% de redondance) pour compenser le logo central.
- [X] **Logo Circulaire Central (Clarifié)** : Monogramme vectoriel SVG autonome encodé en Base64 in-memory (0 requête réseau).
- [X] **Commutateur de Mode (Lien / Texte)** : Deux modes clairs avec adaptation du placeholder et normalisation URL (`https://`).
- [X] **Réactivité Clavier (Clarifié)** : Application d'un debounce court de 150 ms sur la saisie textuelle pour une fluidité optique maximale.
- [X] **Conformité Règle n°5 (Typage Fort à la Rust)** : Déclaration d'unions discriminées (`QrPayload`, `GeneratorStatus`), `readonly` généralisé, zéro `any`, contrôle d'exhaustivité.
- [X] **Compatibilité SSR** : No-op défensif et isolation `isPlatformBrowser()` pour interdire tout crash du serveur Node.js / Express.
- [X] **Testabilité** : Scénarios d'acceptation indépendants et mesurables pour chaque User Story.
