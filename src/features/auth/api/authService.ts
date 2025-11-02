import { isAxiosError } from "axios";
import http from "@/shared/api/http";
import type { AuthSession, AuthUser, Role } from "@/entities/session/model/auth";

/** ===== Payloads ===== */
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

/** ===== Roles & user helpers ===== */
const KNOWN_ROLE_MAP: Record<string, Role> = {
  admin: "admin",
  user: "user",
  role_admin: "admin",
  role_user: "user",
  administrator: "admin",
};

const normalizeRole = (value: unknown): Role | null => {
  if (typeof value !== "string") return null;
  const v = value.trim().toLowerCase();
  if (!v) return null;
  if (v in KNOWN_ROLE_MAP) return KNOWN_ROLE_MAP[v];
  if (v.startsWith("role_")) return KNOWN_ROLE_MAP[v as keyof typeof KNOWN_ROLE_MAP] ?? null;
  if (v === "admin" || v === "administrator") return "admin";
  if (v === "user" || v === "client") return "user";
  return null;
};

const dedupeRoles = (roles: Role[]): Role[] => Array.from(new Set(roles));

type UnknownRecord = Record<string, unknown>;

const TOKEN_KEYS = [
  "token",
  "accessToken",
  "access_token",
  "jwt",
  "jwtToken",
  "idToken",
  "id_token",
  "authToken",
  "authorization",
  "bearer",
];

const TOKEN_CONTAINERS = ["data", "result", "response", "payload", "body"] as const;

const normalizeTokenValue = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.toLowerCase().startsWith("bearer ")) {
    return trimmed.slice(7).trim();
  }
  return trimmed;
};

const extractToken = (payload: unknown): string | null => {
  if (!payload) return null;
  if (typeof payload === "string") {
    const token = normalizeTokenValue(payload);
    return token ? token : null;
  }
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const token = extractToken(item);
      if (token) return token;
    }
    return null;
  }
  if (typeof payload !== "object") {
    return null;
  }

  const source = payload as UnknownRecord;

  for (const key of TOKEN_KEYS) {
    const value = source[key];
    if (typeof value === "string") {
      const token = normalizeTokenValue(value);
      if (token) return token;
    }
  }

  for (const containerKey of TOKEN_CONTAINERS) {
    const nested = source[containerKey];
    const token = extractToken(nested);
    if (token) return token;
  }

  return null;
};

const pickUserSource = (payload: unknown): UnknownRecord | null => {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as UnknownRecord;
  const userCandidate = record.user;
  if (userCandidate && typeof userCandidate === "object") {
    return userCandidate as UnknownRecord;
  }
  const dataCandidate = record.data;
  if (dataCandidate && typeof dataCandidate === "object") {
    const dataRecord = dataCandidate as UnknownRecord;
    const nestedUser = dataRecord.user;
    if (nestedUser && typeof nestedUser === "object") {
      return nestedUser as UnknownRecord;
    }
    return dataRecord;
  }
  const profileCandidate = record.profile;
  if (profileCandidate && typeof profileCandidate === "object") {
    return profileCandidate as UnknownRecord;
  }
  return record;
};

const readValue = (source: UnknownRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (key in source) {
      return source[key];
    }
  }
  return undefined;
};

const readTrimmedString = (source: UnknownRecord, keys: string[]): string | undefined => {
  const value = readValue(source, keys);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return undefined;
};

const readIdCandidate = (source: UnknownRecord, keys: string[]): string | number | undefined => {
  const value = readValue(source, keys);
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }
  return undefined;
};

const collectRoles = (source: UnknownRecord, keys: string[]): Role[] => {
  const raw = readValue(source, keys);
  const roles: Role[] = [];
  if (Array.isArray(raw)) {
    for (const item of raw) {
      const normalized = normalizeRole(item);
      if (normalized) roles.push(normalized);
    }
    return roles;
  }
  if (raw) {
    const normalized = normalizeRole(raw);
    if (normalized) roles.push(normalized);
  }
  return roles;
};

