import type { UserRole } from "@/entities/user/types";

export interface AuthUser {
  id?: string | number;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRole;
  token?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}
