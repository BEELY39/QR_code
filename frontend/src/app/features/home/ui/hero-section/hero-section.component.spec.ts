import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroSectionComponent } from './hero-section.component';

describe('HeroSectionComponent', () => {
  let fixture: ComponentFixture<HeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HeroSectionComponent] }).compileComponents();
    fixture = TestBed.createComponent(HeroSectionComponent);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('affiche le titre de la maquette en H1', () => {
    const h1: HTMLHeadingElement = fixture.nativeElement.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1.textContent?.replace(/\s+/g, ' ').trim()).toContain('Des QR codes à votre image.');
    expect(h1.textContent).toContain('Et vous savez qui les scanne.');
  });

  it('marque le visuel comme données d\'exemple', () => {
    expect(fixture.nativeElement.textContent).toContain("Données d'exemple");
  });

  it('expose les trois garanties de la maquette desktop', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Sans filigrane');
    expect(text).toContain('Export SVG, PNG et PDF');
    expect(text).toContain('Conforme RGPD');
  });

  it('dirige les deux CTA vers le Studio, sans destination inerte', () => {
    const anchors: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a'));
    const ctas = anchors.filter((a) => a.textContent?.includes('gratuit') || a.textContent?.includes('Suivre'));
    expect(ctas.length).toBe(2);
    ctas.forEach((a) => expect(a.getAttribute('href')).toBe('#studio'));
  });
});
