export interface FeatureItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  gradient: string;
  badge?: string;
  bulletPoints?: string[];
  metrics?: {
    value: string;
    label: string;
  };
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
  detail: string;
  iconName: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  price: string;
  period: string;
  description: string;
  isPopular?: boolean;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  certificateId: string;
  growthMetric: string;
  avatarUrl?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface StatItem {
  value: string;
  label: string;
  sublabel: string;
  iconName: string;
}
