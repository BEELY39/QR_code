# Guide de Validation Rapide : 005-ui-and-frame-refinement

Ce guide décrit les étapes de vérification manuelle et automatisée de la refonte visuelle des cadres et formulaires.

## 1. Démarrage de l'Environnement

```bash
npm start
```
Accéder à `http://localhost:4200/` et faire défiler jusqu'à la section **Simulateur Express**.

---

## 2. Validation Visuelle des Cadres (Suppression du Double Cadre)

1. Cliquer sur l'onglet **Cadre** :
   - Sélectionner la carte **Bandeau Inférieur** (correspondant à l'Image 2).
   - Saisir `SCAN ME` dans le champ texte.
   - **Résultat attendu** : L'aperçu affiche le QR code enveloppé d'une bordure unique avec le bandeau inférieur noir rattaché. Aucun faux cadre sombre externe ne vient l'entourer.
2. Sélectionner la carte **Badge Flottant** (correspondant à l'Image 3) :
   - **Résultat attendu** : Le QR code est entouré d'une bordure nette, et surmonte un badge noir arrondi avec une petite flèche pointant vers le haut.
3. Sélectionner la carte **Aucun Cadre** :
   - **Résultat attendu** : Le QR code apparaît directement sans cadre ni bandeau.

---

## 3. Validation de la Direction Artistique des Formulaires

1. **Onglet Forme des points** :
   - Les formes de points s'affichent sous forme de cartes d'options cliquables avec indicateurs de sélection violets.
2. **Onglet Couleurs & Dégradés** :
   - Vérifier le *segmented control* moderne (Uni / Dégradé) et la présence de pastilles de couleurs rapides (swatches).
3. **Onglet Logo** :
   - Vérifier la zone d'import aérée et le bouton de retrait après sélection d'image.
4. **Onglet Wi-Fi** :
   - Vérifier les champs de saisie soignés avec icônes et le bouton de visibilité du mot de passe.

---

## 4. Validation Automatisée

```bash
# Exécution de tous les tests unitaires et d'intégration
npm test

# Validation de la compilation de production
npm run build
```
Résultat attendu : 100% des tests au vert et compilation sans erreur.
