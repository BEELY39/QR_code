import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ExportOptions, ExportResult } from '../models/export.model';

@Injectable({
  providedIn: 'root',
})
export class DomExportService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  async dataUrlToBlob(dataUrl: string): Promise<Blob> {
    if (dataUrl.startsWith('data:image/svg+xml')) {
      const commaIndex = dataUrl.indexOf(',');
      const meta = dataUrl.substring(0, commaIndex);
      const rawData = dataUrl.substring(commaIndex + 1);
      const isBase64 = meta.includes(';base64');
      const decoded = isBase64 ? atob(rawData) : decodeURIComponent(rawData);
      return new Blob([decoded], { type: 'image/svg+xml;charset=utf-8' });
    }
    const res = await fetch(dataUrl);
    return await res.blob();
  }

  async captureToSvg(element: HTMLElement, filename: string = 'qrcraft-design.svg'): Promise<ExportResult> {
    if (!this.isBrowser || !element) {
      const fallbackBlob = new Blob([], { type: 'image/svg+xml' });
      return {
        blob: fallbackBlob,
        dataUrl: '',
        filename,
        revocationCallback: () => {},
      };
    }

    const htmlToImage = await import('html-to-image');
    const dataUrl = await htmlToImage.toSvg(element, {
      cacheBust: true,
    });

    const blob = await this.dataUrlToBlob(dataUrl);
    let blobUrl = URL.createObjectURL(blob);

    return {
      blob,
      dataUrl,
      filename,
      revocationCallback: () => {
        if (blobUrl) {
          URL.revokeObjectURL(blobUrl);
          blobUrl = '';
        }
      },
    };
  }

  async captureToPng(element: HTMLElement, scale: number = 2, filename: string = 'qrcraft-design.png'): Promise<ExportResult> {
    if (!this.isBrowser || !element) {
      const fallbackBlob = new Blob([], { type: 'image/png' });
      return {
        blob: fallbackBlob,
        dataUrl: '',
        filename,
        revocationCallback: () => {},
      };
    }

    const htmlToImage = await import('html-to-image');
    const dataUrl = await htmlToImage.toPng(element, {
      pixelRatio: scale,
      cacheBust: true,
    });

    const blob = await this.dataUrlToBlob(dataUrl);
    let blobUrl = URL.createObjectURL(blob);

    return {
      blob,
      dataUrl,
      filename,
      revocationCallback: () => {
        if (blobUrl) {
          URL.revokeObjectURL(blobUrl);
          blobUrl = '';
        }
      },
    };
  }

  async exportToPdf(element: HTMLElement, options: Partial<ExportOptions> = {}): Promise<ExportResult> {
    const filename = options.filename ?? 'qrcraft-document.pdf';
    const scale = options.scale ?? 2;

    if (!this.isBrowser || !element) {
      const fallbackBlob = new Blob([], { type: 'application/pdf' });
      return {
        blob: fallbackBlob,
        dataUrl: '',
        filename,
        revocationCallback: () => {},
      };
    }

    const pngResult = await this.captureToPng(element, scale, 'temp.png');
    const { jsPDF } = await import('jspdf');

    const orientation = options.pdfOrientation ?? 'portrait';
    const format = options.pdfPageSize === 'custom' ? 'a4' : (options.pdfPageSize ?? 'a4');

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const printableWidth = pageWidth - margin * 2;

    pdf.addImage(pngResult.dataUrl, 'PNG', margin, margin, printableWidth, 0);

    const blob = pdf.output('blob');
    const dataUrl = pdf.output('dataurlstring');
    let blobUrl = URL.createObjectURL(blob);

    // Revoke intermediate PNG capture
    pngResult.revocationCallback();

    return {
      blob,
      dataUrl,
      filename,
      revocationCallback: () => {
        if (blobUrl) {
          URL.revokeObjectURL(blobUrl);
          blobUrl = '';
        }
      },
    };
  }

  saveAndRelease(result: ExportResult): void {
    if (!this.isBrowser || !result) {
      return;
    }

    const blobUrl = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Principle III: Immediate memory release
    URL.revokeObjectURL(blobUrl);
    result.revocationCallback();
  }
}

export { DomExportService as DomExport };
