import { FaqItem } from '../models/faq.model';

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: 'faq-free',
    question: 'QRCraft est-il réellement 100% gratuit et sans abonnement caché ?',
    answer:
      'Oui, absolument. QRCraft est un outil web libre, gratuit et sans carte bancaire requise. Contrairement à de nombreuses plateformes qui bloquent vos QR codes après 14 jours d’essai pour vous contraindre à payer un abonnement mensuel, nos QR codes sont statiques, autonomes et utilisables à vie sans aucun frais.',
    category: 'general',
    iconName: 'savings',
  },
  {
    id: 'faq-expiration',
    question: 'Les QR codes créés ont-ils une date d’expiration ?',
    answer:
      'Non, ils n’expirent jamais. Les informations (lien URL, texte, accès Wi-Fi) sont directement encodées dans le motif graphique vectoriel du QR code. Aucun serveur intermédiaire n’est sollicité lors du scan : tant que le contenu vers lequel il pointe existe, votre QR code fonctionnera éternellement.',
    category: 'perennite',
    iconName: 'all_inclusive',
  },
  {
    id: 'faq-privacy',
    question: 'Mes données saisies sont-elles enregistrées sur vos serveurs ?',
    answer:
      'Non, aucune donnée n’est transmise ni conservée sur un quelconque serveur. La génération graphique du QR code s’exécute intégralement en local dans votre navigateur web grâce à la puissance du moteur JavaScript client. Votre mot de passe Wi-Fi, vos liens et vos textes restent strictement privés.',
    category: 'securite',
    iconName: 'lock',
  },
  {
    id: 'faq-svg-png',
    question: 'Pourquoi privilégier le format SVG vectoriel pour l’impression ?',
    answer:
      'Le format SVG (Scalable Vector Graphics) est un format vectoriel mathématique qui ne pixellise jamais, quelle que soit la taille d’impression (du petit sticker de table à la bâche publicitaire de 4 mètres). Pour les imprimeurs professionnels et les logiciels de PAO (Illustrator, InDesign), le SVG garantit des contours d’une netteté chirurgicale indispensables pour un scan rapide.',
    category: 'technique',
    iconName: 'photo_size_select_large',
  },
  {
    id: 'faq-wifi',
    question: 'Comment fonctionne le QR code Wi-Fi pour mes clients ou invités ?',
    answer:
      'Le QR code Wi-Fi intègre le protocole standardisé WIFI (WPA/WPA2/WPA3). Lorsqu’un client scanne le QR code avec l’appareil photo de son smartphone (iOS ou Android), une notification système lui propose de « Rejoindre le réseau ». La connexion s’effectue en un clic, sans devoir recopier manuellement une clé de sécurité complexe.',
    category: 'technique',
    iconName: 'wifi',
  },
  {
    id: 'faq-scanner-app',
    question: 'Faut-il installer une application tierce pour scanner ces QR codes ?',
    answer:
      'Non. Depuis plusieurs années, l’appareil photo natif des smartphones iOS (iPhone) et Android intègre la reconnaissance automatique de QR codes. Il suffit d’ouvrir l’appareil photo, de pointer vers le QR code et d’appuyer sur la notification qui s’affiche instantanément à l’écran.',
    category: 'general',
    iconName: 'qr_code_scanner',
  },
  {
    id: 'faq-readability',
    question: 'Puis-je personnaliser les couleurs et ajouter un logo sans briser la scannabilité ?',
    answer:
      'Oui, grâce au niveau de correction d’erreur élevé (ECL High à 30%) configuré dans notre moteur, le QR code tolère l’intégration d’un logo central tout en restant lisible. Pour garantir un scan optimal, veillez simplement à conserver un contraste suffisant entre la couleur du motif et la couleur d’arrière-plan (éviter le clair sur clair).',
    category: 'technique',
    iconName: 'palette',
  },
  {
    id: 'faq-static-vs-dynamic',
    question: 'Quelle différence entre QR statique et dynamique ?',
    answer:
      'Le QR statique encode directement son contenu dans le code : il fonctionne pour toujours et se génère dans votre navigateur. Le QR dynamique pointe vers QRCraft, qui redirige vers votre destination et enregistre chaque scan. Vous gardez la main après l’impression.',
    category: 'general',
    iconName: 'qr_code_scanner',
  },
  {
    id: 'faq-editable-destination',
    question: 'Puis-je changer la destination après impression ?',
    answer:
      'Oui, avec un compte. Un QR dynamique peut changer de destination, être mis en pause ou recevoir une date d’expiration, sans être réimprimé. Le code imprimé reste le même.',
    category: 'general',
    iconName: 'qr_code_scanner',
  },
  {
    id: 'faq-scan-data',
    question: 'Quelles données sont collectées lors d’un scan ?',
    answer:
      'L’adresse IP sert uniquement à déduire la ville et le pays, puis elle est jetée. Le système, le navigateur, le type d’appareil, la langue et l’heure ne permettent pas de vous identifier. Aucune adresse IP n’est stockée.',
    category: 'securite',
    iconName: 'lock',
  },
];

/**
 * Questions affichées sur l'accueil, dans l'ordre de la maquette.
 * Desktop : les 6 ; mobile : les 4 premières (FR-029).
 */
export const LANDING_FAQ_IDS: readonly string[] = [
  'faq-free',
  'faq-static-vs-dynamic',
  'faq-editable-destination',
  'faq-scan-data',
  'faq-svg-png',
  'faq-scanner-app',
];

/**
 * Résout une liste d'identifiants en questions. Un identifiant inconnu lève
 * une erreur explicite : une sélection silencieusement incomplète casserait
 * les données structurées (FR-038).
 */
export function selectFaqItems(ids: readonly string[]): readonly FaqItem[] {
  return ids.map((id) => {
    const item = FAQ_ITEMS.find((faq) => faq.id === id);
    if (!item) {
      throw new Error(`FAQ : identifiant inconnu « ${id} »`);
    }
    return item;
  });
}
