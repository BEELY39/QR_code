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

  it('devrait supprimer le logo et émettre null', () => {
    let emittedLogo: string | null = 'initial';
    component.logoChange.subscribe((logo) => {
      emittedLogo = logo;
    });

    component.removeLogo();
    expect(component.currentLogo()).toBeNull();
    expect(emittedLogo).toBeNull();
  });

  it('devrait activer l\'état isDragging sur onDragOver et le désactiver sur onDragLeave', () => {
    const fakeEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
    } as DragEvent;

    component.onDragOver(fakeEvent);
    expect(component.isDragging()).toBe(true);

    component.onDragLeave(fakeEvent);
    expect(component.isDragging()).toBe(false);
  });
});

