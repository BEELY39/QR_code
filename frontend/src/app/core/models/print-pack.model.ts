/** Modèles d'imprimés prêts à poser proposés au téléchargement */
export type PrintPackFormat = 'chevalet-a6' | 'affichette-a5' | 'etiquettes-5x5';

/** Textes imprimés autour du QR code, déduits du mode du générateur */
export interface PrintPackContent {
  /** Accroche principale, ex. « Wi-Fi gratuit » */
  readonly title: string;
  /** Ligne secondaire, ex. « Réseau : freebox-667ekip » */
  readonly subtitle: string;
  /** Consigne de scan affichée sous le code */
  readonly instruction: string;
  /** Mention discrète en pied de page (désactivable par l'utilisateur) */
  readonly credit: string | null;
}

/** Description d'un format proposé dans l'interface */
export interface PrintPackFormatOption {
  readonly value: PrintPackFormat;
  readonly label: string;
  readonly description: string;
  readonly iconName: string;
  /** Nom de fichier (sans extension) utilisé au téléchargement */
  readonly filename: string;
}

export const PRINT_PACK_FORMATS: readonly PrintPackFormatOption[] = [
  {
    value: 'chevalet-a6',
    label: 'Chevalet de table',
    description: 'A5 à plier en deux — tient debout sur une table ou un comptoir',
    iconName: 'table_restaurant',
    filename: 'qrcraft-chevalet-a6',
  },
  {
    value: 'affichette-a5',
    label: 'Affichette A5',
    description: 'À afficher en vitrine, au mur ou dans un livret d\'accueil',
    iconName: 'wallpaper',
    filename: 'qrcraft-affichette-a5',
  },
  {
    value: 'etiquettes-5x5',
    label: 'Planche d\'étiquettes',
    description: '15 étiquettes de 5 × 5 cm sur A4, avec repères de découpe',
    iconName: 'grid_view',
    filename: 'qrcraft-etiquettes-5x5',
  },
];
