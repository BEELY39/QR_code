import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CardComponent] }).compileComponents();
    fixture = TestBed.createComponent(CardComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('applique les classes de tokens de la variante claire par défaut', () => {
    const box: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(box.classList).toContain('bg-white');
    expect(box.classList).toContain('rounded-qc-card-lg');
    expect(box.classList).toContain('p-7');
  });

  it('bascule sur la variante sombre et le rayon panneau', () => {
    fixture.componentRef.setInput('tone', 'dark');
    fixture.componentRef.setInput('radius', 'panel');
    fixture.detectChanges();
    const box: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(box.classList).toContain('bg-qc-ink-2');
    expect(box.classList).toContain('rounded-qc-panel');
  });
});
