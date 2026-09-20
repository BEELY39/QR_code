# Modèle de Données : 005-ui-and-frame-refinement

## 1. Types & Unions Discriminées des Cadres

```typescript
/**
 * Styles de cadre extérieur supportés pour le QR code
 * - 'none': Aucun cadre, matrice pure
 * - 'simple-bottom': Cadre rectangulaire/arrondi avec bandeau plein rattaché en bas
 * - 'badge-bottom': Cadre avec badge pilule détaché surmonté d'une flèche callout
 * - 'rounded-border': Bordure fine et élégante arrondie sans bandeau texte
 */
export type FrameStyleType = 'none' | 'simple-bottom' | 'badge-bottom' | 'rounded-border';

/**
 * Options complètes de configuration du cadre extérieur
 */
export interface QrFrameOptions {
  readonly style: FrameStyleType;
  readonly text: string;
  readonly font: string;
  readonly frameColor: string;
  readonly textColor: string;
}
```

## 2. Définition des Cartes d'Options Visuelles (UI Selectors)

```typescript
/**
 * Modèle pour les cartes d'options graphiques dans les formulaires Dumb
 */
export interface VisualOption<T> {
  readonly value: T;
  readonly label: string;
  readonly description?: string;
  readonly iconName?: string;
  readonly previewClass?: string;
}
```

## 3. Options de Design Global (Rappel & Cohérence)

```typescript
export interface QrDesignOptions {
  readonly dotsStyle: DotStyleType;
  readonly dotsColor: QrColorConfig;
  readonly cornersColor: string;
  readonly backgroundColor: string;
  readonly customLogoBase64: string | null;
  readonly frame: QrFrameOptions;
}
```

## 4. Règles de Cohérence & Invariants de Validation

1. **Immutabilité stricte** : Toutes les interfaces et propriétés sont marquées `readonly`.
2. **Texte de cadre** : Si `style === 'none'` ou `style === 'rounded-border'`, le rendu du texte est ignoré pour éviter l'affichage de libellés orphelins.
3. **Contraste de couleur** : La couleur du texte du cadre (`textColor`) doit présenter un ratio de contraste suffisant vis-à-vis de `frameColor`.
