import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';
import { QrSimulatorService } from './data-access/qr-simulator.service';
import { QrEngineService } from '../../core/services/qr-engine.service';

describe('HomeComponent (Catégorie 3 - Test Intégration)', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let simulatorService: QrSimulatorService;
  let qrEngineMock: {
    getSvgString: any;
    download: any;
  };

  beforeEach(async () => {
    qrEngineMock = {
      getSvgString: vi.fn().mockResolvedValue('<svg id="home-live-qr"></svg>'),
      download: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
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
    const cta = fixture.debugElement.query(By.css('app-cta-banner'));
    const footer = fixture.debugElement.query(By.css('app-footer'));

    expect(navbar).toBeTruthy();
    expect(hero).toBeTruthy();
    expect(simulator).toBeTruthy();
    expect(features).toBeTruthy();
    expect(showcase).toBeTruthy();
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
      expect(inputEl.nativeElement.getAttribute('placeholder')).toContain('Wi-Fi');
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
});
