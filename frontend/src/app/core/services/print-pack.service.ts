import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PrintPackContent, PrintPackFormat } from '../models/print-pack.model';
import { PAGE_SETUP, PdfDocumentLike, drawPrintPack } from '../utils/print-pack-layout';

/**
 * Produit les imprimés PDF prêts à poser à partir du QR code courant.
 * Toute la mise en page vit dans `print-pack-layout` (fonctions pures) :
 * ce service ne fait qu'instancier jsPDF et renvoyer le binaire.
 */
@Injectable({
  providedIn: 'root',
})
export class PrintPackService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  async generate(
    format: PrintPackFormat,
    qrPngDataUrl: string,
    content: PrintPackContent
  ): Promise<Blob | null> {
    if (!this.isBrowser || !qrPngDataUrl) {
      return null;
    }

    const { jsPDF } = await import('jspdf');
    const setup = PAGE_SETUP[format];
    const pdf = new jsPDF({ orientation: setup.orientation, unit: 'mm', format: setup.format });

    // Le chevalet a besoin du QR déjà pivoté pour sa moitié tête-bêche.
    const rotated = format === 'chevalet-a6' ? await this.rotate180(qrPngDataUrl) : undefined;

    drawPrintPack(pdf as unknown as PdfDocumentLike, format, qrPngDataUrl, content, rotated);

    return pdf.output('blob');
  }

  /** Renvoie la même image pivotée de 180°, ou l'originale si le rendu échoue */
  private async rotate180(dataUrl: string): Promise<string> {
    try {
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('image illisible'));
        image.src = dataUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return dataUrl;

      ctx.translate(image.width, image.height);
      ctx.rotate(Math.PI);
      ctx.drawImage(image, 0, 0);
      return canvas.toDataURL('image/png');
    } catch {
      return dataUrl;
    }
  }
}

export { PrintPackService as PrintPack };
