# Quickstart: Validation de la Page d'Accueil QRCraft

## Pré-requis
- Node.js >= 20 (installé: v24.9.0)
- npm >= 10 (installé: 11.8.0)
- Angular CLI >= 21 (installé: 21.0.4)

---

## Commandes d'Exécution & Validation

### 1. Démarrage du serveur de développement
Depuis le dossier `frontend/` :
```bash
npm start
```
Accéder à l'application via le navigateur : `http://localhost:4200/`.

### 2. Validation Visuelle (Pixel-Perfect)
1. **Header** : Vérifier la fixation sticky avec fond semi-transparent flouté (glassmorphism), le logo QRCraft et le bouton "Ouvrir le Studio".
2. **Hero Section** : Vérifier le titre avec dégradé texte, les badges et la carte bistro avec QR stylisé dégradé et pastille flottante.
3. **Simulateur Express** :
   - Modifier le champ d'encodage : vérifier la mise à jour immédiate du QR code dans l'aperçu.
   - Cliquer sur les 4 palettes (Violet Pop, Menthe Fraîche, Sunset Coral, Cyan Électrique) : vérifier le changement de couleur et le contour actif.
   - Modifier le texte du bandeau : vérifier que la carte reflète le nouveau texte avec l'émoticône.
4. **Section Atouts** : Vérifier les 4 cartes illustrées avec leurs icônes Material Symbols.
5. **Galerie** : Vérifier les 4 cartes avec photos et pastilles d'action.
6. **Bannière CTA & Footer** : Vérifier le rendu sur toute la largeur et les 4 colonnes du footer.

### 3. Exécution des Tests Automatisés
Depuis le dossier `frontend/` :
```bash
# Exécution de la suite de tests Vitest
npm test
```
Vérifier que les tests du service `QrSimulatorService` et du Smart Component `HomeComponent` passent avec 100% de succès.
