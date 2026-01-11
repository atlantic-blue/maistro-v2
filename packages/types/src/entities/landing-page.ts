export interface LandingPageSection {
  type: "hero" | "features" | "benefits" | "testimonials" | "cta" | "faq";
  content: Record<string, unknown>;
}

export interface LandingPageTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

export interface LandingPage {
  projectId: string;
  headline: string;
  subheadline: string;
  sections: LandingPageSection[];
  theme: LandingPageTheme;
  ctaText: string;
  ctaUrl?: string;
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
  customCss?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateLandingPageInput {
  projectId: string;
}

export interface UpdateLandingPageInput {
  headline?: string;
  subheadline?: string;
  sections?: LandingPageSection[];
  theme?: LandingPageTheme;
  ctaText?: string;
  ctaUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  customCss?: string;
}

export interface LandingPageDynamoDB {
  PK: `PROJECT#${string}`;
  SK: "LANDING_PAGE";
  projectId: string;
  headline: string;
  subheadline: string;
  sections: LandingPageSection[];
  theme: LandingPageTheme;
  ctaText: string;
  ctaUrl?: string;
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
  customCss?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  entityType: "LANDING_PAGE";
}
