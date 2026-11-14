import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../../shared/layout/site-header/site-header.component';
import { FooterComponent } from '../home/ui/footer/footer.component';
import { SeoService } from '../../core/services/seo.service';
import { SITE_URL } from '../../core/constants/site.constant';
import { ArticleGuide } from '../../core/models/article.model';
import { ARTICLE_GUIDES } from '../../core/constants/articles.constant';
import { selectFaqItems } from '../../core/constants/faq.constant';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteHeaderComponent, FooterComponent],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
})
export class ArticlesComponent {
  private readonly seoService = inject(SeoService);

  /** Questions retirées de l'accueil, affichées et déclarées ici (FR-038). */
  readonly faqs = selectFaqItems(['faq-expiration', 'faq-wifi', 'faq-readability']);

  /** Liste complète des fiches guides éditoriales */
  readonly articles = signal<readonly ArticleGuide[]>(ARTICLE_GUIDES);

  /** Set réactif des guides actuellement dépliés (le premier guide ouvert par défaut) */
  readonly expandedIds = signal<ReadonlySet<string>>(new Set(['guide-wifi']));

  constructor() {
    this.seoService.updatePageSeo({
      title: 'Articles & Guides Pratiques QR Code — QRCraft',
      description:
        'Guides pratiques et tutoriels QR code : configuration Wi-Fi pour commerçants, comparaison vectoriel SVG vs PNG, et conseils pour éviter les arnaques d’expiration.',
      canonicalUrl: `${SITE_URL}/articles/`,
      keywords: [
        'guide qr code',
        'tutoriel qr code wifi',
        'impression qr code svg',
        'qr code restaurant',
        'qr code statique gratuit',
      ],
    });
    this.seoService.updateFaqSchema(this.faqs);
  }

  /** Bascule l'état déplié d'une fiche guide */
  toggleGuide(id: string): void {
    this.expandedIds.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  /** Indique si une fiche guide est dépliée */
  isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }
}

export { ArticlesComponent as Articles };
