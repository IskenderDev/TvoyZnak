export type UserRole = "admin" | "user";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type User = UserProfile;

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistrationPayload extends UserCredentials {
  fullName: string;
  phoneNumber?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export interface CarNumberLotOwner {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

export type CarNumberLotStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected"
  | "archived";

export interface CarNumberLot {
  id: string;
  title: string;
  description?: string;
  price: number;
  region: string;
  number: string;
  category?: string;
  status: CarNumberLotStatus;
  owner: CarNumberLotOwner;
  createdAt: string;
  updatedAt: string;
}

export interface CarNumberLotFilters {
  status?: CarNumberLotStatus;
  region?: string;
  category?: string;
  ownerId?: string;
}

export interface CarNumberLotPayload {
  title: string;
  description?: string;
  price: number;
  region: string;
  number: string;
  category?: string;
}

export interface CreateCarNumberLotWithRegistrationPayload
  extends CarNumberLotPayload {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export interface AdminUpdateCarNumberLotPayload {
  price?: number;
  status?: CarNumberLotStatus;
  category?: string;
}

export interface AdminUpdateUserPayload {
  role?: UserRole;
  isActive?: boolean;
  fullName?: string;
  phoneNumber?: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostPayload {
  title: string;
  body: string;
}
