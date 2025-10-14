import type { NewsItem } from "@/entities/news/types";

/**
 * Сигнатуры методов для ресурса "Новости". Без реализации.
 */

export interface NewsListParams {
  // Будущие параметры (пагинация, фильтры) — не реализуем
}

export interface NewsApi {
  list(params?: NewsListParams): Promise<NewsItem[]>;
  get(slug: string): Promise<NewsItem>;
  create(payload: Omit<NewsItem, "id" | "publishedAt" | "status">): Promise<NewsItem>;
  update(slug: string, payload: Partial<Omit<NewsItem, "id" | "slug">>): Promise<NewsItem>;
  delete(slug: string): Promise<void>;
}

// export const newsApi: NewsApi = {} as any;
