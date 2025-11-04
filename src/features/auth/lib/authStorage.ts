import type { AuthSession } from "@/entities/session/model/auth";

const STORAGE_KEY = "auth:session";
const LOGOUT_EVENT = "auth:logout";

type StoredValue = AuthSession;

const isBrowser = typeof window !== "undefined";

const safeParse = (value: string | null): StoredValue | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as StoredValue;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    if (typeof parsed.token !== "string" || !parsed.token) {
      return null;
    }
    if (!parsed.user || typeof parsed.user !== "object") {
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn("Failed to parse stored auth session", error);
    return null;
  }
};

const getStorage = (type: "local" | "session"): Storage | null => {
  if (!isBrowser) return null;
  try {
    return type === "session" ? window.sessionStorage : window.localStorage;
  } catch (error) {
    console.warn(`${type === "session" ? "SessionStorage" : "LocalStorage"} is unavailable`, error);
    return null;
  }
};

const loadFrom = (storage: Storage | null): StoredValue | null => {
  if (!storage) return null;
  return safeParse(storage.getItem(STORAGE_KEY));
};

interface SaveOptions {
  remember?: boolean;
}

export const authStorage = {
  load(): AuthSession | null {
    const local = loadFrom(getStorage("local"));
    if (local) {
      return local;
    }
    return loadFrom(getStorage("session"));
  },

  save(session: AuthSession | null, options: SaveOptions = {}) {
    const preferSession = options.remember === false;
    const primary = getStorage(preferSession ? "session" : "local");
    const secondary = getStorage(preferSession ? "local" : "session");

    if (!primary && !secondary) {
      return;
    }

    if (!session) {
      primary?.removeItem(STORAGE_KEY);
      secondary?.removeItem(STORAGE_KEY);
      return;
    }

    const serialized = JSON.stringify(session);
    primary?.setItem(STORAGE_KEY, serialized);
    secondary?.removeItem(STORAGE_KEY);
  },

  clear() {
    const local = getStorage("local");
    const session = getStorage("session");
    local?.removeItem(STORAGE_KEY);
    session?.removeItem(STORAGE_KEY);
  },

  emitLogout() {
    if (!isBrowser) return;
    window.dispatchEvent(new CustomEvent(LOGOUT_EVENT));
  },

  subscribe(callback: () => void) {
    if (!isBrowser) return () => undefined;
    const handler = () => {
      callback();
    };
    window.addEventListener(LOGOUT_EVENT, handler);
    return () => {
      window.removeEventListener(LOGOUT_EVENT, handler);
    };
  },
};

export { LOGOUT_EVENT };
