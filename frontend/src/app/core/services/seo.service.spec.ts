import { TestBed } from '@angular/core/testing';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from './seo.service';
import { SeoPageConfig } from '../models/seo.model';

describe('SeoService', () => {
  let service: SeoService;
  let titleService: Title;
  let metaService: Meta;
  let doc: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeoService, Title, Meta],
    });
    service = TestBed.inject(SeoService);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
    doc = TestBed.inject(DOCUMENT);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update title and open graph/twitter title tags', () => {
    const testTitle = 'Test Titre SEO';
    service.updateTitle(testTitle);

    expect(titleService.getTitle()).toBe(testTitle);
    const ogTitle = metaService.getTag("property='og:title'");
    expect(ogTitle?.content).toBe(testTitle);
    const twTitle = metaService.getTag("name='twitter:title'");
    expect(twTitle?.content).toBe(testTitle);
  });

  it('should update description and social description tags', () => {
    const testDesc = 'Ceci est une description de test optimisée pour le référencement.';
    service.updateDescription(testDesc);

    const metaDesc = metaService.getTag("name='description'");
    expect(metaDesc?.content).toBe(testDesc);
    const ogDesc = metaService.getTag("property='og:description'");
    expect(ogDesc?.content).toBe(testDesc);
    const twDesc = metaService.getTag("name='twitter:description'");
    expect(twDesc?.content).toBe(testDesc);
  });

  it('should update keywords when provided', () => {
    service.updateKeywords(['qr code', 'personnalisé', 'couleur']);
    const metaKeywords = metaService.getTag("name='keywords'");
    expect(metaKeywords?.content).toBe('qr code, personnalisé, couleur');
  });

  it('should update or create canonical link element', () => {
    const canonicalUrl = 'https://qrcraft.netlify.app/test-page';
    service.updateCanonical(canonicalUrl);

    const link = doc.querySelector("link[rel='canonical']");
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe(canonicalUrl);

    const ogUrl = metaService.getTag("property='og:url'");
    expect(ogUrl?.content).toBe(canonicalUrl);
  });

  it('should apply full page SEO config via updatePageSeo', () => {
    const config: SeoPageConfig = {
      title: 'Page Spécifique — QRCraft',
      description: 'Description complète de la page spécifique.',
      keywords: ['mot-clé 1', 'mot-clé 2'],
      canonicalUrl: 'https://qrcraft.netlify.app/page-specifique',
      ogImage: 'https://qrcraft.netlify.app/favicon.png',
      robots: 'index, follow',
    };

    service.updatePageSeo(config);

    expect(titleService.getTitle()).toBe(config.title);
    expect(metaService.getTag("name='description'")?.content).toBe(config.description);
    expect(metaService.getTag("name='keywords'")?.content).toBe('mot-clé 1, mot-clé 2');
    expect(metaService.getTag("property='og:image'")?.content).toBe(config.ogImage);
    expect(metaService.getTag("name='robots'")?.content).toBe('index, follow');
  });
});
