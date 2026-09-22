import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../home/ui/navbar/navbar.component';
import { FooterComponent } from '../../home/ui/footer/footer.component';
import { SeoService } from '../../../core/services/seo.service';
import { SITE_URL } from '../../../core/constants/site.constant';
import { FaqItem } from '../../../core/models/faq.model';

/** Étape illustrée du tutoriel de création */
interface WifiStep {
  readonly number: string;
  readonly icon: string;
  readonly title: string;
  readonly text: string;
}

/** Format d'impression recommandé pour un chevalet ou une étiquette */
interface PrintFormat {
  readonly format: string;
  readonly usage: string;
  readonly qrSize: string;
}

@Component({
  selector: 'app-qr-code-wifi',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './qr-code-wifi.component.html',
})
export class QrCodeWifiComponent {
  protected readonly steps: readonly WifiStep[] = [
    {
      number: '1',
      icon: 'router',
      title: 'Recopiez le nom du réseau (SSID)',
      text: "Exactement comme il apparaît sur l'étiquette de votre box : majuscules, tirets et chiffres compris. « Freebox-A1B2 » et « freebox-a1b2 » sont deux réseaux différents pour un téléphone.",
    },
    {
      number: '2',
      icon: 'lock',
      title: 'Choisissez le type de sécurité',
      text: "WPA / WPA2 / WPA3 pour toutes les box récentes, WEP pour du matériel ancien, « Réseau ouvert » si aucun mot de passe n'est demandé. En cas de doute, gardez WPA : c'est la valeur que les appareils photo iPhone et Android comprennent.",
    },
    {
      number: '3',
      icon: 'key',
      title: 'Saisissez la clé, puis téléchargez',
      text: "Le mot de passe est sensible à la casse. Un aperçu du QR code apparaît immédiatement : choisissez vos couleurs, ajoutez un bandeau « Wi-Fi gratuit », puis exportez en SVG pour l'impression ou en PNG pour l'écran.",
    },
  ];

  protected readonly printFormats: readonly PrintFormat[] = [
    { format: 'A6 (10,5 × 14,8 cm)', usage: 'Chevalet de table, comptoir', qrSize: '5 à 6 cm' },
    { format: 'A5 (14,8 × 21 cm)', usage: 'Affichette murale, vitrine', qrSize: '8 à 10 cm' },
    { format: 'Étiquette 5 × 5 cm', usage: 'Collée sur la box ou la borne', qrSize: '3 cm minimum' },
    { format: 'A4 (21 × 29,7 cm)', usage: 'Hall, salle d\'attente, gîte', qrSize: '12 à 15 cm' },
  ];

  protected readonly faqs: readonly FaqItem[] = [
    {
      id: 'wifi-faq-serveur',
      question: 'Mon mot de passe Wi-Fi est-il envoyé sur vos serveurs ?',
      answer:
        "Non. Le QR code est calculé dans votre navigateur, en JavaScript. Le nom du réseau et le mot de passe ne sont ni transmis, ni enregistrés, ni journalisés par QRCraft. Vous pouvez couper votre connexion après le chargement de la page : le générateur continue de fonctionner.",
      category: 'securite',
    },
    {
      id: 'wifi-faq-expire',
      question: 'Est-ce que le QR code Wi-Fi expire ?',
      answer:
        "Non. Il s'agit d'un QR code statique : les informations du réseau sont inscrites directement dans le dessin du code, sans passer par un lien de redirection. Il n'y a ni abonnement, ni compte, ni serveur qui pourrait cesser de répondre. Il reste valable tant que vous ne changez pas le mot de passe du réseau.",
      category: 'perennite',
    },
    {
      id: 'wifi-faq-iphone',
      question: "Pourquoi mon iPhone refuse-t-il de rejoindre le réseau ?",
      answer:
        "Trois causes classiques : le nom du réseau n'est pas écrit à l'identique (la casse compte), le mot de passe comporte une espace invisible en fin de saisie, ou la box est configurée en WPA3 strict. Vérifiez aussi que le QR code imprimé conserve une marge blanche autour du motif : sans elle, l'appareil photo ne le détecte pas.",
      category: 'technique',
    },
    {
      id: 'wifi-faq-invite',
      question: 'Faut-il utiliser le réseau principal ou le réseau invité ?',
      answer:
        "Le réseau invité, systématiquement, dès que le QR code est affiché en public. Toute personne capable de photographier le code obtient le mot de passe en clair. Un réseau invité isole vos ordinateurs, votre caisse et votre NAS du trafic des clients, et vous pouvez en changer la clé sans reconfigurer vos appareils.",
      category: 'securite',
    },
  ];

  constructor() {
    const seo = inject(SeoService);

    seo.updatePageSeo({
      title: 'Générateur de QR code Wi-Fi gratuit — connexion sans mot de passe | QRCraft',
      description:
        "Créez un QR code Wi-Fi gratuit à imprimer pour votre café, restaurant, gîte ou bureau. Vos clients se connectent sans taper le mot de passe. Sans inscription, export SVG et PNG, généré dans votre navigateur.",
      canonicalUrl: `${SITE_URL}/qr-code-wifi/`,
      keywords: [
        'qr code wifi',
        'générateur qr code wifi gratuit',
        'qr code wifi restaurant',
        'qr code wifi à imprimer',
        'partager wifi sans mot de passe',
        'chevalet wifi',
      ],
      ogImage: `${SITE_URL}/og-image.jpg`,
      robots: 'index, follow',
    });

    seo.updateFaqSchema(this.faqs);
  }
}
