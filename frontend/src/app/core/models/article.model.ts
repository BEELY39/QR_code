/**
 * Section interne d'un guide pratique
 */
export interface ArticleSection {
  readonly title: string;
  readonly content: string;
}

/**
 * Fiche guide pratique pour la page /articles (Option A : cartes dépliables intégrées)
 */
export interface ArticleGuide {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly readingTime: string;
  readonly targetAudience: string;
  readonly category: string;
  readonly iconName: string;
  readonly sections: readonly ArticleSection[];
  readonly checklist: readonly string[];
}
