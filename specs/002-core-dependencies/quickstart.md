# Quickstart Guide: Validation des Dépendances Cœur (V1)

**Feature**: `002-core-dependencies`

Ce guide détaille les étapes de validation pour vérifier l'installation, le typage strict et la compatibilité SSR des dépendances fondamentales.

---

## 1. Pré-requis

- Node.js 20.x ou supérieur
- npm 11.x
- Répertoire de travail : `frontend/`

---

## 2. Installation des Dépendances

```powershell
npm install qr-code-styling html-to-image @abacritt/angularx-social-login jspdf
```

---

## 3. Génération CLI des Services d'Encapsulation (Règle n°1)

```powershell
npx ng generate service core/services/qr-engine --skip-tests=false
npx ng generate service core/services/dom-export --skip-tests=false
npx ng generate service core/services/deferred-auth --skip-tests=false
```

---

## 4. Procédure de Test et Vérification Qualité

### A. Vérification de la suite de tests Vitest (Catégorie 2)

```powershell
npm test
```
*Résultat attendu :* 100% des tests unitaires passent, y compris les tests des services d'encapsulation simulant le comportement en environnement browser vs serveur (SSR).

### B. Vérification de la compilation de production et SSR

```powershell
npm run build
```
*Résultat attendu :* Génération réussie des bundles client et serveur SSR sans warning d'incompatibilité de modules ESM/CommonJS ni erreur de référence DOM.

### C. Vérification du Serveur de Développement

```powershell
npm start
```
*Résultat attendu :* Accès fluide à [http://localhost:4200/](http://localhost:4200/) sans aucune erreur dans la console navigateur.
