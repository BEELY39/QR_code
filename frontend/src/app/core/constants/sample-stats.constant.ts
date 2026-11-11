import {
  SampleCampaignTeaser,
  SampleCreatorHighlight,
  SampleHeroCard,
  SampleLastScan,
  SampleScanSeries,
} from '../models/sample-stats.model';

/**
 * Données d'exemple des visuels illustratifs. Constantes compilées :
 * aucun appel réseau, aucun `new Date()` (le prérendu doit rester stable).
 *
 * Les `points` sont exprimés dans l'échelle `scale` de la maquette :
 * `valeur = hauteur − ordonnée SVG`. Les abscisses `xs` reprennent celles
 * des tracés de la maquette, pour que les courbes tombent au même endroit.
 */

export const SAMPLE_HERO_CARD: SampleHeroCard = {
  locationLabel: 'Affiche gare Part-Dieu',
  statusLabel: 'Dynamique · actif',
  caption: 'Scannez pour découvrir',
  isSample: true,
};

export const SAMPLE_HERO_SERIES: SampleScanSeries = {
  label: 'Scans · 7 derniers jours',
  total: '1 284',
  points: [10, 16, 14, 26, 23, 38, 34, 48],
  xs: [0, 28, 56, 84, 112, 140, 168, 194],
  scale: { min: 0, max: 56 },
  axisLabels: [],
  isSample: true,
};

export const SAMPLE_LAST_SCAN: SampleLastScan = {
  ageLabel: 'Dernier scan · il y a 2 min',
  rows: [
    { icon: 'map-pin', text: 'Lyon, France' },
    { icon: 'smartphone', text: 'iOS · Safari · fr-FR' },
  ],
  isSample: true,
};

const TEASER_SERIES: SampleScanSeries = {
  label: 'Scans',
  total: '4 912',
  points: [30, 40, 50, 42, 70, 80, 65, 100, 108, 90, 130, 138, 120, 160, 170],
  xs: [0, 70, 140, 210, 280, 350, 420, 490, 560, 630, 700, 770, 840, 910, 1000],
  scale: { min: 0, max: 200 },
  axisLabels: [],
  isSample: true,
};

const TEASER_SERIES_MOBILE: SampleScanSeries = {
  label: 'Scans',
  total: '4 912',
  points: [8, 14, 20, 16, 32, 40, 56, 60],
  xs: [0, 45, 90, 135, 180, 225, 270, 320],
  scale: { min: 0, max: 70 },
  axisLabels: [],
  isSample: true,
};

export const SAMPLE_CAMPAIGN_TEASER: SampleCampaignTeaser = {
  campaignName: 'Affichage métro novembre',
  ranges: ['7 jours', '30 jours', 'Tout'],
  activeRangeIndex: 0,
  kpis: [
    { label: 'Scans', value: '4 912', size: 'lg' },
    { label: 'QR codes actifs', value: '15', size: 'lg' },
    { label: "Pic d'activité", value: 'Ven. 18 h', size: 'md' },
    { label: 'Meilleure affiche', value: 'Gare Part-Dieu', size: 'md' },
  ],
  kpisMobile: [
    { label: 'scans', value: '4 912', size: 'lg' },
    { label: "pic d'activité", value: 'Ven. 18 h', size: 'lg' },
  ],
  series: TEASER_SERIES,
  seriesMobile: TEASER_SERIES_MOBILE,
  isSample: true,
};

export const SAMPLE_CREATOR_HIGHLIGHT: SampleCreatorHighlight = {
  sponsorLabel: 'Sponsor [MARQUE] · vidéo « Mon setup 2026 »',
  value: '3 418 scans',
  badgeLabel: 'Pic 2 h après la sortie',
  series: {
    label: 'Mise en ligne',
    total: '3 418',
    points: [4, 30, 68, 80, 62, 44, 32, 24, 18, 14, 12],
    xs: [0, 20, 40, 60, 90, 130, 180, 240, 320, 400, 480],
    scale: { min: 0, max: 90 },
    axisLabels: ['Mise en ligne', '+24 h', '+48 h'],
    isSample: true,
  },
  tiles: [
    { label: 'clics sur la vidéo', value: '3 418', size: 'md' },
    { label: 'audience au top', value: '20 h – 22 h', size: 'md' },
  ],
  isSample: true,
};
