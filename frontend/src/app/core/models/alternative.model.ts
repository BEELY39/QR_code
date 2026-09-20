/**
 * Modèle représentant un concurrent / alternative du marché
 */
export interface AlternativeCompetitor {
  readonly id: string;
  readonly name: string;
  readonly badge: string;
  readonly frictionPoint: string;
  readonly qrcraftAdvantage: string;
  readonly icon: string;
}
