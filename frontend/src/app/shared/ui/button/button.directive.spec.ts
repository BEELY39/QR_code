import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonDirective } from './button.directive';

@Component({
  imports: [ButtonDirective],
  template: `
    <button id="primary" qcButton>Primaire</button>
    <button id="dark" qcButton="dark" qcSize="md">Sombre</button>
    <a id="outline" href="#studio" qcButton="outline" qcBlock>Contour</a>
  `,
})
class HostComponent {}

describe('ButtonDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  const el = (id: string): HTMLElement => fixture.nativeElement.querySelector('#' + id);

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('attribut nu : variante primaire par défaut', () => {
    expect(el('primary').classList).toContain('bg-qc-accent');
    expect(el('primary').classList).toContain('h-13');
  });

  it('applique la variante et la taille demandées', () => {
    expect(el('dark').classList).toContain('bg-qc-ink');
    expect(el('dark').classList).toContain('h-11');
  });

  it('pose la largeur pleine sur demande, sur un lien natif', () => {
    expect(el('outline').tagName).toBe('A');
    expect(el('outline').classList).toContain('border-qc-text');
    expect(el('outline').classList).toContain('w-full');
  });
});
