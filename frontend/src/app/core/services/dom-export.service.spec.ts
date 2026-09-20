import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DomExportService } from './dom-export.service';
import { ExportResult } from '../models/export.model';

describe('DomExportService (Catégorie 2 - Test Unitaire)', () => {
  let service: DomExportService;

  describe('Environnement Navigateur (Client)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          DomExportService,
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });
      service = TestBed.inject(DomExportService);
    });

    it('devrait être instancié avec succès', () => {
      expect(service).toBeTruthy();
      expect(service.isBrowser).toBe(true);
    });

    it('devrait convertir un dataUrl en Blob proprement', async () => {
      const dummyDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const blob = await service.dataUrlToBlob(dummyDataUrl);
      expect(blob).toBeTruthy();
      expect(blob.size).toBeGreaterThan(0);
    });

    it('devrait exécuter saveAndRelease et révoquer le blob immédiatement (Principe III)', () => {
      const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');
      const createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:dummy');

      const mockCallback = vi.fn();
      const mockResult: ExportResult = {
        blob: new Blob(['test']),
        dataUrl: 'data:text/plain;base64,dGVzdA==',
        filename: 'menu-parisien.png',
        revocationCallback: mockCallback,
      };

      service.saveAndRelease(mockResult);

      expect(createSpy).toHaveBeenCalled();
      expect(revokeSpy).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('Environnement Serveur (SSR)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          DomExportService,
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
      service = TestBed.inject(DomExportService);
    });

    it('devrait détecter correctement le mode serveur', () => {
      expect(service.isBrowser).toBe(false);
    });

    it('devrait retourner un résultat de repli sans crasher en SSR', async () => {
      const dummyEl = {} as HTMLElement;
      const pngResult = await service.captureToPng(dummyEl);
      expect(pngResult).toBeTruthy();
      expect(pngResult.dataUrl).toBe('');

      const svgResult = await service.captureToSvg(dummyEl);
      expect(svgResult).toBeTruthy();
      expect(svgResult.dataUrl).toBe('');

      const pdfResult = await service.exportToPdf(dummyEl);
      expect(pdfResult).toBeTruthy();
      expect(pdfResult.dataUrl).toBe('');

      expect(() => service.saveAndRelease(pngResult)).not.toThrow();
    });
  });
});
