import apiClient from "@/shared/api/client";
import {
  carNumberLotsApi,
  mapCarNumberLot,
  mapCarNumberLotList,
} from "@/shared/services/carNumberLotsApi";
import type { CarNumberLot } from "@/entities/car-number-lot/types";
import type { User } from "@/entities/user/types";
import type { Post } from "@/entities/post/types";
import type { AuthCredentials, AuthUser, RegisterPayload } from "@/entities/auth/types";

type UnknownRecord = Record<string, unknown>;

const arrayLikeKeys = ["content", "items", "data", "results", "rows", "list", "users"] as const;

export interface AuthResult {
  user: AuthUser;
  token?: string;
}

const authApi = {
  async login(credentials: AuthCredentials): Promise<AuthResult> {
    const response = await apiClient.post("/api/auth/login", credentials);
    return normalizeAuthResult(response.data, {
      email: credentials.email,
    });
  },

  async register(payload: RegisterPayload): Promise<AuthResult> {
    const response = await apiClient.post("/api/auth/register", payload);
    return normalizeAuthResult(response.data, {
      fullName: payload.fullName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
    });
  },

  async me(): Promise<AuthResult | null> {
    try {
      const response = await apiClient.get("/api/auth/me");
      return normalizeAuthResult(response.data);
    } catch (error) {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/api/auth/logout");
    } catch (error) {
      // ignore logout errors
    }
  },
};

const adminCarNumberLotsApi = {
  async get(id: string): Promise<CarNumberLot> {
    const response = await apiClient.get(`/api/admin/car-number-lots/${id}`);
    const lot = mapCarNumberLot(response.data);
    if (!lot) {
      throw new Error("Не удалось получить объявление");
    }
    return lot;
  },

  async list(): Promise<CarNumberLot[]> {
    const response = await apiClient.get("/api/admin/car-number-lots");
    return mapCarNumberLotList(response.data);
  },

  async update(
    id: string,
    payload: { price?: number; status?: string; description?: string },
  ): Promise<CarNumberLot> {
    const response = await apiClient.patch(`/api/admin/car-number-lots/${id}`, payload);
    const lot = mapCarNumberLot(response.data);
    if (!lot) {
      throw new Error("Не удалось обновить объявление");
    }
    return lot;
  },

  async confirm(id: string): Promise<CarNumberLot> {
    const response = await apiClient.post(`/api/admin/car-number-lots/${id}/confirm`);
    const lot = mapCarNumberLot(response.data);
    if (!lot) {
      throw new Error("Не удалось подтвердить объявление");
    }
    return lot;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/car-number-lots/${id}`);
  },
};

const adminUsersApi = {
  async list(): Promise<User[]> {
    const response = await apiClient.get("/api/admin/users");
    return mapUserList(response.data);
  },

  async update(id: string, payload: Partial<User>): Promise<User> {
    const response = await apiClient.patch(`/api/admin/users/${id}`, payload);
    const user = mapUser(response.data);
    if (!user) {
      throw new Error("Не удалось обновить пользователя");
    }
    return user;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/users/${id}`);
  },
};

