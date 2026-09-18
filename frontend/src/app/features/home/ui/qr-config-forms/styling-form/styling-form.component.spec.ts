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
});

