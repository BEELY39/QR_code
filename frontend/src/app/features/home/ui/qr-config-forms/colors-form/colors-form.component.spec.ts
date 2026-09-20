import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorsFormComponent as ColorsForm } from './colors-form.component';

describe('ColorsForm', () => {
  let component: ColorsForm;
  let fixture: ComponentFixture<ColorsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorsForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('initialConfig', { dotsStyle: 'rounded', dotsColor: { kind: 'single', color: '#000'}, cornersColor: '#000', backgroundColor: '#fff', customLogoBase64: null, frame: { style: 'none', text: '', font: 'Roboto', frameColor: '#000', textColor: '#fff' }});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait appliquer une couleur de marque aux points', () => {
    component.applySingleDotsColor('#6750A4');
    expect(component.colorsForm.get('dotsColorSingle')?.value).toBe('#6750A4');
  });

  it('devrait basculer en mode dégradé et mettre à jour la configuration', () => {
    component.selectDotsColorType('gradient');
    expect(component.colorsForm.get('dotsColorType')?.value).toBe('gradient');

    component.selectGradientType('radial');
    expect(component.colorsForm.get('dotsGradientType')?.value).toBe('radial');
  });
});
