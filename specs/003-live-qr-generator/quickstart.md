# Quickstart Guide: Validation du Simulateur de QR Code Réel en Direct

**Feature**: `003-live-qr-generator`

Ce guide détaille la procédure de test et de validation de la génération vectorielle en direct sur la page d'accueil.

---

## 1. Démarrage de l'Application

Assurez-vous que le serveur de développement tourne sur le port 4200 :
```powershell
npm start
```
Accédez à [http://localhost:4200/](http://localhost:4200/) et descendez à la section "Simulateur Express".

---

## 2. Scénarios de Validation Visuelle & Fonctionnelle

### Scénario 1 : Scan Smartphone d'un Lien (Mode URL)
1. Vérifiez que l'onglet **"Lien"** est sélectionné par défaut.
2. Saisissez l'URL de votre choix (ex: `https://instagram.com/palacemeurice`).
3. Observez le QR code au centre :
   - Les coins extérieurs ont des bords arrondis élégants (`extra-rounded`).
   - L'intérieur des coins est un cercle parfait (`dot`).
   - Les points sont adoucis et portent le dégradé de la palette sélectionnée (zéro noir et blanc).
   - Le monogramme circulaire QRCraft est parfaitement centré.
4. **Scannez le QR code avec votre téléphone portable** : la page s'ouvre instantanément.

### Scénario 2 : Bascule en Mode Texte (Code Wi-Fi / Message)
1. Cliquez sur le bouton **"Texte"**.
2. Le champ de saisie affiche le placeholder adapté.
3. Saisissez : `Wi-Fi: RitzParis_VIP | Clé: Prestige2026!`.
4. Le QR code se recalcule immédiatement avec les nouvelles données textuelles.
5. Scannez avec votre téléphone : le texte s'affiche instantanément.

### Scénario 3 : Sélection des Palettes Chromatiques
1. Cliquez successivement sur **Menthe Fraîche**, **Sunset Coral**, **Cyan Électrique**.
2. Les dégradés du QR code s'adaptent instantanément aux couleurs choisies.

### Scénario 4 : Téléchargement du Fichier Vectoriel
1. Cliquez sur le bouton **"Télécharger le QR Code"**.
2. Un fichier `.svg` vectoriel haute définition est téléchargé avec le dégradé et le logo central.

---

## 3. Commandes de Validation Automatisée

```powershell
# Exécution de la suite complète de tests Vitest (Unitaires & Intégration)
npm test

# Validation de la compilation de production et SSR
npm run build
```
