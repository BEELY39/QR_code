import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ArticlesComponent } from './articles.component';
import { SeoService } from '../../core/services/seo.service';
import { ARTICLE_GUIDES } from '../../core/constants/articles.constant';

describe('ArticlesComponent', () => {
  let component: ArticlesComponent;
  let fixture: ComponentFixture<ArticlesComponent>;
  let seoService: SeoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    seoService = TestBed.inject(SeoService);
    vi.spyOn(seoService, 'updatePageSeo');

    fixture = TestBed.createComponent(ArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and configure SEO metadata on init', () => {
    expect(component).toBeTruthy();
    expect(seoService.updatePageSeo).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Articles & Guides Pratiques'),
        canonicalUrl: expect.stringContaining('/articles'),
      })
    );
  });

  it('should render all 3 guide cards', () => {
    expect(component.articles().length).toBe(3);
    const articles = fixture.nativeElement.querySelectorAll('article');
    expect(articles.length).toBe(3);
  });

  it('should have the first guide expanded by default', () => {
    expect(component.isExpanded('guide-wifi')).toBe(true);
    const wifiArticle = fixture.nativeElement.querySelector('#guide-wifi');
    expect(wifiArticle.textContent).toContain('Checklist de validation');
  });

  it('should toggle guide expansion on click', () => {
    // Collapse guide-wifi
    component.toggleGuide('guide-wifi');
    expect(component.isExpanded('guide-wifi')).toBe(false);

    // Expand guide-impression-svg
    component.toggleGuide('guide-impression-svg');
    expect(component.isExpanded('guide-impression-svg')).toBe(true);

    fixture.detectChanges();
    const impressionArticle = fixture.nativeElement.querySelector('#guide-impression-svg');
    expect(impressionArticle.textContent).toContain('La différence fondamentale entre vecteur et pixel');
  });
});
