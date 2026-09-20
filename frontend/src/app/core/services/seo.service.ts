import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoPageConfig, OpenGraphMetadata, TwitterCardMetadata } from '../models/seo.model';
import { FaqItem, SchemaFaqPage } from '../models/faq.model';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly document = inject(DOCUMENT);

  updateTitle(title: string): void {
    this.titleService.setTitle(title);
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
  }

  updateDescription(description: string): void {
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
  }

  updateKeywords(keywords: readonly string[]): void {
    if (keywords.length > 0) {
      this.metaService.updateTag({ name: 'keywords', content: keywords.join(', ') });
    }
  }

  updateCanonical(url: string): void {
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ name: 'twitter:url', content: url });

    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
    if (link) {
      link.setAttribute('href', url);
    } else {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      this.document.head.appendChild(link);
    }
  }

  updateOpenGraph(og: Partial<OpenGraphMetadata>): void {
    if (og.title) {
      this.metaService.updateTag({ property: 'og:title', content: og.title });
    }
    if (og.description) {
      this.metaService.updateTag({ property: 'og:description', content: og.description });
    }
    if (og.image) {
      this.metaService.updateTag({ property: 'og:image', content: og.image });
    }
    if (og.url) {
      this.metaService.updateTag({ property: 'og:url', content: og.url });
    }
    if (og.type) {
      this.metaService.updateTag({ property: 'og:type', content: og.type });
    }
    if (og.siteName) {
      this.metaService.updateTag({ property: 'og:site_name', content: og.siteName });
    }
    if (og.locale) {
      this.metaService.updateTag({ property: 'og:locale', content: og.locale });
    }
  }

  updateTwitterCard(tw: Partial<TwitterCardMetadata>): void {
    if (tw.card) {
      this.metaService.updateTag({ name: 'twitter:card', content: tw.card });
    }
    if (tw.title) {
      this.metaService.updateTag({ name: 'twitter:title', content: tw.title });
    }
    if (tw.description) {
      this.metaService.updateTag({ name: 'twitter:description', content: tw.description });
    }
    if (tw.image) {
      this.metaService.updateTag({ name: 'twitter:image', content: tw.image });
    }
  }

  updatePageSeo(config: SeoPageConfig): void {
    this.updateTitle(config.title);
    this.updateDescription(config.description);

    if (config.keywords) {
      this.updateKeywords(config.keywords);
    }

    if (config.canonicalUrl) {
      this.updateCanonical(config.canonicalUrl);
    }

    if (config.ogImage) {
      this.metaService.updateTag({ property: 'og:image', content: config.ogImage });
      this.metaService.updateTag({ name: 'twitter:image', content: config.ogImage });
    }

    if (config.robots) {
      this.metaService.updateTag({ name: 'robots', content: config.robots });
    }
  }

  updateFaqSchema(faqs: readonly FaqItem[]): void {
    const faqSchema: SchemaFaqPage = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question' as const,
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer' as const,
          text: f.answer,
        },
      })),
    };

    let script: HTMLScriptElement | null = this.document.querySelector('script#faq-schema-jsonld');
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'faq-schema-jsonld';
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(faqSchema);
  }
}

export { SeoService as Seo };
