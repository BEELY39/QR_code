import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpiTileComponent } from './kpi-tile.component';

describe('KpiTileComponent', () => {
  let fixture: ComponentFixture<KpiTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [KpiTileComponent] }).compileComponents();
    fixture = TestBed.createComponent(KpiTileComponent);
    fixture.componentRef.setInput('label', 'Scans');
    fixture.componentRef.setInput('value', '4 912');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('affiche le libellé et la valeur formatée', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Scans');
    expect(text).toContain('4 912');
  });

  it('n\'affiche pas de badge de variation quand delta est nul', () => {
    expect(fixture.nativeElement.querySelector('span.rounded-qc-pill')).toBeNull();
  });

  it('affiche le badge de variation quand delta est fourni', () => {
    fixture.componentRef.setInput('delta', '+12 %');
    fixture.componentRef.setInput('deltaVariant', 'success');
    fixture.detectChanges();
    const badge: HTMLElement = fixture.nativeElement.querySelector('span.rounded-qc-pill');
    expect(badge.textContent?.trim()).toBe('+12 %');
    expect(badge.classList).toContain('bg-qc-success-bg');
  });
});
