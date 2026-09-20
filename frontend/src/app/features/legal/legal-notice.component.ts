import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../home/ui/navbar/navbar.component';
import { FooterComponent } from '../home/ui/footer/footer.component';

interface LegalIdentity {
  readonly editorName: string;
  readonly legalForm: string;
  readonly address: string;
  readonly siret: string;
  readonly siren: string;
  readonly ape: string;
  readonly vat: string;
  readonly email: string;
  readonly phone: string;
  readonly publicationDirector: string;
  readonly hostName: string;
  readonly hostAddress: string;
  readonly hostContact: string;
}

/**
 * Informations légales réelles de l'éditeur (DN Service / Daniel MOURANA)
 * et de l'hébergeur (Netlify, Inc.) conformément à l'art. 6-III de la LCEN.
 */
const LEGAL_IDENTITY: LegalIdentity = {
  editorName: 'DN Service — Daniel MOURANA',
  legalForm: 'Entrepreneur individuel (Micro-entreprise)',
  address: '77 Rue des Salines, 39000 Lons-le-Saunier, France',
  siret: '930 007 836 00016',
  siren: '930 007 836',
  ape: '62.01Z — Programmation informatique',
  vat: 'Franchise en base de TVA (art. 293 B du CGI — TVA non applicable)',
  email: 'dn.services.web@gmail.com',
  phone: '07 68 09 11 49',
  publicationDirector: 'Daniel MOURANA',
  hostName: 'Netlify, Inc.',
  hostAddress: '44 Montgomery Street, Suite 300, San Francisco, CA 94104, USA',
  hostContact: 'https://www.netlify.com',
};

interface LegalSection {
  id: string;
  icon: string;
  title: string;
}

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.css',
})
export class LegalNoticeComponent {
  protected readonly identity = LEGAL_IDENTITY;
  protected readonly lastUpdate = '20 septembre 2026';

  protected readonly sections: LegalSection[] = [
    { id: 'editeur', icon: 'badge', title: 'Éditeur du site' },
    { id: 'publication', icon: 'edit_note', title: 'Directeur de la publication' },
    { id: 'hebergement', icon: 'dns', title: 'Hébergement' },
    { id: 'propriete', icon: 'copyright', title: 'Propriété intellectuelle' },
    { id: 'donnees', icon: 'shield_lock', title: 'Données personnelles' },
    { id: 'cookies', icon: 'cookie', title: 'Cookies & services tiers' },
    { id: 'responsabilite', icon: 'balance', title: 'Responsabilité' },
    { id: 'droit', icon: 'gavel', title: 'Droit applicable & contact' },
  ];

  constructor() {
    // Compense la navbar fixe (h-20) lors du scroll vers une ancre du sommaire.
    inject(ViewportScroller).setOffset([0, 112]);
  }
}
export { LegalNoticeComponent as LegalNotice };
