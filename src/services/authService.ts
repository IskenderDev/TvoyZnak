import { isAxiosError } from "axios";

import http from "@/api/http";
import type { AuthSession, AuthUser, Role } from "@/types/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const KNOWN_ROLE_MAP: Record<string, Role> = {
  admin: "admin",
  user: "user",
  "role_admin": "admin",
  "role_user": "user",
  administrator: "admin",
};

const normalizeRole = (value: unknown): Role | null => {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized in KNOWN_ROLE_MAP) {
    return KNOWN_ROLE_MAP[normalized];
  }
  if (normalized.startsWith("role_")) {
    return KNOWN_ROLE_MAP[normalized as keyof typeof KNOWN_ROLE_MAP] ?? null;
  }
  if (normalized === "admin" || normalized === "administrator") {
    return "admin";
  }
  if (normalized === "user" || normalized === "client") {
    return "user";
  }
  return null;
};

const dedupeRoles = (roles: Role[]): Role[] => {
  return Array.from(new Set(roles));
};

const pickUserSource = (payload: unknown): Record<string, unknown> | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  if ("user" in record && record.user && typeof record.user === "object") {
    return record.user as Record<string, unknown>;
  }
  if ("data" in record && record.data && typeof record.data === "object") {
    const nested = record.data as Record<string, unknown>;
    if ("user" in nested && nested.user && typeof nested.user === "object") {
      return nested.user as Record<string, unknown>;
    }
    return nested;
  }
  if ("profile" in record && record.profile && typeof record.profile === "object") {
    return record.profile as Record<string, unknown>;
  }
  return record;
};

const readToken = (payload: unknown): string | null => {
  if (!payload) return null;
  if (typeof payload === "string" && payload.split(".").length >= 2) {
    return payload;
  }
  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const candidates = [
      record.token,
      record.accessToken,
      record.jwt,
      record.jwtToken,
      record.authorization,
      (record.data as Record<string, unknown> | undefined)?.token,
    ];
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate;
      }
    }
  }
  return null;
};

const toAuthUser = (
  payload: unknown,
  fallback?: Partial<RegisterPayload> & Partial<LoginPayload>,
): AuthUser => {
  const source = pickUserSource(payload) ?? {};

  const fullNameCandidate = source.fullName ?? source.name ?? source.username;
  const emailCandidate = source.email ?? source.mail ?? source.login;
  const phoneCandidate = source.phoneNumber ?? source.phone ?? source.phone_number;
  const idCandidate = source.id ?? source.userId ?? source.userID ?? source._id;

  const rawRoles = source.roles ?? source.role ?? source.authorities;
  const roles: Role[] = [];
  if (Array.isArray(rawRoles)) {
    for (const item of rawRoles) {
      const normalized = normalizeRole(item);
      if (normalized) {
        roles.push(normalized);
      }
    }
  } else if (rawRoles) {
    const normalized = normalizeRole(rawRoles);
    if (normalized) {
      roles.push(normalized);
    }
  }

  const finalRoles = dedupeRoles(roles);
  const primaryRole = finalRoles[0] ?? "user";

  return {
    id: typeof idCandidate === "string" || typeof idCandidate === "number" ? idCandidate : undefined,
    fullName:
      (typeof fullNameCandidate === "string" && fullNameCandidate.trim())
        ? fullNameCandidate.trim()
        : fallback?.fullName?.trim() ?? "",
    email:
      (typeof emailCandidate === "string" && emailCandidate.trim())
        ? emailCandidate.trim()
        : fallback?.email?.trim(),
    phoneNumber:
      (typeof phoneCandidate === "string" && phoneCandidate.trim())
        ? phoneCandidate.trim()
        : fallback?.phoneNumber?.trim(),
    roles: finalRoles.length > 0 ? finalRoles : [primaryRole],
    role: primaryRole,
  };
};

const buildAuthSession = (
  payload: unknown,
  fallback?: Partial<RegisterPayload> & Partial<LoginPayload>,
): AuthSession | null => {
  const token = readToken(payload);
  const user = toAuthUser(payload, fallback);
  if (token && user.fullName) {
    return { token, user };
  }

  if (token) {
    return { token, user };
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (record.data) {
      const nested = buildAuthSession(record.data, fallback);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
};

const toApiError = (error: unknown, fallback: string): Error => {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "string" && data.trim()) {
      return new Error(data);
    }
    if (data && typeof data === "object") {
      const message =
        ("message" in data && typeof data.message === "string" && data.message.trim())
          ? data.message
          : ("error" in data && typeof data.error === "string" && data.error.trim())
            ? data.error
            : null;
      if (message) {
        return new Error(message);
      }
    }
    if (error.message) {
      return new Error(error.message);
    }
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error(fallback);
};

export async function login(payload: LoginPayload): Promise<AuthSession> {
  try {
    const response = await http.post("/api/auth/login", {
      email: payload.email,
      password: payload.password,
    });

    const session = buildAuthSession(response.data, payload);
    if (!session?.token) {
      throw new Error("Сервер не вернул токен авторизации");
    }
    return session;
  } catch (error) {
    throw toApiError(error, "Не удалось войти");
  }
}

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  try {
    const response = await http.post("/api/auth/register", {
      fullName: payload.fullName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      password: payload.password,
    });

    const session = buildAuthSession(response.data, payload);
    if (session?.token) {
      return session;
    }

    return await login({ email: payload.email, password: payload.password });
  } catch (error) {
    throw toApiError(error, "Не удалось зарегистрироваться");
  }
}
