import { IconName } from './icon.model';

/**
 * Données d'exemple des visuels illustratifs de la landing. Forme alignée
 * sur les interfaces du handoff pour qu'un branchement d'API soit un
 * changement de source. `isSample` est toujours vrai : la mention
 * « Données d'exemple » en découle (FR-021).
 */
export interface SampleScanSeries {
  readonly label: string;
  readonly total: string;
  readonly points: readonly number[];
  readonly xs?: readonly number[];
  readonly scale?: { readonly min: number; readonly max: number };
  readonly axisLabels: readonly string[];
  readonly isSample: true;
}

export interface SampleKpi {
  readonly label: string;
  readonly value: string;
  readonly size: 'lg' | 'md';
}

export interface SampleScanRow {
  readonly icon: IconName;
  readonly text: string;
}

export interface SampleHeroCard {
  readonly locationLabel: string;
  readonly statusLabel: string;
  readonly caption: string;
  readonly isSample: true;
}

export interface SampleLastScan {
  readonly ageLabel: string;
  readonly rows: readonly SampleScanRow[];
  readonly isSample: true;
}

export interface SampleCampaignTeaser {
  readonly campaignName: string;
  readonly ranges: readonly string[];
  readonly activeRangeIndex: number;
  readonly kpis: readonly SampleKpi[];
  readonly series: SampleScanSeries;
  readonly seriesMobile: SampleScanSeries;
  readonly kpisMobile: readonly SampleKpi[];
  readonly isSample: true;
}

export interface SampleCreatorHighlight {
  readonly sponsorLabel: string;
  readonly value: string;
  readonly badgeLabel: string;
  readonly series: SampleScanSeries;
  readonly tiles: readonly SampleKpi[];
  readonly isSample: true;
}
