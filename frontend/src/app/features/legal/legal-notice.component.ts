import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../home/ui/navbar/navbar.component';
import { FooterComponent } from '../home/ui/footer/footer.component';

/**
 * Informations légales de l'éditeur et de l'hébergeur (art. 6-III LCEN).
 * Les valeurs entre crochets sont à remplacer par les informations réelles.
 */
const LEGAL_IDENTITY = {
  editorName: '[Nom / Raison sociale]',
  legalForm: '[Forme juridique — ex. Entreprise individuelle, SAS]',
  address: '[Adresse postale complète]',
  siret: '[Numéro SIRET]',
  email: '[contact@votre-domaine.fr]',
  phone: '[Numéro de téléphone]',
  publicationDirector: '[Nom du directeur de la publication]',
  hostName: '[Nom de l’hébergeur]',
  hostAddress: '[Adresse de l’hébergeur]',
  hostContact: '[Site web ou téléphone de l’hébergeur]',
} as const;

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
  protected readonly lastUpdate = '14 septembre 2026';

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
