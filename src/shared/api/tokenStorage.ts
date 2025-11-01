const TOKEN_KEY = "authToken";

let inMemoryToken: string | null = null;

const readFromStorage = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const value = window.localStorage.getItem(TOKEN_KEY);
    return value && value.trim() ? value : null;
  } catch (error) {
    console.warn("Failed to read auth token", error);
    return null;
  }
};

export const getAuthToken = (): string | null => {
  if (inMemoryToken) {
    return inMemoryToken;
  }
  const stored = readFromStorage();
  inMemoryToken = stored;
  return stored;
};

export const setAuthToken = (token: string | null) => {
  inMemoryToken = token;
  if (typeof window === "undefined") {
    return;
  }
  try {
    if (token && token.trim()) {
      window.localStorage.setItem(TOKEN_KEY, token.trim());
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    console.warn("Failed to persist auth token", error);
  }
};

export const clearAuthToken = () => {
  setAuthToken(null);
};
