import { AlternativeCompetitor } from '../models/alternative.model';

export const MARKET_ALTERNATIVES: readonly AlternativeCompetitor[] = [
  {
    id: 'alt-canva',
    name: 'Canva QR',
    badge: 'Compte obligatoire & exports limités',
    frictionPoint:
      'Nécessite la création d’un compte Canva, complexité de l’éditeur graphique complet pour un simple besoin de QR code, et exports vectoriels SVG réservés aux abonnements payants.',
    qrcraftAdvantage:
      'Génération instantanée en 1 clic sans compte, studio épuré focalisé sur le QR code et export vectoriel SVG illimité 100% gratuit.',
    icon: 'auto_fix_high',
  },
  {
    id: 'alt-monkey',
    name: 'QRCode Monkey',
    badge: 'Interface vieillissante & bannières publicitaires',
    frictionPoint:
      'Interface visuelle datée, présence importante de bannières publicitaires et redirection vers des offres d’abonnements SaaS payants pour le suivi statistique.',
    qrcraftAdvantage:
      'Interface moderne et épurée, zéro publicité intrusive, design soigné conforme aux standards visuels récents, génération 100% locale et respect strict de la vie privée.',
    icon: 'sentiment_neutral',
  },
  {
    id: 'alt-bitly',
    name: 'Bitly / QR Code Generator',
    badge: 'Le piège des abonnements mensuels récurrents',
    frictionPoint:
      'Génère des QR codes dynamiques sous forme d’essai gratuit de 14 jours, puis désactive brutalement les scans si vous ne payez pas un abonnement mensuel (souvent plus de 15€/mois).',
    qrcraftAdvantage:
      'QR codes 100% statiques et autonomes qui n’expirent JAMAIS. Vos flyers, menus et cartes de visite restent valides à vie sans le moindre centime à débourser.',
    icon: 'hourglass_disabled',
  },
  {
    id: 'alt-unitag',
    name: 'Unitag',
    badge: 'Quotas et fonctionnalités bridées',
    frictionPoint:
      'Résolution d’image bridée en version gratuite, filigranes ou quotas de téléchargements imposant la souscription à une formule entreprise.',
    qrcraftAdvantage:
      'Zéro filigrane, téléchargement immédiat en SVG et PNG haute définition, toutes les options de dégradés et logos débloquées sans condition.',
    icon: 'lock_open_right',
  },
];
