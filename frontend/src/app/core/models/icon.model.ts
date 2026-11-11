/**
 * Registre d'icônes de la refonte (FR-012).
 *
 * Union fermée : demander une icône absente du registre est une erreur de
 * compilation. Les couleurs passent par des classes de tokens (`className`),
 * jamais par une valeur en dur (FR-003).
 */
export type IconName =
  | 'qr-grid'
  | 'arrow-right'
  | 'check'
  | 'map-pin'
  | 'clock'
  | 'bar-chart'
  | 'smartphone'
  | 'shield-check'
  | 'chevron-right'
  | 'menu'
  | 'utensils'
  | 'billboard'
  | 'video'
  | 'upload'
  | 'qr-sample';

export interface IconPath {
  readonly tag: 'path';
  readonly d: string;
  /** Remplissage plein au lieu du trait (ex. triangle de lecture) */
  readonly filled?: boolean;
  readonly fillRule?: 'evenodd';
  readonly className?: string;
}

export interface IconRect {
  readonly tag: 'rect';
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly rx?: number;
  readonly className?: string;
}

export interface IconCircle {
  readonly tag: 'circle';
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly className?: string;
}

export type IconElement = IconPath | IconRect | IconCircle;

export interface IconDefinition {
  /** `stroke` : trait fin de la refonte ; `fill` : motif plein (QR illustratif) */
  readonly mode: 'stroke' | 'fill';
  readonly elements: readonly IconElement[];
}
