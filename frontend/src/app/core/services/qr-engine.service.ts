import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QrEngineOptions, ErrorCorrectionLevel } from '../models/qr-engine.model';

interface QrCodeStylingInstance {
  getRawData(extension: string): Promise<Blob | null>;
  download(downloadOptions: { name?: string; extension?: string }): Promise<void>;
  append(element: HTMLElement): void;
}

type QrCodeStylingConstructor = new (options?: unknown) => QrCodeStylingInstance;

@Injectable({
  providedIn: 'root',
})
export class QrEngineService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  normalizeOptions(options: QrEngineOptions): QrEngineOptions {
    let ecl: ErrorCorrectionLevel = options.qrOptions?.errorCorrectionLevel ?? 'M';
    if (options.image && (ecl === 'L' || ecl === 'M')) {
      ecl = 'Q';
    }
    return {
      ...options,
      qrOptions: {
        ...options.qrOptions,
        errorCorrectionLevel: ecl,
      },
    };
  }

  async createInstance(options: QrEngineOptions): Promise<QrCodeStylingInstance | null> {
    if (!this.isBrowser) {
      return null;
    }
    const module = await import('qr-code-styling');
    const QRCodeStyling = (module.default || (module as Record<string, unknown>)['QRCodeStyling']) as QrCodeStylingConstructor;
    const normalized = this.normalizeOptions(options);
    return new QRCodeStyling(normalized);
  }

  async renderToElement(container: HTMLElement, options: QrEngineOptions): Promise<void> {
    if (!this.isBrowser || !container) {
      return;
    }
    const instance = await this.createInstance(options);
    if (!instance) return;
    container.innerHTML = '';
    instance.append(container);
  }

  async getSvgString(options: QrEngineOptions): Promise<string> {
    if (!this.isBrowser) {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"></svg>';
    }
    const instance = await this.createInstance(options);
    if (!instance) return '';
    const rawData = await instance.getRawData('svg');
    if (rawData instanceof Blob) {
      return await rawData.text();
    }
    return '';
  }

  async download(options: QrEngineOptions, filename: string, extension: 'svg' | 'png' = 'svg'): Promise<void> {
    if (!this.isBrowser) {
      return;
    }
    const instance = await this.createInstance(options);
    if (!instance) return;
    await instance.download({
      name: filename,
      extension: extension,
    });
  }
}

export { QrEngineService as QrEngine };
