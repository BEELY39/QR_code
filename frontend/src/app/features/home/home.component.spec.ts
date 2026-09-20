import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { QrSimulatorService } from './data-access/qr-simulator.service';
import { QrEngineService } from '../../core/services/qr-engine.service';

describe('HomeComponent (Catégorie 3 - Test Intégration)', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let simulatorService: QrSimulatorService;
  let qrEngineMock: {
    getSvgString: ReturnType<typeof vi.fn>;
    download: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    qrEngineMock = {
      getSvgString: vi.fn().mockResolvedValue('<svg id="home-live-qr"></svg>'),
      download: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: QrEngineService, useValue: qrEngineMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    simulatorService = TestBed.inject(QrSimulatorService);
    await simulatorService.regenerateQr();
    fixture.detectChanges();
  });

  it('devrait créer le composant avec succès', () => {
    expect(component).toBeTruthy();
  });

  it('devrait intégrer toutes les sections attendues de la maquette', () => {
    const navbar = fixture.debugElement.query(By.css('app-navbar'));
    const hero = fixture.debugElement.query(By.css('app-hero-section'));
    const simulator = fixture.debugElement.query(By.css('app-simulator-section'));
    const features = fixture.debugElement.query(By.css('app-features-section'));
    const showcase = fixture.debugElement.query(By.css('app-showcase-section'));
    const alternatives = fixture.debugElement.query(By.css('app-alternatives-section'));
    const faq = fixture.debugElement.query(By.css('app-faq-section'));
    const cta = fixture.debugElement.query(By.css('app-cta-banner'));
    const footer = fixture.debugElement.query(By.css('app-footer'));

    expect(navbar).toBeTruthy();
    expect(hero).toBeTruthy();
    expect(simulator).toBeTruthy();
    expect(features).toBeTruthy();
    expect(showcase).toBeTruthy();
    expect(alternatives).toBeTruthy();
    expect(faq).toBeTruthy();
    expect(cta).toBeTruthy();
    expect(footer).toBeTruthy();
  });

  describe('US1 (Intégration) - Transmission du SVG dynamique au simulateur', () => {
    it('devrait transmettre le balisage SVG généré à SimulatorSectionComponent', async () => {
      await simulatorService.regenerateQr();
      fixture.detectChanges();

      const simulatorDebugEl = fixture.debugElement.query(By.css('app-simulator-section'));
      expect(simulatorDebugEl.componentInstance.qrSvgMarkup()).toBe('<svg id="home-live-qr"></svg>');

      const svgContainer = fixture.debugElement.query(By.css('#live-qr-svg-container'));
      expect(svgContainer).toBeTruthy();
      expect(svgContainer.nativeElement.innerHTML).toContain('home-live-qr');
    });
  });

  describe('US2 (Intégration) - Bascule Mode Lien / Texte et Saisie', () => {
    it('devrait relayer le changement de mode vers le service et mettre à jour l\'UI', () => {
      const modeTextBtn = fixture.debugElement.query(By.css('#mode-toggle-text'));
      expect(modeTextBtn).toBeTruthy();

      modeTextBtn.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(simulatorService.mode()).toBe('text');
      const inputEl = fixture.debugElement.query(By.css('#demo-input'));
      expect(inputEl.nativeElement.getAttribute('placeholder')).toContain('Bonjour');
    });

        it('devrait relayer le changement de mode wifi vers le service et afficher le formulaire', () => {
      const modeWifiBtn = fixture.debugElement.query(By.css('#mode-toggle-wifi'));
      expect(modeWifiBtn).toBeTruthy();

      modeWifiBtn.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(simulatorService.mode()).toBe('wifi');
      const wifiFormEl = fixture.debugElement.query(By.css('app-wifi-form'));
      expect(wifiFormEl).toBeTruthy();
    });

    it('devrait propager la saisie textuelle vers le service', () => {
      const simulatorDebugEl = fixture.debugElement.query(By.css('app-simulator-section'));

      simulatorDebugEl.triggerEventHandler('valueChange', 'https://palace-le-meurice.com/room-service');
      fixture.detectChanges();

      expect(simulatorService.rawValue()).toBe('https://palace-le-meurice.com/room-service');
      expect(simulatorService.displayUrl()).toBe('palace-le-meurice.com/room-service');
    });
  });

  describe('US3 (Intégration) - Changement de Palette et Clic Téléchargement', () => {
    it('devrait propager la sélection de palette vers le service', () => {
      const simulatorDebugEl = fixture.debugElement.query(By.css('app-simulator-section'));

      simulatorDebugEl.triggerEventHandler('paletteSelect', 'menthe-fraiche');
      fixture.detectChanges();

      expect(simulatorService.selectedPalette().id).toBe('menthe-fraiche');
    });

    it('devrait déclencher downloadSvg sur le service lors du clic sur le bouton de téléchargement', async () => {
      const downloadSpy = vi.spyOn(simulatorService, 'downloadSvg').mockResolvedValue();
      const downloadBtn = fixture.debugElement.query(By.css('#download-svg-btn'));
      expect(downloadBtn).toBeTruthy();

      downloadBtn.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(downloadSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Feature 004 (Intégration) - Options Avancées QR (Design & Onglets)', () => {
    it('devrait basculer entre les onglets de design et afficher les formulaires correspondants', () => {
      // Onglet Couleurs
      const tabColorsBtn = fixture.debugElement.query(By.css('#tab-btn-colors'));
      expect(tabColorsBtn).toBeTruthy();
      tabColorsBtn.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('app-colors-form'))).toBeTruthy();

      // Onglet Cadre
      const tabFrameBtn = fixture.debugElement.query(By.css('#tab-btn-frame'));
      expect(tabFrameBtn).toBeTruthy();
      tabFrameBtn.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('app-frame-form'))).toBeTruthy();

      // Onglet Style
      const tabStyleBtn = fixture.debugElement.query(By.css('#tab-btn-style'));
      expect(tabStyleBtn).toBeTruthy();
      tabStyleBtn.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('app-styling-form'))).toBeTruthy();

      // Onglet Logo
      const tabLogoBtn = fixture.debugElement.query(By.css('#tab-btn-logo'));
      expect(tabLogoBtn).toBeTruthy();
      tabLogoBtn.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('app-logo-form'))).toBeTruthy();
    });

    it('devrait propager les modifications de design vers le service', () => {
      const simulatorDebugEl = fixture.debugElement.query(By.css('app-simulator-section'));
      expect(simulatorDebugEl).toBeTruthy();

      simulatorDebugEl.triggerEventHandler('designChange', {
        dotsStyle: 'dots',
        cornersColor: '#ff0000',
      });
      fixture.detectChanges();

      expect(simulatorService.design().dotsStyle).toBe('dots');
      expect(simulatorService.design().cornersColor).toBe('#ff0000');
    });
  });

  describe('Feature 005 (Intégration) - Rendu Pur du Cadre & Finitions', () => {
    it('devrait garantir l\'absence totale de double conteneur mockup (bg-inverse-surface) dans le simulateur', () => {
      const simulatorEl = fixture.debugElement.query(By.css('app-simulator-section'));
      expect(simulatorEl).toBeTruthy();
      expect(simulatorEl.query(By.css('.bg-inverse-surface'))).toBeFalsy();

      const framedContainer = simulatorEl.query(By.css('#live-qr-framed-container'));
      expect(framedContainer).toBeTruthy();
    });

    it('ne devrait plus contenir le champ redondant demo-banner dans le DOM', () => {
      const bannerInput = fixture.debugElement.query(By.css('#demo-banner'));
      expect(bannerInput).toBeFalsy();
    });

    it('devrait propager la mise à jour du cadre et afficher le gabarit correspondant sans conteneur parasite', () => {
      // Sélection du gabarit badge-bottom
      simulatorService.updateDesign({
        frame: {
          style: 'badge-bottom',
          text: 'SCANNEZ ICI',
          font: 'Outfit',
          frameColor: '#6750A4',
          textColor: '#ffffff',
        }
      });
      fixture.detectChanges();

      const badge = fixture.debugElement.query(By.css('[data-testid="frame-badge-bottom"]'));
      expect(badge).toBeTruthy();
      expect(badge.nativeElement.textContent).toContain('SCANNEZ ICI');

      // Sélection de rounded-border
      simulatorService.updateDesign({
        frame: {
          style: 'rounded-border',
          text: '',
          font: 'Roboto',
          frameColor: '#0284C7',
          textColor: '#ffffff',
        }
      });
      fixture.detectChanges();

      const roundedBorder = fixture.debugElement.query(By.css('[data-testid="frame-rounded-border"]'));
      expect(roundedBorder).toBeTruthy();
    });
  });
});

