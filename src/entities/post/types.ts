export interface Post {
  id: string;
  slug: string;
  title: string;
  cover?: string;
  excerpt?: string;
  content?: string;
  publishedAt?: string;
  status?: string;
}
