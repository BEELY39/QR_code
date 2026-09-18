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
});



