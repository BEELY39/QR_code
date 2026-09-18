import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoFormComponent as LogoForm } from './logo-form.component';

describe('LogoForm', () => {
  let component: LogoForm;
  let fixture: ComponentFixture<LogoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

