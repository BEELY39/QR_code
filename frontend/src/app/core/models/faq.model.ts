/**
 * Catégories thématiques des questions fréquentes
 */
export type FaqCategory = 'general' | 'perennite' | 'securite' | 'technique';

/**
 * Entité représentant une question-réponse de la FAQ
 */
export interface FaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly category: FaqCategory;
  readonly iconName?: string;
}

/**
 * Structure Schema.org Question pour le balisage JSON-LD
 */
export interface SchemaFaqQuestion {
  readonly '@type': 'Question';
  readonly name: string;
  readonly acceptedAnswer: {
    readonly '@type': 'Answer';
    readonly text: string;
  };
}

/**
 * Structure Schema.org FAQPage pour le balisage JSON-LD
 */
export interface SchemaFaqPage {
  readonly '@context': 'https://schema.org';
  readonly '@type': 'FAQPage';
  readonly mainEntity: readonly SchemaFaqQuestion[];
}
