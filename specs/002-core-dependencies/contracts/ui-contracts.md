# Contracts: Services d'Encapsulation et d'Export

## 1. Contrat `QrEngineService` (`frontend/src/app/core/services/qr-engine.service.ts`)

Service de Catégorie 2 responsable de la communication avec `qr-code-styling` de manière sécurisée vis-à-vis du SSR.

```typescript
export interface IQrEngineService {
  /**
   * Instancie ou met à jour le QR code vectoriel dans le conteneur cible.
   * Ne s'exécute que sur la plateforme browser (no-op sécurisé en SSR).
   */
  renderToElement(container: HTMLElement, options: QrEngineOptions): Promise<void>;

  /**
   * Extrait le balisage pur SVG vectoriel sous forme de chaîne de caractères.
   */
  getSvgString(options: QrEngineOptions): Promise<string>;

  /**
   * Télécharge directement le QR code vectoriel brut au format SVG ou PNG.
   */
  download(options: QrEngineOptions, filename: string, format: 'svg' | 'png'): Promise<void>;
}
```

---

## 2. Contrat `DomExportService` (`frontend/src/app/core/services/dom-export.service.ts`)

Service de Catégorie 2 responsable de la capture DOM haute résolution (`html-to-image`) et de l'export PDF (`jspdf`) avec libération mémoire.

```typescript
export interface IDomExportService {
  /**
   * Capture un gabarit Tailwind CSS complet sous forme d'image PNG haute résolution.
   * @param element Élément du DOM à capturer
   * @param scale Facteur d'échelle (1, 2 ou 3 pour impression 300 DPI)
   */
  captureToPng(element: HTMLElement, scale?: number): Promise<ExportResult>;

  /**
   * Convertit un gabarit DOM en document PDF vectoriel prêt pour l'impression physique.
   */
  exportToPdf(element: HTMLElement, options: ExportOptions): Promise<ExportResult>;

  /**
   * Déclenche le téléchargement du fichier par le navigateur et révoque immédiatement le blob (Principe III).
   */
  saveAndRelease(result: ExportResult): void;
}
```

---

## 3. Contrat `DeferredAuthService` (`frontend/src/app/core/services/deferred-auth.service.ts`)

Service de Catégorie 2 encapsulant `@abacritt/angularx-social-login` sans chargement prématuré.

```typescript
export interface IDeferredAuthService {
  readonly state: Signal<AuthState>;

  /**
   * Initialise le flux d'authentification uniquement à la demande de l'utilisateur.
   */
  signInWithGoogle(): Promise<SocialUserProfile | null>;

  /**
   * Clôture la session sociale en mémoire.
   */
  signOut(): Promise<void>;
}
```