const toAuthUser = (
  payload: unknown,
  fallback?: Partial<RegisterPayload> & Partial<LoginPayload>,
): AuthUser => {
  const src = pickUserSource(payload) ?? {};

  const fullNameCandidate = readTrimmedString(src, ["fullName", "name", "username"]);
  const emailCandidate = readTrimmedString(src, ["email", "mail", "login"]);
  const phoneCandidate = readTrimmedString(src, ["phoneNumber", "phone", "phone_number"]);
  const idCandidate = readIdCandidate(src, ["id", "userId", "userID", "_id"]);

  const roles = collectRoles(src, ["roles", "role", "authorities"]);
  const finalRoles = roles.length > 0 ? dedupeRoles(roles) : inferAdminByEmail(emailCandidate);
  const primaryRole = finalRoles[0] ?? "user";

  return {
    id: idCandidate,
    fullName: fullNameCandidate ?? fallback?.fullName?.trim() ?? "",
    email: emailCandidate ?? fallback?.email?.trim(),
    phoneNumber: phoneCandidate ?? fallback?.phoneNumber?.trim(),
    roles: finalRoles.length > 0 ? finalRoles : [primaryRole],
    role: primaryRole,
  };
};

// --- Админы (белый список) ---
// Можно прокидывать из .env: VITE_ADMIN_EMAILS="admin@admin.admin,you@domain.tld"
const ADMIN_EMAILS = new Set<string>(
  (import.meta?.env?.VITE_ADMIN_EMAILS ?? "admin@admin.admin")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
);

const inferAdminByEmail = (email?: unknown): Role[] => {
  const v = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!v) return ["user"];
  return ADMIN_EMAILS.has(v) ? ["admin"] : ["user"];
};



/** ===== Errors ===== */
const toApiError = (error: unknown, fallback: string): Error => {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "string" && data.trim()) return new Error(data.trim());
    if (data && typeof data === "object") {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string" && message.trim()) {
        return new Error(message.trim());
      }
      const fallbackMessage = (data as { error?: unknown }).error;
      if (typeof fallbackMessage === "string" && fallbackMessage.trim()) {
        return new Error(fallbackMessage.trim());
      }
    }
    if (typeof error.message === "string" && error.message.trim()) {
      return new Error(error.message.trim());
    }
  }
  if (error instanceof Error) return error;
  return new Error(fallback);
};

const LS_KEY = "auth:user";

const saveUserToStorage = (user: AuthUser | undefined) => {
  try {
    if (!user) {
      localStorage.removeItem(LS_KEY);
      return;
    }
    localStorage.setItem(LS_KEY, JSON.stringify(user));
  } catch (storageError) {
    console.warn("Failed to persist auth user", storageError);
  }
};

export const getUserFromStorage = (): AuthUser | undefined => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as AuthUser;
  } catch (storageError) {
    console.warn("Failed to read auth user", storageError);
    return undefined;
  }
};

/** ===== Public API (без /auth/me) =====
 * Бэк НЕ возвращает токен, /auth/me нет.
 * Берём пользователя прямо из ответа /api/auth/login.
 * withCredentials: true — чтобы установить cookie для /api/car-number-lots/my.
 */
export async function login(payload: LoginPayload): Promise<AuthSession> {
  try {
    const response = await http.post(
      "/api/auth/login",
      { email: payload.email, password: payload.password },
      { withCredentials: true }
    );

    // Swagger: { id, fullName, email } — этого достаточно
    const user = toAuthUser(response.data, payload);
    saveUserToStorage(user);

    const token = extractToken(response.data) ?? extractToken(response.headers);

    if (!token) {
      throw new Error("Не удалось получить токен авторизации");
    }

    return { token, user };
  } catch (error) {
    throw toApiError(error, "Не удалось войти");
  }
}

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  try {
    await http.post(
      "/api/auth/register",
      {
        fullName: payload.fullName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        password: payload.password,
      },
      { withCredentials: true }
    );

    // После регистрации логинимся, чтобы получить {id, fullName, email}
    return await login({ email: payload.email, password: payload.password });
  } catch (error) {
    throw toApiError(error, "Не удалось зарегистрироваться");
  }
}

/** Гидратация после F5 — только из localStorage (т.к. /auth/me отсутствует) */
export async function refreshSession(): Promise<AuthSession | null> {
  const user = getUserFromStorage();
  if (user?.fullName) {
    return { token: "session", user };
  }
  return null;
}

/** Выход: если есть /api/auth/logout — дергаем, иначе просто чистим фронт */
export async function logout(): Promise<void> {
  try {
    await http.post("/api/auth/logout", {}, { withCredentials: true }).catch((requestError) => {
      console.warn("Failed to call logout endpoint", requestError);
    });
  } finally {
    saveUserToStorage(undefined);
  }
}
