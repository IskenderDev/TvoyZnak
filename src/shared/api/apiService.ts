import { apiClient } from "@/shared/api/client";
import type {
  AdminUpdateUserPayload,
  AdminUpdateCarNumberLotPayload,
  CarNumberLot,
  CarNumberLotFilters,
  CarNumberLotPayload,
  CreateCarNumberLotWithRegistrationPayload,
  PaginatedResponse,
  Post,
  PostPayload,
  User,
  UserCredentials,
  UserProfile,
  UserRegistrationPayload,
} from "@/shared/types";

export interface ApiListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const apiService = {
  auth: {
    async login(payload: UserCredentials) {
      const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
      return data;
    },
    async register(payload: UserRegistrationPayload) {
      const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
      return data;
    },
    async me() {
      const { data } = await apiClient.get<UserProfile>("/auth/me");
      return data;
    },
  },
  posts: {
    async list(params?: ApiListParams) {
      const { data } = await apiClient.get<PaginatedResponse<Post>>("/posts", { params });
      return data;
    },
    async getById(id: string) {
      const { data } = await apiClient.get<Post>(`/posts/${id}`);
      return data;
    },
  },
  carNumberLots: {
    async list(params?: ApiListParams & CarNumberLotFilters) {
      const { data } = await apiClient.get<PaginatedResponse<CarNumberLot>>(
        "/car-number-lots",
        { params },
      );
      return data;
    },
    async listMine(params?: ApiListParams) {
      const { data } = await apiClient.get<PaginatedResponse<CarNumberLot>>(
        "/car-number-lots/my",
        { params },
      );
      return data;
    },
    async getById(id: string) {
      const { data } = await apiClient.get<CarNumberLot>(`/car-number-lots/${id}`);
      return data;
    },
    async create(payload: CarNumberLotPayload) {
      const { data } = await apiClient.post<CarNumberLot>("/car-number-lots", payload);
      return data;
    },
    async createAndRegister(payload: CreateCarNumberLotWithRegistrationPayload) {
      const { data } = await apiClient.post<AuthResponse & { lot: CarNumberLot }>(
        "/car-number-lots/create-and-register",
        payload,
      );
      return data;
    },
    async update(id: string, payload: CarNumberLotPayload) {
      const { data } = await apiClient.put<CarNumberLot>(
        `/car-number-lots/${id}`,
        payload,
      );
      return data;
    },
    async remove(id: string) {
      await apiClient.delete(`/car-number-lots/${id}`);
    },
  },
  admin: {
    async listCarNumberLots(params?: ApiListParams & CarNumberLotFilters) {
      const { data } = await apiClient.get<PaginatedResponse<CarNumberLot>>(
        "/admin/car-number-lots",
        { params },
      );
      return data;
    },
    async updateCarNumberLot(id: string, payload: AdminUpdateCarNumberLotPayload) {
      const { data } = await apiClient.patch<CarNumberLot>(
        `/admin/car-number-lots/${id}`,
        payload,
      );
      return data;
    },
    async confirmCarNumberLot(id: string) {
      const { data } = await apiClient.post<CarNumberLot>(
        `/admin/car-number-lots/${id}/confirm`,
      );
      return data;
    },
    async deleteCarNumberLot(id: string) {
      await apiClient.delete(`/admin/car-number-lots/${id}`);
    },
    async listUsers(params?: ApiListParams) {
      const { data } = await apiClient.get<PaginatedResponse<User>>(
        "/admin/users",
        { params },
      );
      return data;
    },
    async updateUser(id: string, payload: AdminUpdateUserPayload) {
      const { data } = await apiClient.patch<User>(`/admin/users/${id}`, payload);
      return data;
    },
    async deleteUser(id: string) {
      await apiClient.delete(`/admin/users/${id}`);
    },
    async listPosts(params?: ApiListParams) {
      const { data } = await apiClient.get<PaginatedResponse<Post>>(
        "/admin/posts",
        { params },
      );
      return data;
    },
    async createPost(payload: PostPayload) {
      const { data } = await apiClient.post<Post>("/admin/posts", payload);
      return data;
    },
    async updatePost(id: string, payload: PostPayload) {
      const { data } = await apiClient.put<Post>(`/admin/posts/${id}`, payload);
      return data;
    },
    async deletePost(id: string) {
      await apiClient.delete(`/admin/posts/${id}`);
    },
  },
};

export type ApiService = typeof apiService;
