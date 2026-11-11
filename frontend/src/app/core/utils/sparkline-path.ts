/**
 * Calcul pur des tracés de courbe miniature (FR-011).
 *
 * Aucune dépendance graphique : une série de nombres devient un attribut `d`
 * de SVG. Cas dégénérés sans division par zéro :
 * - série vide → chaîne vide (rien n'est dessiné) ;
 * - point unique → segment horizontal au milieu ;
 * - valeurs toutes égales → ligne plate au milieu.
 *
 * Options :
 * - `scale` fixe l'échelle verticale (reproduire une maquette au pixel) ;
 * - `xs` fixe l'abscisse de chaque point, dans les unités du viewBox.
 */

export interface SparklineScale {
  readonly min: number;
  readonly max: number;
}

export interface SparklineOptions {
  readonly scale?: SparklineScale;
  readonly xs?: readonly number[];
}

interface Point {
  readonly x: number;
  readonly y: number;
}

function round(value: number): string {
  return (Math.round(value * 100) / 100).toString();
}

function toPoints(
  values: readonly number[],
  width: number,
  height: number,
  options: SparklineOptions
): readonly Point[] {
  if (values.length === 0) {
    return [];
  }
  // Un point seul devient un segment horizontal : on double la valeur.
  const series = values.length === 1 ? [values[0], values[0]] : values;
  const min = options.scale ? options.scale.min : Math.min(...series);
  const max = options.scale ? options.scale.max : Math.max(...series);
  const span = max - min;
  const stepX = width / (series.length - 1);

  return series.map((value, index) => ({
    x: options.xs && options.xs[index] !== undefined ? options.xs[index] : index * stepX,
    y: span === 0 ? height / 2 : height - ((value - min) / span) * height,
  }));
}

/** Tracé de la ligne seule, au format `d` de SVG. */
export function sparklinePath(
  values: readonly number[],
  width: number,
  height: number,
  options: SparklineOptions = {}
): string {
  return toPoints(values, width, height, options)
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${round(point.x)} ${round(point.y)}`)
    .join(' ');
}

/** Surface sous la ligne, fermée sur le bas du viewBox. */
export function sparklineAreaPath(
  values: readonly number[],
  width: number,
  height: number,
  options: SparklineOptions = {}
): string {
  const line = sparklinePath(values, width, height, options);
  if (line === '') {
    return '';
  }
  return `${line} L${round(width)} ${round(height)} L0 ${round(height)} Z`;
}
