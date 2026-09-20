import { ArticleGuide } from '../models/article.model';

export const ARTICLE_GUIDES: readonly ArticleGuide[] = [
  {
    id: 'guide-wifi',
    slug: 'guide-qr-code-wifi-restaurant-commerce',
    title: 'QR Code Wi-Fi pour Restaurants & Commerces : Connecter ses clients en 1 seconde',
    summary:
      'Fini la dictée interminable des clés WPA complexes à 24 caractères. Apprenez à déployer un QR Code Wi-Fi sur vos tables, comptoirs et livrets d’accueil pour fluidifier l’expérience client.',
    readingTime: '3 min de lecture',
    targetAudience: 'Restaurateurs, Cafés, Hôtellerie & Gîtes, Salons de coiffure',
    category: 'Pratique & Business',
    iconName: 'wifi_tethering',
    sections: [
      {
        title: 'Pourquoi abandonner la clé Wi-Fi manuscrite sur ardoise ?',
        content:
          'Recopier une clé Wi-Fi génère des erreurs de frappe récurrentes, sollicite inutilement votre personnel en plein rush et expose votre mot de passe à des regards indiscrets. Le QR Code Wi-Fi encapsule les identifiants de manière standardisée et déclenche la connexion d’un seul tap sur smartphone.',
      },
      {
        title: 'Comment configurer et imprimer votre QR Code Wi-Fi ?',
        content:
          '1. Sélectionnez l’onglet « Réseau Wi-Fi » dans le générateur QRCraft.\n2. Renseignez le nom exact de votre réseau (SSID) et votre clé de sécurité.\n3. Téléchargez le QR code en format vectoriel SVG pour l’imprimer sur vos chevalets de table, menus ou sous-bocks avec un contraste optimal.',
      },
      {
        title: 'Sécurité et bonnes pratiques réseau',
        content:
          'Isolez toujours vos clients sur un réseau invité (« Guest ») distinct de votre réseau de caisse ou de gestion pour garantir l’intégrité de vos transactions professionnelles.',
      },
    ],
    checklist: [
      'Nom du réseau (SSID) orthographié à l’identique (respect des majuscules)',
      'Sélection du chiffrement WPA/WPA2 standard',
      'Test préalable avec un iPhone et un smartphone Android avant impression finale',
      'Contraste suffisant : motif foncé sur fond blanc ou très clair',
    ],
  },
  {
    id: 'guide-impression-svg',
    slug: 'guide-impression-svg-vs-png-haute-definition',
    title: 'Impression Haute Résolution : Pourquoi le format SVG est indispensable',
    summary:
      'Évitez le piège des QR codes flous qui refusent de scanner à l’impression. Comprendre la différence capitale entre le format vectoriel SVG et le format matriciel PNG pour vos supports physiques.',
    readingTime: '4 min de lecture',
    targetAudience: 'Graphistes, Agences, Entreprises, Imprimeurs',
    category: 'Technique & PAO',
    iconName: 'print',
    sections: [
      {
        title: 'La différence fondamentale entre vecteur et pixel',
        content:
          'Une image matricielle (PNG, JPG) est composée d’une grille fixe de pixels. Si vous l’agrandissez pour une affiche, un roll-up ou une vitrophanie, les bords deviennent flous et crénelés. Le format SVG est une formule géométrique mathématique : il conserve une netteté absolue à n’importe quelle échelle, de 2 cm à 10 mètres de haut.',
      },
      {
        title: 'La zone de silence (Quiet Zone) : le détail qui sauve vos scans',
        content:
          'Un QR code a impérativement besoin d’une marge blanche neutre tout autour de son cadre extérieur (équivalente à 4 modules de largeur). Si un visuel, un texte ou le bord du flyer touche les coins du QR code, l’appareil photo ne parviendra pas à délimiter les repères de positionnement.',
      },
      {
        title: 'Recommandations pour l’imprimeur',
        content:
          'Fournissez toujours le fichier SVG brut à votre imprimeur ou intégrez-le directement dans votre maquette Adobe Illustrator / InDesign sans rasterisation pour préserver les tracés vectoriels parfaits.',
      },
    ],
    checklist: [
      'Télécharger le fichier au format SVG pour tout support physique',
      'Respecter une taille minimale de 2 x 2 cm pour une lecture à bout de bras',
      'Garder une zone de silence neutre tout autour du code',
      'Vérifier le contraste en lumière réelle avant tirage en série',
    ],
  },
  {
    id: 'guide-anti-piege-expiration',
    slug: 'eviter-le-piege-qr-code-expiration-abonnement',
    title: 'Le piège des QR Codes payants qui expirent : Statique vs Dynamique',
    summary:
      'Attention aux mauvaises surprises après avoir imprimé 5 000 flyers. Découvrez comment fonctionnent les arnaques aux faux QR codes gratuits et comment QRCraft vous en protège.',
    readingTime: '3 min de lecture',
    targetAudience: 'Commerçants, Artisans, Événementiel, Créateurs de projet',
    category: 'Décryptage & Conseils',
    iconName: 'verified_user',
    sections: [
      {
        title: 'L’arnaque classique des 14 jours d’essai',
        content:
          'De nombreux sites en tête des résultats Google vous proposent de créer un QR code « gratuitement ». En réalité, ils encodent une URL de redirection appartenant à leurs serveurs. Après 14 jours, vos scans sont redirigés vers une page d’erreur exigeant un abonnement de 15€ à 40€ par mois pour réactiver vos codes déjà imprimés.',
      },
      {
        title: 'La garantie du QR Code Statique QRCraft',
        content:
          'QRCraft produit exclusivement des QR codes statiques purs. Votre lien URL de destination finale est gravé directement dans la matrice du QR code. Aucun serveur relais, aucun intermédiaire, aucun compte : le code appartient à 100% à son créateur et ne peut être coupé.',
      },
      {
        title: 'Quand avez-vous vraiment besoin d’un QR code dynamique ?',
        content:
          'Le QR code dynamique ne se justifie que si vous souhaitez changer l’URL cible après impression sans réimprimer le support physique. Pour 95% des besoins (carte de visite, Wi-Fi, menu fixe, page Instagram, lien de paiement), le QR code statique est le choix le plus sain, le plus économique et le plus pérenne.',
      },
    ],
    checklist: [
      'Privilégier le QR code statique pour toute impression définitive',
      'Vérifier que le lien cible commence bien par https://',
      'Tester le lien de destination dans votre navigateur avant de générer le QR code',
      'Conserver le fichier SVG source dans vos archives projet',
    ],
  },
];
