import { drawPrintPack, mirrorPoint, truncate, PAGE_SETUP, PdfDocumentLike } from './print-pack-layout';
import { PrintPackContent } from '../models/print-pack.model';

/** Enregistre les appels de dessin pour vérifier la géométrie produite */
function createFakePdf() {
  const images: { data: string; x: number; y: number; w: number; h: number }[] = [];
  const texts: { text: string; x: number; y: number; angle?: number }[] = [];
  const rects: { x: number; y: number; w: number; h: number }[] = [];
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];

  const pdf: PdfDocumentLike = {
    setFont: () => undefined,
    setFontSize: () => undefined,
    setTextColor: () => undefined,
    setDrawColor: () => undefined,
    setLineWidth: () => undefined,
    setLineDashPattern: () => undefined,
    text: (text, x, y, options) => {
      texts.push({ text, x, y, angle: options?.angle });
      return undefined;
    },
    addImage: (data, _format, x, y, w, h) => {
      images.push({ data, x, y, w, h });
      return undefined;
    },
    line: (x1, y1, x2, y2) => {
      lines.push({ x1, y1, x2, y2 });
      return undefined;
    },
    rect: (x, y, w, h) => {
      rects.push({ x, y, w, h });
      return undefined;
    },
  };

  return { pdf, images, texts, rects, lines };
}

const content: PrintPackContent = {
  title: 'Wi-Fi gratuit',
  subtitle: 'Réseau : Cafe-Lumiere',
  instruction: "Ouvrez l'appareil photo et visez le code",
  credit: 'Créé avec QRCraft',
};

const QR = 'data:image/png;base64,AAAA';
const QR_ROTATED = 'data:image/png;base64,BBBB';

describe('print-pack-layout', () => {
  describe('mirrorPoint', () => {
    it('renvoie le symétrique central du panneau', () => {
      const box = { x: 0, y: 0, width: 148, height: 105 };
      expect(mirrorPoint(box, 10, 20)).toEqual({ x: 138, y: 85 });
    });

    it('tient compte du décalage du panneau dans la page', () => {
      const box = { x: 0, y: 105, width: 148, height: 105 };
      expect(mirrorPoint(box, 0, 0)).toEqual({ x: 148, y: 210 });
    });
  });

  describe('chevalet-a6', () => {
    it('dessine deux QR symétriques par rapport au pli', () => {
      const { pdf, images } = createFakePdf();
      drawPrintPack(pdf, 'chevalet-a6', QR, content, QR_ROTATED);

      expect(images.length).toBe(2);
      const [bas, haut] = images;

      // Le panneau tête-bêche utilise l'image déjà pivotée
      expect(bas.data).toBe(QR);
      expect(haut.data).toBe(QR_ROTATED);

      // Même taille, même axe vertical
      expect(haut.w).toBe(bas.w);
      expect(haut.x).toBe(bas.x);

      // Symétrie autour du pli (y = 105) : distances égales de part et d'autre
      const pli = 105;
      expect(bas.y - pli).toBeCloseTo(pli - (haut.y + haut.h), 5);
    });

    it('garde chaque panneau dans sa moitié de page', () => {
      const { pdf, images, texts } = createFakePdf();
      drawPrintPack(pdf, 'chevalet-a6', QR, content, QR_ROTATED);

      const [bas, haut] = images;
      expect(haut.y).toBeGreaterThanOrEqual(0);
      expect(haut.y + haut.h).toBeLessThanOrEqual(105);
      expect(bas.y).toBeGreaterThanOrEqual(105);
      expect(bas.y + bas.h).toBeLessThanOrEqual(210);

      // Les textes du panneau haut sont pivotés, ceux du bas ne le sont pas
      const pivotes = texts.filter((t) => t.angle === 180);
      const droits = texts.filter((t) => t.angle !== 180 && t.text !== 'plier ici');
      expect(pivotes.length).toBe(4);
      expect(droits.length).toBe(4);
      expect(pivotes.every((t) => t.y <= 105)).toBe(true);
      expect(droits.every((t) => t.y >= 105)).toBe(true);
    });

    it('trace un trait de pliage au milieu de la page', () => {
      const { pdf, lines, texts } = createFakePdf();
      drawPrintPack(pdf, 'chevalet-a6', QR, content, QR_ROTATED);

      expect(lines.length).toBe(1);
      expect(lines[0].y1).toBe(105);
      expect(lines[0].y2).toBe(105);
      expect(texts.some((t) => t.text === 'plier ici')).toBe(true);
    });

    it('ne superpose jamais la consigne et la mention de pied', () => {
      const { pdf, texts } = createFakePdf();
      drawPrintPack(pdf, 'chevalet-a6', QR, content, QR_ROTATED);

      const consigne = texts.find((t) => t.text === content.instruction && t.angle !== 180);
      const mention = texts.find((t) => t.text === content.credit && t.angle !== 180);
      expect(consigne).toBeTruthy();
      expect(mention).toBeTruthy();
      expect(mention!.y - consigne!.y).toBeGreaterThanOrEqual(8);
    });

    it("retombe sur l'image d'origine si aucune version pivotée n'est fournie", () => {
      const { pdf, images } = createFakePdf();
      drawPrintPack(pdf, 'chevalet-a6', QR, content);
      expect(images.map((i) => i.data)).toEqual([QR, QR]);
    });
  });

  describe('affichette-a5', () => {
    it('dessine un seul QR centré horizontalement', () => {
      const { pdf, images } = createFakePdf();
      drawPrintPack(pdf, 'affichette-a5', QR, content);

      expect(images.length).toBe(1);
      const qr = images[0];
      expect(qr.x + qr.w / 2).toBeCloseTo(74, 5);
      expect(qr.y + qr.h).toBeLessThanOrEqual(210);
    });
  });

  describe('etiquettes-5x5', () => {
    it('produit 15 étiquettes de 50 mm avec leur repère de découpe', () => {
      const { pdf, images, rects } = createFakePdf();
      drawPrintPack(pdf, 'etiquettes-5x5', QR, content);

      expect(images.length).toBe(15);
      expect(rects.length).toBe(15);
      expect(rects.every((r) => r.w === 50 && r.h === 50)).toBe(true);
      // Toutes les étiquettes tiennent dans une A4
      expect(rects.every((r) => r.x >= 0 && r.x + r.w <= 210)).toBe(true);
      expect(rects.every((r) => r.y >= 0 && r.y + r.h <= 297)).toBe(true);
    });
  });

  describe('PAGE_SETUP', () => {
    it('associe chaque modèle à un format de page', () => {
      expect(PAGE_SETUP['chevalet-a6']).toEqual({ format: 'a5', orientation: 'portrait' });
      expect(PAGE_SETUP['affichette-a5']).toEqual({ format: 'a5', orientation: 'portrait' });
      expect(PAGE_SETUP['etiquettes-5x5']).toEqual({ format: 'a4', orientation: 'portrait' });
    });
  });

  describe('truncate', () => {
    it('abrège au-delà de la limite et laisse le reste intact', () => {
      expect(truncate('court', 10)).toBe('court');
      expect(truncate('abcdefghij', 5)).toBe('abcd…');
    });
  });
});
