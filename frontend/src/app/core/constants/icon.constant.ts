import { IconDefinition, IconName } from '../models/icon.model';

/** Tracé du QR illustratif de la maquette (données d'exemple, pas un vrai QR) */
const QR_SAMPLE_DATA =
  'M8 0h2v2h-2zM11 0h1v3h-1zM13 0h2v5h-2zM16 0h1v1h-1zM10 1h1v1h-1zM15 2h2v2h-2zM9 3h1v2h-1zM12 3h1v3h-1zM10 4h1v1h-1zM16 4h1v1h-1zM14 5h2v2h-2zM8 6h3v1h-3zM10 7h1v1h-1zM13 7h1v1h-1zM3 8h2v3h-2zM6 8h5v3h-5zM12 8h3v1h-3zM16 8h2v1h-2zM22 8h3v3h-3zM2 9h1v2h-1zM18 9h1v1h-1zM0 10h1v2h-1zM15 10h5v1h-5zM1 11h1v1h-1zM15 11h3v1h-3zM21 11h1v1h-1zM4 12h1v1h-1zM6 12h4v1h-4zM17 12h5v1h-5zM0 13h1v1h-1zM3 13h1v1h-1zM8 13h2v1h-2zM15 13h1v4h-1zM18 13h3v2h-3zM23 13h1v2h-1zM2 14h1v1h-1zM4 14h2v1h-2zM22 14h1v2h-1zM1 15h1v1h-1zM6 15h4v1h-4zM11 15h2v1h-2zM19 15h1v3h-1zM21 15h1v1h-1zM3 16h1v1h-1zM8 16h1v1h-1zM10 16h1v1h-1zM20 16h5v1h-5zM11 17h1v1h-1zM14 17h1v1h-1zM17 17h1v1h-1zM23 17h2v1h-2zM9 18h3v1h-3zM13 18h1v1h-1zM15 18h3v1h-3zM24 18h1v3h-1zM8 19h1v3h-1zM11 19h3v1h-3zM16 19h2v3h-2zM21 19h2v1h-2zM12 20h1v4h-1zM14 20h1v2h-1zM20 20h2v1h-2zM23 20h1v2h-1zM9 21h3v1h-3zM18 21h3v1h-3zM9 22h1v2h-1zM18 22h1v3h-1zM22 22h3v2h-3zM11 23h1v1h-1zM13 23h1v2h-1zM17 23h1v1h-1zM19 23h3v1h-3zM10 24h1v1h-1zM14 24h2v1h-2zM20 24h1v1h-1z';

/**
 * Registre unique des icônes de la refonte. Tracés recopiés des maquettes
 * (trait 24 × 24). Les couleurs sont portées par des tokens via `className`.
 */
export const ICON_REGISTRY: Record<IconName, IconDefinition> = {
  'qr-grid': {
    mode: 'stroke',
    elements: [
      { tag: 'rect', x: 3, y: 3, width: 7, height: 7, rx: 1.5 },
      { tag: 'rect', x: 14, y: 3, width: 7, height: 7, rx: 1.5 },
      { tag: 'rect', x: 3, y: 14, width: 7, height: 7, rx: 1.5 },
      { tag: 'path', d: 'M14 14h3v3h-3zM18 18h3v3h-3z' },
    ],
  },
  'arrow-right': {
    mode: 'stroke',
    elements: [{ tag: 'path', d: 'M5 12h14M13 6l6 6-6 6' }],
  },
  check: {
    mode: 'stroke',
    elements: [{ tag: 'path', d: 'M5 12l5 5L20 7' }],
  },
  'map-pin': {
    mode: 'stroke',
    elements: [
      { tag: 'path', d: 'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z' },
      { tag: 'circle', cx: 12, cy: 9.5, r: 2.5 },
    ],
  },
  clock: {
    mode: 'stroke',
    elements: [
      { tag: 'circle', cx: 12, cy: 12, r: 9 },
      { tag: 'path', d: 'M12 7v5l3 2' },
    ],
  },
  'bar-chart': {
    mode: 'stroke',
    elements: [{ tag: 'path', d: 'M4 20V10M10 20V4M16 20v-7M22 20H2' }],
  },
  smartphone: {
    mode: 'stroke',
    elements: [
      { tag: 'rect', x: 7, y: 2, width: 10, height: 20, rx: 2.5 },
      { tag: 'path', d: 'M11 18h2' },
    ],
  },
  'shield-check': {
    mode: 'stroke',
    elements: [
      { tag: 'path', d: 'M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z' },
      { tag: 'path', d: 'M8.5 12l2.5 2.5 4.5-5' },
    ],
  },
  'chevron-right': {
    mode: 'stroke',
    elements: [{ tag: 'path', d: 'M9 6l6 6-6 6' }],
  },
  menu: {
    mode: 'stroke',
    elements: [{ tag: 'path', d: 'M4 7h16M4 12h16M4 17h16' }],
  },
  utensils: {
    mode: 'stroke',
    elements: [{ tag: 'path', d: 'M4 3v8a3 3 0 0 0 3 3v7M10 3v8M7 3v6M17 21V3c-2 0-4 2-4 6v5h4' }],
  },
  billboard: {
    mode: 'stroke',
    elements: [
      { tag: 'rect', x: 4, y: 3, width: 16, height: 14, rx: 2 },
      { tag: 'path', d: 'M9 21l3-4 3 4' },
    ],
  },
  video: {
    mode: 'stroke',
    elements: [
      { tag: 'rect', x: 2, y: 5, width: 20, height: 14, rx: 4 },
      { tag: 'path', d: 'M10 9.5v5l4.5-2.5z', filled: true },
    ],
  },
  play: {
    mode: 'fill',
    elements: [{ tag: 'path', d: 'M8 5v14l11-7z', className: 'fill-current' }],
  },
  upload: {
    mode: 'stroke',
    elements: [{ tag: 'path', d: 'M12 16V4M6 10l6-6 6 6M4 20h16' }],
  },
  'qr-sample': {
    mode: 'fill',
    viewBox: '-1 -1 27 27',
    elements: [
      {
        tag: 'path',
        d: 'M0 0h7v7h-7zM1 1v5h5v-5zM2 2h3v3h-3zM18 0h7v7h-7zM19 1v5h5v-5zM20 2h3v3h-3zM0 18h7v7h-7zM1 19v5h5v-5zM2 20h3v3h-3z',
        fillRule: 'evenodd',
        className: 'fill-qc-accent',
      },
      { tag: 'path', d: QR_SAMPLE_DATA, className: 'fill-qc-ink' },
      { tag: 'rect', x: 10, y: 10, width: 5, height: 5, rx: 1.2, className: 'fill-qc-accent' },
      {
        tag: 'path',
        d: 'M11.4 11.4h0.9v0.9h-0.9zM12.7 11.4h0.9v0.9h-0.9zM11.4 12.7h0.9v0.9h-0.9zM12.9 12.9h0.6v0.6h-0.6z',
        className: 'fill-white',
      },
    ],
  },
};
