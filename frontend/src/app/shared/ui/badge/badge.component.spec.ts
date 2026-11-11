import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent, QcBadgeVariant } from './badge.component';

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BadgeComponent] }).compileComponents();
    fixture = TestBed.createComponent(BadgeComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it.each<[QcBadgeVariant, string]>([
    ['success', 'bg-qc-success-bg'],
    ['neutral', 'bg-qc-neutral-bg'],
    ['accent', 'bg-qc-accent'],
    ['warning', 'bg-qc-warning-bg'],
    ['success-on-dark', 'bg-qc-live/12'],
  ])('la variante %s porte la classe %s', (variant, expected) => {
    fixture.componentRef.setInput('variant', variant);
    fixture.detectChanges();
    const badge: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(badge.classList).toContain(expected);
  });
});
