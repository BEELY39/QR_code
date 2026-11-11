import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimulatorSectionComponent } from './simulator-section.component';
import { ColorPalette } from '../../../../core/models/palette.model';

describe('SimulatorSectionComponent (Dumb Component)', () => {
  let component: SimulatorSectionComponent;
  let fixture: ComponentFixture<SimulatorSectionComponent>;

  const mockPalette: ColorPalette = {
    id: 'violet-pop',
    name: 'Violet Pop',
    gradientClass: 'from-primary to-secondary',
    dotColor: '#412ce7',
    cornerColor: '#7a3cf5',
    badgeBg: '#5b4dff',
    badgeText: '#ffffff',
    previewGradient: { start: '#412ce7', end: '#fe5b5b' }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulatorSectionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SimulatorSectionComponent);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('url', 'https://instagram.com/monbistro');
    fixture.componentRef.setInput('palettes', [mockPalette]);
    fixture.componentRef.setInput('selectedPalette', mockPalette);
    fixture.componentRef.setInput('bottomText', 'REJOIGNEZ LA COMMUNAUTÃ‰ âœ¨');
    fixture.componentRef.setInput('displayUrl', 'instagram.com/monbistro');
    fixture.componentRef.setInput('design', { dotsStyle: 'rounded', dotsColor: { kind: 'single', color: '#000'}, cornersColor: '#000', backgroundColor: '#fff', customLogoBase64: null, frame: { style: 'none', text: '', font: 'Roboto', frameColor: '#000', textColor: '#fff' }});

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le gabarit de cadre simple-bottom avec son texte', () => {
    fixture.componentRef.setInput('qrSvgMarkup', '<svg id="test-qr"></svg>');
    fixture.componentRef.setInput('design', {
      dotsStyle: 'rounded',
      dotsColor: { kind: 'single', color: '#000' },
      cornersColor: '#000',
      backgroundColor: '#fff',
      customLogoBase64: null,
      frame: { style: 'simple-bottom', text: 'SCAN ME', font: 'Roboto', frameColor: '#000', textColor: '#fff' }
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const framedContainer = compiled.querySelector('#live-qr-framed-container');
    expect(framedContainer).toBeTruthy();
    expect(framedContainer?.textContent).toContain('SCAN ME');
  });

  it('devrait afficher le gabarit de cadre badge-bottom avec son badge détachable', () => {
    fixture.componentRef.setInput('qrSvgMarkup', '<svg id="test-qr"></svg>');
    fixture.componentRef.setInput('design', {
      dotsStyle: 'rounded',
      dotsColor: { kind: 'single', color: '#000' },
      cornersColor: '#000',
      backgroundColor: '#fff',
      customLogoBase64: null,
      frame: { style: 'badge-bottom', text: 'MENU DU JOUR', font: 'Montserrat', frameColor: '#412ce7', textColor: '#ffffff' }
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const framedContainer = compiled.querySelector('#live-qr-framed-container');
    expect(framedContainer).toBeTruthy();
    expect(framedContainer?.textContent).toContain('MENU DU JOUR');
  });

  it('ne devrait pas afficher de bandeau lorsque le cadre est none', () => {
    fixture.componentRef.setInput('qrSvgMarkup', '<svg id="test-qr"></svg>');
    fixture.componentRef.setInput('design', {
      dotsStyle: 'rounded',
      dotsColor: { kind: 'single', color: '#000' },
      cornersColor: '#000',
      backgroundColor: '#fff',
      customLogoBase64: null,
      frame: { style: 'none', text: 'IGNORED', font: 'Roboto', frameColor: '#000', textColor: '#fff' }
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const framedContainer = compiled.querySelector('#live-qr-framed-container');
    expect(framedContainer).toBeTruthy();
    expect(framedContainer?.textContent).not.toContain('IGNORED');
  });

  it('devrait émettre downloadClick lors du clic sur le bouton SVG', () => {
    let svgClicked = false;
    component.downloadClick.subscribe(() => {
      svgClicked = true;
    });

    component.onDownload();
    expect(svgClicked).toBe(true);
  });

  it('devrait émettre downloadPngClick lorsque le format sélectionné est png', () => {
    let pngClicked = false;
    component.downloadPngClick.subscribe(() => {
      pngClicked = true;
    });

    component.setFormat('png');
    expect(component.selectedFormat()).toBe('png');

    component.onDownload();
    expect(pngClicked).toBe(true);
  });

  describe("Panneau d'options avancées (catégorie 3 — intégration, FR-035)", () => {
    it('ouvre le panneau via la bascule, change la forme des points, puis ferme sans perte', () => {
      const toggle: HTMLInputElement = fixture.nativeElement.querySelector('#studio-advanced-toggle');
      expect(toggle).toBeTruthy();
      expect(toggle.checked).toBe(false);

      // Ouverture : l'onglet « Forme des points » devient accessible.
      toggle.checked = true;
      toggle.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      const styleTab: HTMLButtonElement = fixture.nativeElement.querySelector('#tab-btn-style');
      expect(styleTab).toBeTruthy();
      styleTab.click();
      fixture.detectChanges();

      // Changement de forme : le formulaire émet designChange avec la nouvelle forme.
      const emitted: unknown[] = [];
      component.designChange.subscribe((value) => emitted.push(value));
      component.onDotStyleChange('dots');
      expect(emitted.length).toBe(1);
      expect(emitted[0]).toEqual(expect.objectContaining({ dotsStyle: 'dots' }));

      // Fermeture : la bascule repasse à faux, sans rien effacer côté parent.
      toggle.checked = false;
      toggle.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(toggle.checked).toBe(false);
    });
  });
});