const adminPostsApi = {
  async get(id: string): Promise<Post> {
    const response = await apiClient.get(`/api/admin/posts/${id}`);
    const post = mapPost(response.data);
    if (!post) {
      throw new Error("Не удалось получить публикацию");
    }
    return post;
  },

  async list(): Promise<Post[]> {
    const response = await apiClient.get("/api/admin/posts");
    return mapPostList(response.data);
  },

  async create(payload: Partial<Post>): Promise<Post> {
    const response = await apiClient.post("/api/admin/posts", payload);
    const post = mapPost(response.data);
    if (!post) {
      throw new Error("Не удалось создать публикацию");
    }
    return post;
  },

  async update(id: string, payload: Partial<Post>): Promise<Post> {
    const response = await apiClient.put(`/api/admin/posts/${id}`, payload);
    const post = mapPost(response.data);
    if (!post) {
      throw new Error("Не удалось обновить публикацию");
    }
    return post;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/posts/${id}`);
  },
};

export const apiService = {
  auth: authApi,
  carNumberLots: carNumberLotsApi,
  admin: {
    carNumberLots: adminCarNumberLotsApi,
    users: adminUsersApi,
    posts: adminPostsApi,
  },
};

function normalizeAuthResult(payload: unknown, fallback?: Partial<AuthUser>): AuthResult {
  const container = toRecord(payload);
  const userSource = container.user ?? container.data ?? payload;
  const tokenSource = pickString([container.token, container.accessToken, container.jwt]);

  const userRecord = toRecord(userSource);

  const user: AuthUser = {
    id: pickId([userRecord.id, userRecord.userId]),
    fullName: pickString([userRecord.fullName, userRecord.name]) ?? fallback?.fullName ?? "",
    email: pickString([userRecord.email, fallback?.email]),
    phoneNumber: pickString([userRecord.phoneNumber, userRecord.phone, fallback?.phoneNumber]),
    role: normalizeRole(userRecord.role) ?? fallback?.role,
    token: pickString([userRecord.token, tokenSource]) ?? fallback?.token,
  };

  return { user, token: user.token ?? tokenSource ?? undefined };
}

function mapUserList(payload: unknown): User[] {
  if (Array.isArray(payload)) {
    return payload.map(mapUser).filter(Boolean) as User[];
  }

  const record = toRecord(payload);
  for (const key of arrayLikeKeys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value.map(mapUser).filter(Boolean) as User[];
    }
  }

  return [];
}

function mapUser(payload: unknown): User | null {
  const record = toRecord(payload);
  const id = pickId([record.id, record.userId]);
  if (!id) {
    return null;
  }

  return {
    id,
    fullName: pickString([record.fullName, record.name, record.username]) ?? "Без имени",
    email: pickString([record.email]),
    phoneNumber: pickString([record.phoneNumber, record.phone]),
    role: normalizeRole(record.role) ?? "user",
    isActive: pickBoolean([record.isActive, record.active, record.enabled]),
    status: pickString([record.status]),
    createdAt: pickString([record.createdAt, record.created]),
    updatedAt: pickString([record.updatedAt, record.updated]),
  };
}

function mapPostList(payload: unknown): Post[] {
  if (Array.isArray(payload)) {
    return payload.map(mapPost).filter(Boolean) as Post[];
  }

  const record = toRecord(payload);
  for (const key of arrayLikeKeys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value.map(mapPost).filter(Boolean) as Post[];
    }
  }

  return [];
}

function mapPost(payload: unknown): Post | null {
  const record = toRecord(payload);
  const id = pickId([record.id, record.postId, record.slug]);
  if (!id) {
    return null;
  }

  return {
    id,
    slug: pickString([record.slug, record.id, record.title]) ?? id,
    title: pickString([record.title, record.name]) ?? "Без названия",
    cover: pickString([record.cover, record.image, record.thumbnail]) ?? undefined,
    excerpt: pickString([record.excerpt, record.summary, record.description]) ?? undefined,
    content: pickString([record.content, record.body]) ?? undefined,
    publishedAt: pickString([record.publishedAt, record.createdAt, record.date]) ?? undefined,
    status: pickString([record.status]) ?? undefined,
  };
}

function toRecord(value: unknown): UnknownRecord {
  if (value && typeof value === "object") {
    return value as UnknownRecord;
  }
  return {};
}

function pickString(values: Array<unknown | undefined>): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function pickId(values: Array<unknown | undefined>): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return undefined;
}

function pickBoolean(values: Array<unknown | undefined>): boolean | undefined {
  for (const value of values) {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "number") {
      if (value === 1) return true;
      if (value === 0) return false;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "1", "yes", "y"].includes(normalized)) {
        return true;
      }
      if (["false", "0", "no", "n"].includes(normalized)) {
        return false;
      }
    }
  }
  return undefined;
}

function normalizeRole(value: unknown): AuthUser["role"] {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "admin") return "admin";
    if (normalized === "user") return "user";
  }
  return undefined;
}
