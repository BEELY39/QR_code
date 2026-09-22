import { PrintPackContent, PrintPackFormat } from '../models/print-pack.model';

/**
 * Mise en page des imprimés PDF, isolée de tout code Angular :
 * fonctions pures prenant un document jsPDF en paramètre, donc exécutables
 * et vérifiables hors navigateur.
 *
 * Choix de conception :
 * - le QR est inséré en image haute définition et non redessiné, pour rester
 *   strictement identique à l'aperçu écran ;
 * - la zone de silence (marge blanche) est conservée autour du motif : sans
 *   elle, un code imprimé au ras d'un cadre n'est pas détecté ;
 * - les textes restent vectoriels (police PDF standard), donc nets à
 *   l'impression quel que soit l'agrandissement.
 */

/** Sous-ensemble de l'API jsPDF réellement utilisé par la mise en page */
export interface PdfDocumentLike {
  setFont(family: string, style?: string): unknown;
  setFontSize(size: number): unknown;
  setTextColor(r: number, g: number, b: number): unknown;
  setDrawColor(r: number, g: number, b: number): unknown;
  setLineWidth(width: number): unknown;
  setLineDashPattern(pattern: number[], phase: number): unknown;
  text(text: string, x: number, y: number, options?: { align?: string; angle?: number }): unknown;
  addImage(
    data: string,
    format: string,
    x: number,
    y: number,
    width: number,
    height: number,
    alias?: string,
    compression?: string,
    rotation?: number
  ): unknown;
  line(x1: number, y1: number, x2: number, y2: number): unknown;
  rect(x: number, y: number, width: number, height: number): unknown;
}

/** Zone rectangulaire où sont dessinés le QR et les textes (en mm) */
export interface PanelBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** Format de page attendu par jsPDF pour un modèle donné */
export interface PageSetup {
  readonly format: 'a4' | 'a5';
  readonly orientation: 'portrait' | 'landscape';
}

const INK: readonly [number, number, number] = [26, 27, 33];
const INK_SOFT: readonly [number, number, number] = [90, 90, 110];
const GUIDE: readonly [number, number, number] = [190, 190, 200];

/** Dimensions de page, en mm, par modèle */
export const PAGE_SETUP: Record<PrintPackFormat, PageSetup> = {
  'chevalet-a6': { format: 'a5', orientation: 'portrait' },
  'affichette-a5': { format: 'a5', orientation: 'portrait' },
  'etiquettes-5x5': { format: 'a4', orientation: 'portrait' },
};

/**
 * Point d'entrée : dessine le modèle demandé dans le document fourni.
 *
 * `qrPngRotatedDataUrl` est la même image déjà pivotée de 180°. Elle n'est
 * utilisée que par le chevalet, pour son panneau tête-bêche : la rotation
 * native de jsPDF ancre l'image sur un coin inattendu et la fait déborder sur
 * l'autre moitié de la page. Fournir l'image déjà retournée évite d'en dépendre.
 */
export function drawPrintPack(
  pdf: PdfDocumentLike,
  format: PrintPackFormat,
  qrPngDataUrl: string,
  content: PrintPackContent,
  qrPngRotatedDataUrl?: string
): void {
  switch (format) {
    case 'chevalet-a6': {
      // A5 portrait plié en deux : la moitié haute est imprimée tête-bêche
      // pour que le chevalet soit lisible des deux côtés une fois replié.
      const width = 148;
      const half = 105;
      drawPanel(pdf, { x: 0, y: half, width, height: half }, qrPngDataUrl, content, false);
      drawPanel(
        pdf,
        { x: 0, y: 0, width, height: half },
        qrPngRotatedDataUrl || qrPngDataUrl,
        content,
        true
      );
      drawFoldLine(pdf, width, half);
      return;
    }
    case 'affichette-a5':
      drawPanel(pdf, { x: 0, y: 0, width: 148, height: 210 }, qrPngDataUrl, content, false);
      return;
    case 'etiquettes-5x5':
      drawLabelSheet(pdf, qrPngDataUrl, content);
      return;
    default: {
      const exhaustive: never = format;
      throw new Error(`Format d'impression non supporté : ${String(exhaustive)}`);
    }
  }
}

