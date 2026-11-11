import { IconName } from './icon.model';

/**
 * Contenu éditorial de la landing (FR-018) : tout texte affiché vit ici,
 * jamais dans un gabarit. Quand la maquette mobile diverge du desktop, le
 * champ porte une variante `…Mobile` (cf. contracts/landing-sections.md §0.1).
 */

/** Lien ou bouton de navigation. `isRoute` : routerLink, sinon ancre. */
export interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly isRoute: boolean;
  /** Identifiant de test ; la version mobile reçoit le préfixe `mobile-`. */
  readonly id?: string;
}

export interface HeroContent {
  readonly badge: string;
  readonly badgeMobile: string;
  readonly titleLead: string;
  readonly titleAccent: string;
  readonly lead: string;
  readonly leadMobile: string;
  readonly primaryCta: NavLink;
  readonly secondaryCta: NavLink;
  readonly guarantees: readonly string[];
  readonly guaranteesMobile: readonly string[];
}

export interface SectionHeading {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead?: string;
}

export interface OfferCard {
  readonly title: string;
  readonly badge: string;
  readonly badgeVariant: 'neutral' | 'accent';
  readonly tone: 'light' | 'dark';
  readonly description: string;
  readonly features: readonly string[];
  readonly cta: NavLink;
  readonly ctaVariant: 'outline' | 'light';
}

export interface OfferCardMobile {
  readonly title: string;
  readonly badge: string;
  readonly tone: 'light' | 'dark';
  readonly description: string;
  readonly cta: NavLink;
}

export interface ModelStep {
  readonly index: string;
  readonly kicker: string;
  readonly title: string;
  readonly description: string | null;
  readonly tags: readonly string[];
}

export interface ModelExample {
  readonly icon: IconName;
  readonly tint: 'warm' | 'accent';
  readonly lead: string;
  readonly rest: string;
}

export interface TrackerPillar {
  readonly icon: IconName;
  readonly title: string;
  readonly description: string;
  readonly descriptionMobile: string;
}

export interface AdvertiserBenefit {
  readonly title: string;
  readonly titleMobile: string;
  readonly description: string;
  readonly descriptionMobile: string;
}

export interface CreatorTag {
  readonly term: string;
  readonly definition: string;
}

export interface PrivacyContent {
  readonly title: string;
  readonly titleMobile: string;
  readonly lead: string;
  readonly leadMobile: string;
  readonly points: readonly string[];
}

export interface FooterColumn {
  readonly title: string;
  readonly links: readonly NavLink[];
}

export interface LandingContent {
  readonly nav: readonly NavLink[];
  readonly navAuth: NavLink;
  readonly navSignup: NavLink;
  readonly hero: HeroContent;
  readonly useCases: readonly string[];
  readonly useCasesMobile: readonly string[];
  readonly staticVsDynamic: SectionHeading;
  readonly offers: readonly OfferCard[];
  readonly offersMobile: readonly OfferCardMobile[];
  readonly model: SectionHeading;
  readonly modelStepsMobile: readonly string[];
  readonly modelSteps: readonly ModelStep[];
  readonly modelExamples: readonly ModelExample[];
  readonly tracker: SectionHeading & { readonly cta: NavLink };
  readonly trackerPillars: readonly TrackerPillar[];
  readonly teaserLabel: string;
  readonly advertisers: SectionHeading;
  readonly advertiserBenefits: readonly AdvertiserBenefit[];
  readonly creators: {
    readonly eyebrow: string;
    readonly titleLead: string;
    readonly titleAccent: string;
    readonly lead: string;
    readonly leadMobile: string;
    readonly bullets: readonly string[];
    readonly tags: readonly CreatorTag[];
    readonly ctaPrimary: NavLink;
    readonly ctaSecondary: NavLink;
  };
  readonly privacy: PrivacyContent;
  readonly faq: SectionHeading & { readonly guides: NavLink; readonly guidesMobile: NavLink };
  readonly cta: SectionHeading & { readonly primary: NavLink; readonly secondary: NavLink };
  readonly footer: {
    readonly tagline: string;
    readonly columns: readonly FooterColumn[];
    /** Liens compacts de la version mobile (deux colonnes). */
    readonly mobileLinks: readonly NavLink[];
    readonly legal: NavLink;
    readonly privacyLink: NavLink;
    readonly copyright: string;
    readonly madeIn: string;
  };
}
