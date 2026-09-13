import { TestBed } from '@angular/core/testing';
import { QrSimulatorService } from './qr-simulator.service';
import { QrEngineService } from '../../../core/services/qr-engine.service';
import { QR_CENTRAL_LOGO_BASE64 } from '../../../core/constants/qr-logo.constant';
import { QrEngineOptions } from '../../../core/models/qr-engine.model';

describe('QrSimulatorService (Catégorie 2 - Test Unitaire)', () => {
  let service: QrSimulatorService;
  let qrEngineMock: {
    getSvgString: any;
    download: any;
  };

  beforeEach(async () => {
    qrEngineMock = {
      getSvgString: vi.fn().mockResolvedValue('<svg id="mock-live-qr"></svg>'),
      download: vi.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [
        QrSimulatorService,
        { provide: QrEngineService, useValue: qrEngineMock },
      ],
    });

    service = TestBed.inject(QrSimulatorService);
    await service.regenerateQr();
  });

  it('devrait être initialisé correctement', () => {
    expect(service).toBeTruthy();
    expect(service.mode()).toBe('url');
    expect(service.selectedPaletteId()).toBe('violet-pop');
    expect(service.bottomText()).toBe('REJOIGNEZ LA COMMUNAUTÉ ✨');
  });

  it('devrait contenir les 4 palettes de couleurs luxueuses obligatoires', () => {
    const palettes = service.palettes();
    expect(palettes.length).toBe(4);
    const ids = palettes.map((p) => p.id);
    expect(ids).toContain('violet-pop');
    expect(ids).toContain('menthe-fraiche');
    expect(ids).toContain('sunset-coral');
    expect(ids).toContain('cyan-electrique');
  });

  describe('US1 - Rendu Vectoriel avec ECL H (30%) et Logo Central', () => {
    it('devrait appeler QrEngineService avec ECL "H" et le logo Base64 circulaire', async () => {
      await service.regenerateQr();

      expect(qrEngineMock.getSvgString).toHaveBeenCalled();
      const lastCallArgs: QrEngineOptions = qrEngineMock.getSvgString.mock.calls.at(-1)![0];

      expect(lastCallArgs.qrOptions.errorCorrectionLevel).toBe('H');
      expect(lastCallArgs.image).toBe(QR_CENTRAL_LOGO_BASE64);
      expect(lastCallArgs.imageOptions?.hideBackgroundDots).toBe(true);
      expect(lastCallArgs.dotsOptions.type).toBe('rounded');
      expect(lastCallArgs.cornersSquareOptions.type).toBe('extra-rounded');
      expect(lastCallArgs.cornersDotOptions.type).toBe('dot');
    });

    it('devrait exposer le balisage SVG prêt dans qrSvgMarkup', async () => {
      await service.regenerateQr();
      expect(service.qrSvgMarkup()).toBe('<svg id="mock-live-qr"></svg>');
      expect(service.status().kind).toBe('ready');
    });
  });

  describe('US2 - Commutateur Lien / Texte et Debounce 150ms', () => {
    it('devrait basculer en mode "text" et adapter la charge utile', async () => {
      service.setMode('text');
      expect(service.mode()).toBe('text');

      service.setValue('Wi-Fi: RitzParis_VIP');
      const payload = service.payload();
      expect(payload.kind).toBe('text');
      if (payload.kind === 'text') {
        expect(payload.content).toBe('Wi-Fi: RitzParis_VIP');
      }
    });

    it('devrait normaliser l\'URL avec "https://" en mode url si non spécifié', () => {
      service.setMode('url');
      service.setValue('bistro-parisien.com/menu');

      const payload = service.payload();
      expect(payload.kind).toBe('url');
      if (payload.kind === 'url') {
        expect(payload.rawUrl).toBe('bistro-parisien.com/menu');
        expect(payload.targetUrl).toBe('https://bistro-parisien.com/menu');
      }
    });

    it('devrait conserver le protocole existant (https:// ou http://) sans doubler', () => {
      service.setMode('url');
      service.setValue('https://palacemeurice.com');

      const payload = service.payload();
      if (payload.kind === 'url') {
        expect(payload.targetUrl).toBe('https://palacemeurice.com');
      }
    });

    it('devrait débouncer la saisie au clavier de 150 ms', () => {
      vi.useFakeTimers();
      qrEngineMock.getSvgString.mockClear();

      service.setValue('a');
      vi.advanceTimersByTime(50);
      service.setValue('ab');
      vi.advanceTimersByTime(50);
      service.setValue('abc');

      // À 100ms depuis le début, mais moins de 150ms depuis la dernière saisie
      expect(qrEngineMock.getSvgString).not.toHaveBeenCalled();

      // On avance de 150ms après le dernier appel
      vi.advanceTimersByTime(150);
      expect(qrEngineMock.getSvgString).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });

  describe('US3 - Personnalisation Chromatique & Téléchargement SVG', () => {
    it('devrait appliquer le dégradé de la palette sélectionnée lors de la régénération', async () => {
      service.selectPalette('menthe-fraiche');
      await service.regenerateQr();

      const lastCallArgs: QrEngineOptions = qrEngineMock.getSvgString.mock.calls.at(-1)![0];
      const palette = service.selectedPalette();

      expect(lastCallArgs.dotsOptions.gradient?.colorStops[0].color).toBe(palette.previewGradient.start);
      expect(lastCallArgs.dotsOptions.gradient?.colorStops[1].color).toBe(palette.previewGradient.end);
    });

    it('devrait déclencher le téléchargement SVG via QrEngineService', async () => {
      await service.downloadSvg();
      expect(qrEngineMock.download).toHaveBeenCalledWith(
        expect.objectContaining({
          qrOptions: expect.objectContaining({ errorCorrectionLevel: 'H' }),
          image: QR_CENTRAL_LOGO_BASE64,
        }),
        expect.stringContaining('qrcraft'),
        'svg'
      );
    });
  });
});
