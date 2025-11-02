export type Role = "admin" | "user";

export interface AuthUser {
  id?: string | number;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  roles: Role[];
  role?: Role;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}
