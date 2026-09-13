import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { QrEngineService } from './qr-engine.service';
import { QrEngineOptions } from '../models/qr-engine.model';

describe('QrEngineService (Catégorie 2 - Test Unitaire)', () => {
  let service: QrEngineService;

  const sampleOptions: QrEngineOptions = {
    width: 300,
    height: 300,
    data: 'https://hotel-le-meurice.com',
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'M',
    },
    dotsOptions: {
      type: 'rounded',
      color: '#412ce7',
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
      color: '#7a3cf5',
    },
    cornersDotOptions: {
      type: 'dot',
      color: '#412ce7',
    },
  };

  describe('Environnement Navigateur (Client)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          QrEngineService,
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });
      service = TestBed.inject(QrEngineService);
    });

    it('devrait être instancié avec succès', () => {
      expect(service).toBeTruthy();
      expect(service.isBrowser).toBe(true);
    });

    it('devrait forcer le niveau de correction ECL à Q dès qu un logo est présent (Principe II)', () => {
      const optionsWithLogo: QrEngineOptions = {
        ...sampleOptions,
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        qrOptions: {
          typeNumber: 0,
          errorCorrectionLevel: 'M',
        },
      };

      const normalized = service.normalizeOptions(optionsWithLogo);
      expect(normalized.qrOptions.errorCorrectionLevel).toBe('Q');
    });

    it('devrait préserver le niveau H s il est déjà explicitement configuré', () => {
      const optionsWithH: QrEngineOptions = {
        ...sampleOptions,
        image: 'data:image/png;base64,dummy',
        qrOptions: {
          typeNumber: 0,
          errorCorrectionLevel: 'H',
        },
      };

      const normalized = service.normalizeOptions(optionsWithH);
      expect(normalized.qrOptions.errorCorrectionLevel).toBe('H');
    });

    it('devrait créer une instance QRCodeStyling sans lever d exception', async () => {
      const instance = await service.createInstance(sampleOptions);
      expect(instance).toBeTruthy();
    });
  });

  describe('Environnement Serveur (SSR)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          QrEngineService,
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
      service = TestBed.inject(QrEngineService);
    });

    it('devrait détecter correctement le mode serveur', () => {
      expect(service.isBrowser).toBe(false);
    });

    it('devrait no-op de manière défensive sans tenter d accéder au DOM', async () => {
      const dummyDiv = {} as HTMLElement;
      await expect(service.renderToElement(dummyDiv, sampleOptions)).resolves.toBeUndefined();
      const svg = await service.getSvgString(sampleOptions);
      expect(svg).toContain('<svg');
      await expect(service.download(sampleOptions, 'test')).resolves.toBeUndefined();
    });
  });
});
