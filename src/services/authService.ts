import { isAxiosError } from "axios";
import http from "@/api/http";
import type { AuthSession, AuthUser, Role } from "@/types/auth";

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

const pickUserSource = (payload: unknown): Record<string, unknown> | null => {
  if (!payload || typeof payload !== "object") return null;
  const r = payload as Record<string, unknown>;
  if ("user" in r && r.user && typeof r.user === "object") return r.user as Record<string, unknown>;
  if ("data" in r && r.data && typeof r.data === "object") {
    const d = r.data as Record<string, unknown>;
    if ("user" in d && d.user && typeof d.user === "object") return d.user as Record<string, unknown>;
    return d;
  }
  if ("profile" in r && r.profile && typeof r.profile === "object") return r.profile as Record<string, unknown>;
  return r;
};

const toAuthUser = (
  payload: unknown,
  fallback?: Partial<RegisterPayload> & Partial<LoginPayload>,
): AuthUser => {
  const src = pickUserSource(payload) ?? {};

  const fullNameCandidate = (src as any).fullName ?? (src as any).name ?? (src as any).username;
  const emailCandidate    = (src as any).email    ?? (src as any).mail ?? (src as any).login;
  const phoneCandidate    = (src as any).phoneNumber ?? (src as any).phone ?? (src as any).phone_number;
  const idCandidate       = (src as any).id ?? (src as any).userId ?? (src as any).userID ?? (src as any)._id;

  const rawRoles = (src as any).roles ?? (src as any).role ?? (src as any).authorities;
  const roles: Role[] = [];
  if (Array.isArray(rawRoles)) {
    for (const item of rawRoles) {
      const n = normalizeRole(item);
      if (n) roles.push(n);
    }
  } else if (rawRoles) {
    const n = normalizeRole(rawRoles);
    if (n) roles.push(n);
  }

    // было:
  // const finalRoles = dedupeRoles(roles);
  // const primaryRole = finalRoles[0] ?? "user";

  // стало:
  const finalRoles = (roles.length > 0 ? dedupeRoles(roles) : inferAdminByEmail(emailCandidate));
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
};// --- Админы (белый список) ---
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
    if (typeof data === "string" && data.trim()) return new Error(data);
    if (data && typeof data === "object") {
      const m =
        (typeof (data as any).message === "string" && (data as any).message.trim())
          ? (data as any).message
          : (typeof (data as any).error === "string" && (data as any).error.trim())
            ? (data as any).error
            : null;
      if (m) return new Error(m);
    }
    if (error.message) return new Error(error.message);
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
  } catch {}
};

export const getUserFromStorage = (): AuthUser | undefined => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as AuthUser;
  } catch {
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

    // Маркер режима: токена нет, но тип требует строку
    return { token: "session", user };
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
    await http.post("/api/auth/logout", {}, { withCredentials: true }).catch(() => {});
  } finally {
    saveUserToStorage(undefined);
  }
}
