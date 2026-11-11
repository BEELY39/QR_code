import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SegmentedComponent } from './segmented.component';

/**
 * Hôte de test : le composant n'a pas d'état interne, c'est le parent qui
 * tient `activeIndex`. On teste donc le couple hôte + segmented, comme dans
 * l'usage réel.
 */
@Component({
  imports: [SegmentedComponent],
  template: `<qc-segmented [options]="options" [activeIndex]="active()" (selected)="active.set($event)" />`,
})
class HostComponent {
  readonly options = ['7 j', '30 j', 'Tout'];
  readonly active = signal(0);
}

describe('SegmentedComponent (catégorie 3 — intégration)', () => {
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  const tabs = (): HTMLButtonElement[] =>
    fixture.debugElement.queryAll(By.css('[role="tab"]')).map((d) => d.nativeElement as HTMLButtonElement);

  it('émet l\'index de l\'option cliquée', () => {
    tabs()[2].click();
    fixture.detectChanges();
    expect(host.active()).toBe(2);
  });

  it('ne marque qu\'une seule option comme sélectionnée', () => {
    tabs()[1].click();
    fixture.detectChanges();
    const selected = tabs().filter((t) => t.getAttribute('aria-selected') === 'true');
    expect(selected.length).toBe(1);
    expect(selected[0].textContent?.trim()).toBe('30 j');
  });

  it('ne prend qu\'un seul arrêt de tabulation', () => {
    const stops = tabs().filter((t) => t.tabIndex === 0);
    expect(stops.length).toBe(1);
  });

  it('se parcourt aux flèches et revient au début après la fin', () => {
    const track = fixture.debugElement.query(By.css('[role="tablist"]'));
    track.triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(host.active()).toBe(1);

    host.active.set(2);
    fixture.detectChanges();
    track.triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(host.active()).toBe(0);
  });
});