/** Dessine un panneau complet : titre, QR, sous-titre, consigne, mention */
export function drawPanel(
  pdf: PdfDocumentLike,
  box: PanelBox,
  qrPngDataUrl: string,
  content: PrintPackContent,
  upsideDown: boolean
): void {
  const isPoster = box.height > 150;
  const qrSize = isPoster ? 78 : 46;
  const centerX = box.width / 2;

  // Rythme vertical, en mm depuis le haut du panneau. Les valeurs du chevalet
  // tiennent dans 105 mm sans que la consigne ne touche la mention de pied.
  const titleY = isPoster ? 34 : 16;
  const qrTop = isPoster ? 48 : 22;
  const subtitleY = qrTop + qrSize + (isPoster ? 18 : 12);
  const instructionY = subtitleY + (isPoster ? 10 : 8);
  const creditY = box.height - (isPoster ? 14 : 6);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(isPoster ? 30 : 20);
  pdf.setTextColor(INK[0], INK[1], INK[2]);
  placeText(pdf, box, centerX, titleY, content.title, upsideDown);

  placeImage(pdf, box, centerX - qrSize / 2, qrTop, qrSize, qrSize, qrPngDataUrl, upsideDown);

  if (content.subtitle) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(isPoster ? 16 : 11.5);
    pdf.setTextColor(INK[0], INK[1], INK[2]);
    placeText(pdf, box, centerX, subtitleY, content.subtitle, upsideDown);
  }

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(isPoster ? 12 : 9);
  pdf.setTextColor(INK_SOFT[0], INK_SOFT[1], INK_SOFT[2]);
  placeText(pdf, box, centerX, instructionY, content.instruction, upsideDown);

  if (content.credit) {
    pdf.setFontSize(isPoster ? 8.5 : 6.5);
    pdf.setTextColor(GUIDE[0], GUIDE[1], GUIDE[2]);
    placeText(pdf, box, centerX, creditY, content.credit, upsideDown);
  }
}

/**
 * Coordonnée équivalente dans un panneau retourné à 180°.
 * Exportée pour être testée : c'est le seul calcul non trivial de la mise en page.
 */
export function mirrorPoint(
  box: PanelBox,
  localX: number,
  localY: number
): { readonly x: number; readonly y: number } {
  return { x: box.x + box.width - localX, y: box.y + box.height - localY };
}

function placeText(
  pdf: PdfDocumentLike,
  box: PanelBox,
  localX: number,
  localY: number,
  text: string,
  upsideDown: boolean
): void {
  if (upsideDown) {
    const p = mirrorPoint(box, localX, localY);
    pdf.text(text, p.x, p.y, { align: 'center', angle: 180 });
    return;
  }
  pdf.text(text, box.x + localX, box.y + localY, { align: 'center' });
}

function placeImage(
  pdf: PdfDocumentLike,
  box: PanelBox,
  localX: number,
  localY: number,
  width: number,
  height: number,
  dataUrl: string,
  upsideDown: boolean
): void {
  if (upsideDown) {
    // L'image reçue est déjà pivotée : il suffit de placer son rectangle au
    // symétrique central du panneau (coin haut-gauche = miroir du coin bas-droit).
    const p = mirrorPoint(box, localX + width, localY + height);
    pdf.addImage(dataUrl, 'PNG', p.x, p.y, width, height, undefined, 'FAST');
    return;
  }
  pdf.addImage(dataUrl, 'PNG', box.x + localX, box.y + localY, width, height, undefined, 'FAST');
}

function drawFoldLine(pdf: PdfDocumentLike, pageWidth: number, y: number): void {
  pdf.setDrawColor(GUIDE[0], GUIDE[1], GUIDE[2]);
  pdf.setLineWidth(0.2);
  pdf.setLineDashPattern([2, 2], 0);
  pdf.line(8, y, pageWidth - 8, y);
  pdf.setLineDashPattern([], 0);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.5);
  pdf.setTextColor(GUIDE[0], GUIDE[1], GUIDE[2]);
  pdf.text('plier ici', pageWidth / 2, y - 1.5, { align: 'center' });
}

/** Planche de 15 étiquettes 50 × 50 mm sur A4 avec repères de découpe */
function drawLabelSheet(pdf: PdfDocumentLike, qrPngDataUrl: string, content: PrintPackContent): void {
  const cols = 3;
  const rows = 5;
  const label = 50;
  const gapX = (210 - cols * label) / (cols + 1);
  const gapY = (297 - rows * label) / (rows + 1);
  const qrSize = 33;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = gapX + col * (label + gapX);
      const y = gapY + row * (label + gapY);

      pdf.setDrawColor(GUIDE[0], GUIDE[1], GUIDE[2]);
      pdf.setLineWidth(0.15);
      pdf.setLineDashPattern([1.5, 1.5], 0);
      pdf.rect(x, y, label, label);
      pdf.setLineDashPattern([], 0);

      pdf.addImage(qrPngDataUrl, 'PNG', x + (label - qrSize) / 2, y + 5, qrSize, qrSize, undefined, 'FAST');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(INK[0], INK[1], INK[2]);
      pdf.text(truncate(content.title, 24), x + label / 2, y + label - 8, { align: 'center' });

      if (content.subtitle) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6);
        pdf.setTextColor(INK_SOFT[0], INK_SOFT[1], INK_SOFT[2]);
        pdf.text(truncate(content.subtitle, 32), x + label / 2, y + label - 4, { align: 'center' });
      }
    }
  }
}

export function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
