export interface SeoPageConfig {
  readonly title: string;
  readonly description: string;
  readonly keywords?: readonly string[];
  readonly canonicalUrl?: string;
  readonly ogImage?: string;
  readonly robots?: 'index, follow' | 'noindex, follow' | 'noindex, nofollow';
}

export interface OpenGraphMetadata {
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly url: string;
  readonly type: 'website' | 'article';
  readonly siteName: string;
  readonly locale: string;
}

export interface TwitterCardMetadata {
  readonly card: 'summary' | 'summary_large_image';
  readonly title: string;
  readonly description: string;
  readonly image: string;
}

export interface JsonLdOffer {
  readonly '@type': 'Offer';
  readonly price: '0';
  readonly priceCurrency: 'EUR';
}

export interface JsonLdWebApplication {
  readonly '@context': 'https://schema.org';
  readonly '@type': 'WebApplication';
  readonly name: string;
  readonly url: string;
  readonly description: string;
  readonly applicationCategory: 'DesignApplication';
  readonly operatingSystem: 'All';
  readonly browserRequirements: string;
  readonly offers: JsonLdOffer;
  readonly featureList: readonly string[];
}
