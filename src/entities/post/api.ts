import http, { API_BASE_URL } from "@/shared/api/http";
import type {
  Paginated,
  Post,
  PostCreatePayload,
  PostDTO,
  PostUpdatePayload,
  PostsListParams,
} from "./types";

const resolveImageUrl = (value?: string | null): string | undefined => {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value, API_BASE_URL).toString();
  } catch (error) {
    console.warn("Failed to resolve image URL", error);
    return value;
  }
};

const mapPost = (dto: PostDTO): Post => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  imageUrl: resolveImageUrl(dto.imageUrl ?? dto.image ?? undefined),
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

const normalizePaginated = (payload: {
  data?: PostDTO[];
  items?: PostDTO[];
  results?: PostDTO[];
  total?: number;
  page?: number;
  size?: number;
  perPage?: number;
}): Paginated<Post> => {
  const source = payload.items ?? payload.data ?? payload.results ?? [];
  const size = payload.size ?? payload.perPage ?? (source.length || 1);
  return {
    items: source.map(mapPost),
    total: payload.total ?? source.length,
    page: payload.page ?? 1,
    size,
  };
};

const applyClientPagination = (
  posts: PostDTO[],
  params: PostsListParams,
): Paginated<Post> => {
  const search = params.search?.trim().toLowerCase();
  const filtered = search
    ? posts.filter((post) => {
        const haystack = `${post.title} ${post.description}`.toLowerCase();
        return haystack.includes(search);
      })
    : posts;

  const sorted = [...filtered].sort((a, b) => {
    const direction = params.sort === "createdAt.asc" ? 1 : -1;
    return (
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ) * direction;
  });

  const page = params.page ?? 1;
  const size = params.size ?? (sorted.length === 0 ? 1 : sorted.length);
  const start = (page - 1) * size;
  const sliced = sorted.slice(start, start + size);

  return {
    items: sliced.map(mapPost),
    total: sorted.length,
    page,
    size,
  };
};

export const listPosts = async (
  params: PostsListParams = {},
): Promise<Paginated<Post>> => {
  const response = await http.get("/api/posts", {
    params: {
      page: params.page,
      size: params.size,
      search: params.search,
      sort: params.sort,
    },
  });

  const payload = response.data;

  if (Array.isArray(payload)) {
    return applyClientPagination(payload, params);
  }

  if (payload && typeof payload === "object") {
    const maybeItems =
      Array.isArray(payload.items) ||
      Array.isArray(payload.data) ||
      Array.isArray(payload.results);

    if (maybeItems) {
      return normalizePaginated(payload);
    }
  }

  throw new Error("Не удалось загрузить список постов");
};

export const getPost = async (postId: string): Promise<Post> => {
  const response = await http.get<PostDTO>(`/api/posts/${postId}`);
  return mapPost(response.data);
};

const buildFormData = (
  payload: Pick<PostCreatePayload, "title" | "description"> &
    Partial<Pick<PostCreatePayload, "imageFile">> &
    Partial<Pick<PostUpdatePayload, "clearImage">>,
) => {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("description", payload.description);

  if (payload.imageFile instanceof File) {
    form.append("image", payload.imageFile);
  } else if (payload.clearImage) {
    // Для надёжной передачи "пустого" файла используем Blob без содержимого.
    // Это гарантирует multipart-часть, которую бэкенд может интерпретировать как команду удалить изображение.
    form.append("image", new Blob([], { type: "application/octet-stream" }), "");
  }

  return form;
};

export const createPost = async (payload: PostCreatePayload): Promise<Post> => {
  const form = buildFormData(payload);
  const response = await http.post<PostDTO>("/api/posts", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return mapPost(response.data);
};

export const updatePost = async (
  payload: PostUpdatePayload,
): Promise<Post> => {
  const { id, ...rest } = payload;
  const form = buildFormData(rest);
  const response = await http.put<PostDTO>(`/api/posts/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return mapPost(response.data);
};

export const deletePost = async (postId: string): Promise<void> => {
  await http.delete(`/api/posts/${postId}`);
};
