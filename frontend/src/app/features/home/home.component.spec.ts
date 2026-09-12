import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';
import { QrSimulatorService } from './data-access/qr-simulator.service';

describe('HomeComponent (Catégorie 3 - Test Intégration)', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let simulatorService: QrSimulatorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    simulatorService = TestBed.inject(QrSimulatorService);
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

  it('devrait synchroniser les changements du simulateur vers le service', () => {
    const simulatorDebugEl = fixture.debugElement.query(By.css('app-simulator-section'));

    // Test emission urlChange
    simulatorDebugEl.triggerEventHandler('urlChange', 'https://palace-le-meurice.com/room-service');
    fixture.detectChanges();
    expect(simulatorService.url()).toBe('https://palace-le-meurice.com/room-service');
    expect(simulatorService.displayUrl()).toBe('palace-le-meurice.com/room-service');

    // Test emission paletteSelect
    simulatorDebugEl.triggerEventHandler('paletteSelect', 'menthe-fraiche');
    fixture.detectChanges();
    expect(simulatorService.selectedPalette().id).toBe('menthe-fraiche');

    // Test emission bottomTextChange
    simulatorDebugEl.triggerEventHandler('bottomTextChange', 'BIENVENUE');
    fixture.detectChanges();
    expect(simulatorService.bottomText()).toBe('BIENVENUE');
  });
});

