export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  cover?: string;
  excerpt?: string;
  content?: string;
  publishedAt?: string;
  status?: "draft" | "published";
}
