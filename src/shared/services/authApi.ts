import { z } from "zod";

import apiClient from "@/shared/api/client";

const AuthUserSchema = z
  .object({
    id: z.coerce.number(),
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().nullish(),
    phoneNumber: z.string().nullish(),
  })
  .passthrough();

export type AuthUser = z.infer<typeof AuthUserSchema>;

const LoginPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginPayload = z.infer<typeof LoginPayloadSchema>;

const RegisterPayloadSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

export type RegisterPayload = z.infer<typeof RegisterPayloadSchema>;

export const login = async (payload: LoginPayload): Promise<AuthUser> => {
  const body = LoginPayloadSchema.parse(payload);
  const response = await apiClient.post("/api/auth/login", body, {
    requiresAuth: false,
  });
  return AuthUserSchema.parse(response.data);
};

export const register = async (payload: RegisterPayload): Promise<AuthUser> => {
  const body = RegisterPayloadSchema.parse(payload);
  const response = await apiClient.post("/api/auth/register", body, {
    requiresAuth: false,
  });
  return AuthUserSchema.parse(response.data);
};

export const me = async (): Promise<AuthUser> => {
  const response = await apiClient.get("/api/auth/me", {
    requiresAuth: true,
    skipAuthRedirect: true,
  });
  return AuthUserSchema.parse(response.data);
};
