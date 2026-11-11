import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardTeaserComponent } from './dashboard-teaser.component';

describe('DashboardTeaserComponent (catégorie 3 — intégration)', () => {
  let fixture: ComponentFixture<DashboardTeaserComponent>;
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    fetchSpy = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal('fetch', fetchSpy);
    await TestBed.configureTestingModule({ imports: [DashboardTeaserComponent] }).compileComponents();
    fixture = TestBed.createComponent(DashboardTeaserComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const tabs = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];

  it('marque la plage active et met à jour aria-selected au clic', () => {
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
    tabs()[1].click();
    fixture.detectChanges();
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs()[0].getAttribute('aria-selected')).toBe('false');
    expect(fixture.componentInstance.selectedRange()).toBe(1);
  });

  it('n\'émet aucune requête réseau au changement de plage', () => {
    tabs()[2].click();
    fixture.detectChanges();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('reste marqué comme données d\'exemple', () => {
    expect(fixture.nativeElement.textContent).toContain("Données d'exemple");
  });
});
