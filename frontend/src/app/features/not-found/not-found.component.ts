import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../home/ui/navbar/navbar.component';
import { FooterComponent } from '../home/ui/footer/footer.component';
import { SeoService } from '../../core/services/seo.service';

/**
 * Page 404 réelle.
 * Auparavant, toute URL inconnue redirigeait vers l'accueil et répondait 200 :
 * Google voyait autant de pages « fantômes » dupliquant l'accueil (soft 404).
 * Le statut HTTP 404 est fourni par la règle de rewrite Netlify.
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  constructor() {
    inject(SeoService).updatePageSeo({
      title: 'Page introuvable (404) — QRCraft',
      description: "Cette page n'existe pas ou a été déplacée.",
      robots: 'noindex, follow',
    });
  }
}
