import { z } from "zod";
import http, { API_BASE_URL } from "@/api/http";
import type { NewsItem } from "@/entities/news/types";

export interface NewsListParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface CreateNewsPayload {
  title: string;
  excerpt?: string;
  content?: string;
  cover?: string;
  status?: string;
}

export type UpdateNewsPayload = Partial<CreateNewsPayload>;

export interface NewsApi {
  list(params?: NewsListParams): Promise<NewsItem[]>;
  get(id: string): Promise<NewsItem>;
  create(payload: CreateNewsPayload): Promise<NewsItem>;
  update(id: string, payload: UpdateNewsPayload): Promise<NewsItem>;
  delete(id: string): Promise<void>;
}

type PostDto = z.infer<typeof postSchema>;

const postSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    title: z.string().optional(),
    name: z.string().optional(),
    slug: z.string().optional(),
    code: z.string().optional(),
    previewText: z.string().optional(),
    excerpt: z.string().optional(),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    content: z.string().optional(),
    body: z.string().optional(),
    text: z.string().optional(),
    cover: z.string().optional(),
    coverUrl: z.string().optional(),
    imageUrl: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    mainImageUrl: z.string().optional(),
    publishedAt: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    status: z.string().optional(),
  })
  .passthrough();

const listResponseSchema = z.array(postSchema);

const FALLBACK_COVER = "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80";

const toNewsItem = (dto: PostDto): NewsItem => {
  const title = pickString([dto.title, dto.name, dto.description, dto.text, "Новость"]);
  const excerpt = pickString([dto.excerpt, dto.previewText, dto.shortDescription, dto.description, dto.text]);
  const content = pickString([dto.content, dto.body, dto.text, excerpt]);
  const cover = normalizeCover(
    pickString([dto.cover, dto.coverUrl, dto.imageUrl, dto.thumbnailUrl, dto.mainImageUrl]),
  ) || FALLBACK_COVER;
  const rawDate = pickString([dto.publishedAt, dto.createdAt, dto.updatedAt]);

  return {
    id: String(dto.id),
    slug: normalizeSlug(pickString([dto.slug, dto.code]) || title),
    title,
    cover,
    excerpt,
    content,
    status: pickString([dto.status]) || "published",
    publishedAt: normalizeDate(rawDate),
  };
};

const pickString = (values: Array<unknown | undefined>): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
};

const normalizeSlug = (value: string): string => {
  if (!value) return "post";
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\p{sc=Cyrl}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 80) || "post";
};

const normalizeDate = (value: string): string | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(+date)) return undefined;
  return date.toISOString();
};

const normalizeCover = (value: string): string => {
  const cover = value?.trim();
  if (!cover) return "";

  if (/^https?:\/\//i.test(cover) || cover.startsWith("data:")) {
    return cover;
  }

  try {
    if (cover.startsWith("/")) {
      return new URL(cover, API_BASE_URL).toString();
    }

    const url = new URL("/api/files", API_BASE_URL);
    url.searchParams.set("path", cover);
    return url.toString();
  } catch (error) {
    console.error("Failed to normalize cover", error);
    return cover;
  }
};

const request = async <T>(fn: () => Promise<{ data: unknown }>, map: (payload: unknown) => T): Promise<T> => {
  const response = await fn();
  return map(response.data);
};

const newsApi: NewsApi = {
  async list(params) {
    return request(() => http.get("/api/posts", { params }), (payload) => {
      const parsed = listResponseSchema.safeParse(payload);
      if (!parsed.success) {
        console.error("Failed to parse posts", parsed.error);
        return [];
      }
      return parsed.data.map(toNewsItem);
    });
  },

  async get(id) {
    return request(() => http.get(`/api/posts/${id}`), (payload) => {
      const parsed = postSchema.safeParse(payload);
      if (!parsed.success) {
        console.error("Failed to parse post", parsed.error);
        throw new Error("Не удалось получить новость");
      }
      return toNewsItem(parsed.data);
    });
  },

  async create(payload) {
    return request(
      () =>
        http.post("/api/posts", {
          title: payload.title,
          excerpt: payload.excerpt,
          content: payload.content,
          cover: payload.cover,
          status: payload.status,
        }),
      (data) => {
        const parsed = postSchema.safeParse(data);
        if (!parsed.success) {
          console.error("Failed to parse post after create", parsed.error);
          throw new Error("Неверный ответ сервера при создании новости");
        }
        return toNewsItem(parsed.data);
      },
    );
  },

  async update(id, payload) {
    return request(
      () =>
        http.post(`/api/posts/${id}`, {
          title: payload.title,
          excerpt: payload.excerpt,
          content: payload.content,
          cover: payload.cover,
          status: payload.status,
        }),
      (data) => {
        const parsed = postSchema.safeParse(data);
        if (!parsed.success) {
          console.error("Failed to parse post after update", parsed.error);
          throw new Error("Неверный ответ сервера при обновлении новости");
        }
        return toNewsItem(parsed.data);
      },
    );
  },

  async delete(id) {
    await http.delete(`/api/posts/${id}`);
  },
};

export { newsApi };
