export interface Article {
  headline: string;
  description: string | null;
  content: string;
  type: string;
  slug: string;
  views: number;
  category: string;
}
