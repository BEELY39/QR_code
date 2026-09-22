import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../home/ui/navbar/navbar.component';
import { FooterComponent } from '../../home/ui/footer/footer.component';
import { SeoService } from '../../../core/services/seo.service';
import { SITE_URL } from '../../../core/constants/site.constant';

/**
 * Politique de confidentialité.
 * Page distincte des mentions légales : c'est elle que cherchent les
 * utilisateurs (et les annuaires d'outils) pour savoir où passent les données.
 */
@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './privacy.component.html',
})
export class PrivacyComponent {
  protected readonly lastUpdate = '22 septembre 2026';
  protected readonly contactEmail = 'dn.services.web@gmail.com';

  constructor() {
    inject(SeoService).updatePageSeo({
      title: 'Confidentialité — vos données ne quittent pas votre navigateur | QRCraft',
      description:
        "Politique de confidentialité de QRCraft : les QR codes sont générés localement dans votre navigateur, sans compte, sans cookie publicitaire et sans envoi de vos contenus sur un serveur.",
      canonicalUrl: `${SITE_URL}/confidentialite/`,
      keywords: ['confidentialité qr code', 'qr code sans cookie', 'générateur qr code rgpd'],
      robots: 'index, follow',
    });
  }
}
