export interface OpenGraphMedia {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  type?: string;
  secureUrl?: string;
}

export interface OpenGraphArticle {
  publishedTime?: string;
  modifiedTime?: string;
  expirationTime?: string;
  authors?: ReadonlyArray<string>;
  section?: string;
  tags?: ReadonlyArray<string>;
}

export interface OpenGraphMeta {
  url?: string;
  type?: string;
  title?: string;
  description?: string;
  images?: ReadonlyArray<OpenGraphMedia>;
  locale?: string;
  site_name?: string;
  article?: OpenGraphArticle;
}

export type MetaSEO = {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  ogTitle?: string;
  ogType?: string;
  openGraph?: OpenGraphMeta;
  publication_url?: string;
  image?: string | { src: string };
};

export interface Post {
  id: string;
  slug: string;
  
  publishDate: Date;
  title: string;
  description?: string;
  
  image?: string;
  
  canonical?: string;
  permalink?: string;
  
  draft?: boolean;
  
  excerpt?: string;
  category?: string;
  tags?: Array<string>;
  author?: string;
  
  metadata?: {
    canonical?: string;
  };
}
