export type UserRole = "admin" | "user";

export interface User {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  role: UserRole;
  isActive?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
