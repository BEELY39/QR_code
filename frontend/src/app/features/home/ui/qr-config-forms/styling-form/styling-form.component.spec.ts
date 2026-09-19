import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylingFormComponent as StylingForm } from './styling-form.component';

describe('StylingForm', () => {
  let component: StylingForm;
  let fixture: ComponentFixture<StylingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylingForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StylingForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait émettre le style sélectionné lors de l\'appel à selectDotStyle', () => {
    let emittedStyle: string | undefined;
    component.styleChange.subscribe((style) => {
      emittedStyle = style;
    });

    component.selectDotStyle('dots');
    expect(component.isSelected('dots')).toBe(true);
    expect(emittedStyle).toBe('dots');
  });

  it('devrait contenir 6 styles visuels prédéfinis', () => {
    expect(component.dotStyles.length).toBe(6);
  });
});

