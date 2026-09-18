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
});
