export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  badgeText?: string;
  badgeIcon?: string;
  badgeColorClass?: string;
  paletteDots?: string[];
}

export interface ShowcaseModel {
  id: string;
  category: string;
  title: string;
  description: string;
  formatLabel: string;
  actionLabel: string;
  imageUrl: string;
  qrCard: {
    icon: string;
    tagText: string;
    titleText: string;
    bgClass: string;
  };
}
