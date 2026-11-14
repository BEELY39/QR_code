import { LandingContent } from '../models/landing-content.model';

/**
 * Contenu éditorial de la landing, transcrit des maquettes Main
 * (desktop et mobile). Une seule source de texte pour la page.
 */
export const LANDING_CONTENT: LandingContent = {
  nav: [
    { label: 'Studio', href: '#studio', isRoute: false },
    { label: 'Suivi des scans', href: '#tracker', isRoute: false },
    { label: "Cas d'usage", href: '#usages', isRoute: false },
    { label: 'Guides', href: '/articles', isRoute: true, id: 'nav-articles-link' },
    { label: 'FAQ', href: '#faq', isRoute: false },
  ],
  // FR-022 : tant que l'inscription et l'espace connecté n'existent pas,
  // les CTA d'authentification mènent au Studio, sans changer de libellé.
  navAuth: { label: 'Se connecter', href: '/connexion', isRoute: true, id: 'nav-auth-link' },
  navSignup: { label: 'Créer un compte', href: '/inscription', isRoute: true },

  hero: {
    badge: 'QR codes dynamiques et tracker de scans',
    badgeMobile: 'Tracker de scans',
    titleLead: 'Des QR codes à votre image.',
    titleAccent: 'Et vous savez qui les scanne.',
    lead:
      'Créez des QR codes vectoriels personnalisés gratuitement, sans inscription. Avec un compte, regroupez-les en campagnes, modifiez la destination après impression et suivez chaque scan : où, quand, sur quel appareil.',
    leadMobile:
      'Gratuit et sans inscription. Avec un compte : campagnes, destination modifiable et suivi de chaque scan.',
    primaryCta: { label: 'Créer un QR code gratuit', href: '#studio', isRoute: false },
    secondaryCta: { label: 'Suivre mes scans', href: '#studio', isRoute: false },
    guarantees: ['Sans filigrane', 'Export SVG, PNG et PDF', 'Conforme RGPD'],
    guaranteesMobile: ['Sans filigrane', 'SVG, PNG, PDF', 'RGPD'],
  },

  useCases: [
    'Restaurants',
    'Publicité & affichage',
    'Créateurs YouTube',
    'Événementiel',
    'Commerces',
    'Cartes de visite',
    'Wi-Fi invités',
  ],
  useCasesMobile: ['Restaurants', 'Créateurs YouTube', 'Affichage', 'Événementiel', 'Commerces'],

  staticVsDynamic: {
    eyebrow: 'Deux façons de travailler',
    title: 'Gratuit sans compte. Mesurable avec.',
    lead:
      "Le studio reste libre d'accès. Le compte ajoute ce qu'un QR code imprimé ne sait pas faire seul : changer de destination et rendre des comptes.",
  },
  offers: [
    {
      title: 'QR statique',
      badge: 'Sans compte',
      badgeVariant: 'neutral',
      tone: 'light',
      description:
        'Le contenu est encodé directement dans le code. Il fonctionne pour toujours, généré dans votre navigateur.',
      features: [
        'Couleurs, dégradés, formes de points, logo central',
        'Lien, texte, Wi-Fi, vCard, SMS, Instagram',
        'Export SVG, PNG HD et pack impression PDF',
        'Aucune expiration, aucun filigrane',
      ],
      cta: { label: 'Ouvrir le Studio', href: '#studio', isRoute: false },
      ctaVariant: 'outline',
    },
    {
      title: 'QR dynamique',
      badge: 'Avec compte',
      badgeVariant: 'accent',
      tone: 'dark',
      description:
        "Le code pointe vers QRCraft, qui redirige vers votre destination et enregistre le scan. Vous gardez la main après l'impression.",
      features: [
        "Destination modifiable, pause et date d'expiration",
        'Campagnes, emplacements et tags',
        'Tracker : où, quand, quel QR, quel appareil',
        'UTM automatiques, test A/B, export CSV et PDF',
      ],
      cta: { label: 'Créer un compte', href: '/inscription', isRoute: true },
      ctaVariant: 'light',
    },
  ],
  offersMobile: [
    {
      title: 'QR statique',
      badge: 'Sans compte',
      tone: 'light',
      description: 'Couleurs, logo, Wi-Fi, vCard. Export SVG, PNG et PDF. Aucune expiration.',
      cta: { label: 'Ouvrir le Studio →', href: '#studio', isRoute: false },
    },
    {
      title: 'QR dynamique',
      badge: 'Avec compte',
      tone: 'dark',
      description: 'Destination modifiable après impression, campagnes, tags et tracker de scans.',
      cta: { label: 'Créer un compte →', href: '/inscription', isRoute: true },
    },
  ],

  model: {
    eyebrow: 'Organisé comme vous',
    title: 'Un compte, des campagnes, des QR codes placés dans le monde réel.',
  },
  modelStepsMobile: ['Campagne', 'Emplacement', 'Tags'],
  modelSteps: [
    {
      index: '01',
      kicker: 'Campagne',
      title: 'Regroupez vos codes',
      description: '« Menu restaurant », « Affichage métro novembre », « Flyers salon de Lyon ».',
      tags: [],
    },
    {
      index: '02',
      kicker: 'Emplacement',
      title: 'Dites où il est posé',
      description:
        '« Table 5 », « Affiche gare Part-Dieu », « Flyer boîte aux lettres », avec adresse ou point GPS en option.',
      tags: [],
    },
    {
      index: '03',
      kicker: 'Tags',
      title: 'Filtrez librement',
      description: null,
      tags: ['terrasse', 'affiche', 'flyer', 'test-A'],
    },
  ],
  modelExamples: [
    {
      icon: 'utensils',
      tint: 'warm',
      lead: 'Un restaurateur',
      rest: ' crée une campagne avec 20 QR codes, « Table 1 » à « Table 20 ».',
    },
    {
      icon: 'billboard',
      tint: 'accent',
      lead: 'Un publicitaire',
      rest: ' crée une campagne avec 15 QR codes, un par affiche. Même système.',
    },
  ],

  tracker: {
    eyebrow: 'Tracker de scans',
    title: 'Où, quand, quel QR, quel appareil.',
    cta: { label: 'Voir le tableau de bord', href: '/inscription', isRoute: true },
  },
  trackerPillars: [
    {
      icon: 'map-pin',
      title: 'Où ?',
      description:
        "L'emplacement déclaré du QR, la ville et le pays approximatifs, et une carte des scans par affiche.",
      descriptionMobile: 'Emplacement, ville, pays',
    },
    {
      icon: 'clock',
      title: 'Quand ?',
      description:
        "Date et heure de chaque scan, courbe dans le temps, heatmap jour × heure, pic d'activité.",
      descriptionMobile: 'Matin, après-midi, soir',
    },
    {
      icon: 'bar-chart',
      title: 'Quel QR ?',
      description: "Classement des codes d'une campagne, comparaison entre campagnes ou entre tags.",
      descriptionMobile: 'Classement, comparaison',
    },
    {
      icon: 'smartphone',
      title: 'Quel appareil ?',
      description: "Système, type d'appareil, navigateur et langue du téléphone.",
      descriptionMobile: 'OS, navigateur, langue',
    },
  ],
  teaserLabel: 'Campagne',

  advertisers: {
    eyebrow: 'Pour les publicitaires',
    title: 'Prouvez ce que rapporte chaque affiche.',
    lead:
      'Comparez les affiches aux flyers, testez deux pages, et envoyez à votre client un rapport propre en un clic.',
  },
  advertiserBenefits: [
    {
      title: 'Paramètres UTM automatiques',
      titleMobile: 'UTM automatiques',
      description: 'Retrouvez les visites issues de chaque QR dans Google Analytics.',
      descriptionMobile: 'pour Google Analytics',
    },
    {
      title: 'Test A/B',
      titleMobile: 'Test A/B',
      description: "Un QR code qui envoie la moitié des scans vers la page A, l'autre vers la page B.",
      descriptionMobile: '50 % page A, 50 % page B',
    },
    {
      title: 'Destination modifiable après impression',
      titleMobile: 'Destination modifiable',
      description: "Pause, date d'expiration, redirection selon l'heure ou la langue.",
      descriptionMobile: 'pause, expiration, heure, langue',
    },
    {
      title: 'Export CSV et PDF',
      titleMobile: 'Export CSV et PDF',
      description: 'Un rapport de statistiques prêt à envoyer à un client.',
      descriptionMobile: 'pour vos clients',
    },
  ],

  creators: {
    eyebrow: 'Pour les créateurs',
    titleLead: 'Votre sponsor veut des chiffres.',
    titleAccent: 'Donnez-lui les vrais.',
    lead:
      "Affichez un QR code à l'écran pendant le placement de produit et dites à votre communauté : « scannez maintenant ». Chaque scan est compté, vidéo par vidéo.",
    leadMobile:
      "Un QR code à l'écran pendant le placement : « scannez maintenant ». Vous voyez combien de clics chaque vidéo rapporte et à quelle heure votre audience est active.",
    bullets: [
      'Combien de clics chaque vidéo rapporte à votre sponsor',
      'À quelle heure votre audience est la plus active',
      'Comparez vos vidéos : laquelle fait le plus scanner',
      'Code promo ou lien modifiable, même après publication',
      'Rapport PDF prêt à envoyer à la marque',
    ],
    tags: [
      { term: 'Campagne', definition: ' = le sponsor' },
      { term: 'QR code', definition: ' = la vidéo' },
    ],
    ctaPrimary: { label: 'Tracker mon prochain sponsor', href: '/inscription', isRoute: true },
    ctaSecondary: { label: 'Voir le tracker créateur', href: '/inscription', isRoute: true },
  },

  privacy: {
    title: 'Des statistiques, pas du pistage.',
    titleMobile: 'Des statistiques, pas du pistage.',
    lead: 'Conçu pour le RGPD dès le départ.',
    leadMobile:
      "L'IP sert à déduire la ville, puis elle est jetée. Système, navigateur, langue et heure ne permettent pas de vous identifier.",
    points: [
      "L'adresse IP sert uniquement à déduire la ville et le pays, puis elle est jetée. Jamais stockée.",
      "Système, navigateur, type d'appareil, langue et heure : aucune donnée identifiante.",
      'Les QR statiques restent générés dans votre navigateur : rien ne nous parvient.',
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Questions fréquentes',
    guides: { label: 'Lire les guides →', href: '/articles', isRoute: true },
    guidesMobile: { label: 'Toutes les questions et guides →', href: '/articles', isRoute: true },
  },

  cta: {
    eyebrow: '',
    title: "Votre prochain QR code mérite mieux qu'un carré noir.",
    lead: 'Commencez gratuitement. Créez un compte le jour où vous voulez mesurer.',
    primary: { label: 'Ouvrir le Studio', href: '#studio', isRoute: false },
    secondary: { label: 'Créer un compte', href: '/inscription', isRoute: true },
  },

  footer: {
    tagline: 'Générateur de QR codes personnalisés et tracker de scans. Gratuit, privé, permanent.',
    columns: [
      {
        title: 'Produit',
        links: [
          { label: 'Studio vectoriel', href: '#studio', isRoute: false },
          { label: 'Suivi des scans', href: '#tracker', isRoute: false },
          { label: 'Pack impression', href: '#studio', isRoute: false },
          { label: 'QR code Wi-Fi', href: '/qr-code-wifi', isRoute: true },
        ],
      },
      {
        title: 'Ressources',
        links: [
          { label: 'Guides', href: '/articles', isRoute: true },
          { label: 'FAQ', href: '#faq', isRoute: false },
          { label: 'Statique ou dynamique', href: '/qr-code-statique-vs-dynamique', isRoute: true },
          { label: 'Export SVG', href: '/qr-code-svg', isRoute: true },
        ],
      },
      {
        title: 'Légal',
        links: [
          { label: 'Mentions légales', href: '/mentions-legales', isRoute: true },
          { label: 'Confidentialité & RGPD', href: '/confidentialite', isRoute: true },
        ],
      },
    ],
    mobileLinks: [
      { label: 'Studio', href: '#studio', isRoute: false },
      { label: 'Guides', href: '/articles', isRoute: true },
      { label: 'FAQ', href: '#faq', isRoute: false },
      { label: 'Mentions légales', href: '/mentions-legales', isRoute: true, id: 'footer-legal-link' },
      { label: 'Confidentialité', href: '/confidentialite', isRoute: true },
    ],
    legal: { label: 'Mentions légales', href: '/mentions-legales', isRoute: true },
    privacyLink: { label: 'Confidentialité', href: '/confidentialite', isRoute: true },
    copyright: '© 2026 QRCraft Studio. Tous droits réservés.',
    madeIn: 'Fait en France',
  },
};
