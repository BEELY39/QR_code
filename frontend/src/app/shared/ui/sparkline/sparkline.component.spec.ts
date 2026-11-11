import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SparklineComponent } from './sparkline.component';

describe('SparklineComponent', () => {
  let fixture: ComponentFixture<SparklineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SparklineComponent] }).compileComponents();
    fixture = TestBed.createComponent(SparklineComponent);
    fixture.componentRef.setInput('points', [0, 10]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('calcule le tracé de la ligne depuis la série', () => {
    const line: SVGPathElement = fixture.nativeElement.querySelectorAll('path')[1];
    expect(line.getAttribute('d')).toBe('M0 56 L194 0');
  });

  it('est masquée aux lecteurs d\'écran', () => {
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });
});
