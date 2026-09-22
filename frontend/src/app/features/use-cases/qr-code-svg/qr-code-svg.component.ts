import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../home/ui/navbar/navbar.component';
import { FooterComponent } from '../../home/ui/footer/footer.component';
import { SeoService } from '../../../core/services/seo.service';
import { SITE_URL } from '../../../core/constants/site.constant';
import { FaqItem } from '../../../core/models/faq.model';

/** Ligne du tableau de comparaison des formats d'export */
interface FormatRow {
  readonly format: string;
  readonly nature: string;
  readonly usage: string;
  readonly limite: string;
}

@Component({
  selector: 'app-qr-code-svg',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './qr-code-svg.component.html',
})
export class QrCodeSvgComponent {
  protected readonly formats: readonly FormatRow[] = [
    {
      format: 'SVG',
      nature: 'Vectoriel',
      usage: 'Impression, imprimeur, grand format, gravure',
      limite: 'Peu adapté aux réseaux sociaux, qui attendent une image',
    },
    {
      format: 'PNG',
      nature: 'Matriciel (pixels)',
      usage: 'Écran, réseaux sociaux, e-mail, diaporama',
      limite: "Se pixellise dès qu'on l'agrandit au-delà de sa taille d'export",
    },
    {
      format: 'PDF',
      nature: 'Vectoriel (mise en page)',
      usage: 'Envoi direct à un imprimeur, affichette prête à poser',
      limite: "Format de document : moins pratique à réintégrer dans un visuel",
    },
    {
      format: 'JPG',
      nature: 'Matriciel compressé',
      usage: 'À éviter pour un QR code',
      limite: 'La compression crée un halo autour des points et gêne la lecture',
    },
  ];

  protected readonly faqs: readonly FaqItem[] = [
    {
      id: 'svg-faq-difference',
      question: 'Quelle différence concrète entre un QR code SVG et PNG ?',
      answer:
        "Un PNG est une grille de pixels : agrandi au-delà de sa taille d'export, il devient flou et les bords des points bavent. Un SVG décrit des formes géométriques : le même fichier reste net sur une carte de visite comme sur une bâche de 3 mètres. Pour tout ce qui part à l'impression, le SVG est le bon choix.",
      category: 'technique',
    },
    {
      id: 'svg-faq-ouvrir',
      question: 'Avec quoi ouvrir un fichier SVG ?',
      answer:
        "N'importe quel navigateur l'affiche par simple glisser-déposer. Pour le modifier ou l'intégrer à une mise en page : Illustrator, Inkscape (gratuit), Affinity Designer, Figma, Canva ou InDesign l'importent tous directement. Votre imprimeur, lui, le préfèrera à tout autre format.",
      category: 'technique',
    },
    {
      id: 'svg-faq-couleurs',
      question: 'Les dégradés et le logo sont-ils conservés en SVG ?',
      answer:
        "Oui. Les dégradés sont exportés comme dégradés vectoriels, et le logo central est intégré au fichier. Attention toutefois pour un imprimeur professionnel : un aplat de couleur unie passe mieux en quadrichromie qu'un dégradé clair, et le contraste entre les points et le fond reste le facteur déterminant pour la lecture.",
      category: 'technique',
    },
    {
      id: 'svg-faq-taille',
      question: 'Quelle taille d\'impression minimale pour rester lisible ?',
      answer:
        "Comptez 2 cm de côté minimum pour une lecture à bout de bras, et gardez le rapport « largeur du code ≈ un dixième de la distance de scan » : 3 cm pour 30 cm, 15 cm pour une vitrine lue depuis le trottoir. Conservez toujours la marge blanche autour du motif, quelle que soit la taille.",
      category: 'technique',
    },
  ];

  constructor() {
    const seo = inject(SeoService);

    seo.updatePageSeo({
      title: 'Générateur de QR code SVG gratuit — vectoriel pour l\'impression | QRCraft',
      description:
        "Téléchargez votre QR code en SVG vectoriel : net à toutes les tailles, de la carte de visite à l'affiche grand format. Gratuit, sans inscription, avec dégradés et logo conservés.",
      canonicalUrl: `${SITE_URL}/qr-code-svg/`,
      keywords: [
        'qr code svg',
        'générateur qr code svg gratuit',
        'qr code vectoriel',
        'qr code haute résolution impression',
        'qr code svg ou png',
      ],
      ogImage: `${SITE_URL}/og-image.jpg`,
      robots: 'index, follow',
    });

    seo.updateFaqSchema(this.faqs);
  }
}
