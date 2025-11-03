export interface MetaSEO {
  title?: string;
  description?: string;
  image?: any; // Can be a string URL or an Astro image object
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  ogTitle?: string;
  ogType?: string;
  publication_url?: string;
}

export type MetaData = MetaSEO;
