export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  pagemap?: {
    metatags?: Array<{
      'og:image'?: string;
      'article:published_time'?: string;
    }>;
    cse_image?: Array<{
      src: string;
    }>;
  };
  source?: {
    title: string;
  };
}

export interface SearchParams {
  keyword: string;
  customKeywords?: string[];
}

export interface KeywordCategory {
  id: string;
  name: string;
  keywords: string[];
}