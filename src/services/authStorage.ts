import type { AuthSession } from "@/types/auth";

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

const getStorage = (): Storage | null => {
  if (!isBrowser) return null;
  try {
    return window.localStorage;
  } catch (error) {
    console.warn("LocalStorage is unavailable", error);
    return null;
  }
};

export const authStorage = {
  load(): AuthSession | null {
    const storage = getStorage();
    if (!storage) return null;
    return safeParse(storage.getItem(STORAGE_KEY));
  },

  save(session: AuthSession | null) {
    const storage = getStorage();
    if (!storage) return;
    if (session) {
      storage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      storage.removeItem(STORAGE_KEY);
    }
  },

  getToken(): string | null {
    const session = this.load();
    return session?.token ?? null;
  },

  clear() {
    const storage = getStorage();
    if (!storage) return;
    storage.removeItem(STORAGE_KEY);
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
