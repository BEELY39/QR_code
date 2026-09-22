import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../home/ui/navbar/navbar.component';
import { FooterComponent } from '../../home/ui/footer/footer.component';
import { SeoService } from '../../../core/services/seo.service';
import { SITE_URL } from '../../../core/constants/site.constant';
import { FaqItem } from '../../../core/models/faq.model';

/** Ligne du tableau comparatif statique / dynamique */
interface ComparisonRow {
  readonly critere: string;
  readonly statique: string;
  readonly dynamique: string;
}

@Component({
  selector: 'app-qr-code-statique-dynamique',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './qr-code-statique-dynamique.component.html',
})
export class QrCodeStatiqueDynamiqueComponent {
  protected readonly rows: readonly ComparisonRow[] = [
    {
      critere: 'Ce que contient le code',
      statique: "L'information elle-même : lien, texte, réseau Wi-Fi",
      dynamique: "Un lien de redirection vers le serveur du prestataire",
    },
    {
      critere: 'Durée de vie',
      statique: 'Illimitée : rien ne peut cesser de répondre',
      dynamique: "Liée à l'abonnement et à la survie du service",
    },
    {
      critere: 'Modifier la destination',
      statique: 'Impossible sans regénérer le code',
      dynamique: 'Oui, à tout moment, sans réimprimer',
    },
    {
      critere: 'Statistiques de scan',
      statique: 'Aucune, sauf à mesurer côté page de destination',
      dynamique: 'Nombre de scans, date, ville, type d\'appareil',
    },
    {
      critere: 'Densité du motif',
      statique: 'Plus dense si le contenu est long',
      dynamique: 'Toujours léger (le lien est court)',
    },
    {
      critere: 'Dépendance à un tiers',
      statique: 'Aucune',
      dynamique: 'Totale : le prestataire est sur le chemin de chaque scan',
    },
    {
      critere: 'Coût',
      statique: 'Gratuit',
      dynamique: 'Souvent gratuit à la création, payant à l\'usage',
    },
  ];

  protected readonly faqs: readonly FaqItem[] = [
    {
      id: 'sd-faq-expire',
      question: 'Un QR code peut-il vraiment expirer ?',
      answer:
        "Le motif imprimé, lui, n'expire jamais : c'est du dessin. Ce qui expire, c'est le service de redirection derrière un QR code dynamique. Si l'abonnement s'arrête ou si le prestataire ferme, le lien intermédiaire ne répond plus et tous les codes imprimés deviennent inutilisables, alors que le papier n'a pas bougé.",
      category: 'perennite',
    },
    {
      id: 'sd-faq-choix',
      question: 'Quel type choisir pour un menu ou un Wi-Fi de restaurant ?',
      answer:
        "Statique. Un réseau Wi-Fi ou un lien de menu qui ne changera pas d'adresse n'a aucun besoin de redirection : le code fonctionne hors ligne, sans compte et sans échéance. Le dynamique se justifie si vous prévoyez de changer la destination après impression, ou si vous avez réellement besoin de statistiques.",
      category: 'general',
    },
    {
      id: 'sd-faq-modifier',
      question: 'Comment changer de destination sans QR code dynamique ?',
      answer:
        "En encodant une adresse que vous contrôlez : votre propre nom de domaine, par exemple monrestaurant.fr/menu. Le QR code reste statique et gratuit, mais vous restez libre de changer ce que cette page affiche, ou de la rediriger ailleurs. Vous obtenez la souplesse du dynamique sans dépendre d'un intermédiaire.",
      category: 'general',
    },
    {
      id: 'sd-faq-stats',
      question: 'Peut-on mesurer les scans d\'un QR code statique ?',
      answer:
        "Oui, indirectement, dès lors qu'il pointe vers une page web que vous maîtrisez : votre outil de statistiques compte les visites, et un paramètre dans l'adresse (par exemple ?source=chevalet) permet de distinguer les arrivées par QR code. Vous ne saurez pas combien de personnes ont scanné sans ouvrir la page, mais l'essentiel est mesuré.",
      category: 'technique',
    },
  ];

  constructor() {
    const seo = inject(SeoService);

    seo.updatePageSeo({
      title: 'QR code statique ou dynamique : lequel choisir ? | QRCraft',
      description:
        "Différences réelles entre QR code statique et dynamique : durée de vie, modification, statistiques, coût. Comment éviter qu'un code imprimé cesse de fonctionner, et changer de destination sans abonnement.",
      canonicalUrl: `${SITE_URL}/qr-code-statique-vs-dynamique/`,
      keywords: [
        'qr code statique ou dynamique',
        'différence qr code statique dynamique',
        'qr code qui expire',
        'qr code gratuit sans abonnement',
        'qr code permanent',
      ],
      ogImage: `${SITE_URL}/og-image.jpg`,
      robots: 'index, follow',
    });

    seo.updateFaqSchema(this.faqs);
  }
}
