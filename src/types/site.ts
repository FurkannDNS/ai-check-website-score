export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    portal: string;
  };
  company: {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
  };
}
