import { TestBed } from '@angular/core/testing';
import { QrSimulatorService } from './qr-simulator.service';

describe('QrSimulatorService (Catégorie 2 - Test Unitaire)', () => {
  let service: QrSimulatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QrSimulatorService]
    });
    service = TestBed.inject(QrSimulatorService);
  });

  it('devrait être initialisé correctement', () => {
    expect(service).toBeTruthy();
  });

  it('devrait avoir des valeurs initiales conformes à la maquette', () => {
    expect(service.url()).toBe('https://instagram.com/monbistro');
    expect(service.selectedPaletteId()).toBe('violet-pop');
    expect(service.bottomText()).toBe('REJOIGNEZ LA COMMUNAUTÉ ✨');
    expect(service.displayUrl()).toBe('instagram.com/monbistro');
  });

  it('devrait contenir les 4 palettes de couleurs obligatoires', () => {
    const palettes = service.palettes();
    expect(palettes.length).toBe(4);
    const ids = palettes.map(p => p.id);
    expect(ids).toContain('violet-pop');
    expect(ids).toContain('menthe-fraiche');
    expect(ids).toContain('sunset-coral');
    expect(ids).toContain('cyan-electrique');
  });

  it('devrait mettre à jour l\'URL et recalculer l\'URL d\'affichage', () => {
    service.setUrl('https://hotel-luxe.com/menu');
    expect(service.url()).toBe('https://hotel-luxe.com/menu');
    expect(service.displayUrl()).toBe('hotel-luxe.com/menu');
  });

  it('devrait permettre de changer la palette active', () => {
    service.selectPalette('menthe-fraiche');
    expect(service.selectedPaletteId()).toBe('menthe-fraiche');
    expect(service.selectedPalette().name).toBe('Menthe Fraîche');
  });

  it('devrait mettre à jour le libellé du bandeau inférieur', () => {
    service.setBottomText('CARTE DES VINS & TAPAS 🍷');
    expect(service.bottomText()).toBe('CARTE DES VINS & TAPAS 🍷');
  });
});
