import type { AstroSeoProps } from '@astrolib/seo';

export type MetaSEO = AstroSeoProps & {
  publication_url?: string;
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
