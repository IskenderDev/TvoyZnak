const HEX_LOOKUP = Array.from({ length: 256 }, (_, index) => index.toString(16).padStart(2, "0"));

const toHex = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (const byte of bytes) {
    hex += HEX_LOOKUP[byte];
  }
  return hex.toUpperCase();
};

const getCrypto = (): Crypto | null => {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.subtle) {
    return globalThis.crypto;
  }
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    return window.crypto;
  }
  return null;
};

const sha1 = async (value: string): Promise<string | null> => {
  if (!value) return null;
  const api = getCrypto();
  if (!api) return null;
  const encoder = new TextEncoder();
  const encoded = encoder.encode(value);
  const digest = await api.subtle.digest("SHA-1", encoded);
  return toHex(digest);
};

/**
 * Проверяет, был ли пароль найден в публичных базах утечек.
 * Использует k-анонимный API PwnedPasswords (https://haveibeenpwned.com/API/v3#PwnedPasswords).
 * Возвращает true, если пароль скомпрометирован, false — если безопасен или проверка не удалась.
 */
export const isPasswordCompromised = async (password: string): Promise<boolean> => {
  if (!password || password.length < 4) {
    return false;
  }

  try {
    const hash = await sha1(password);
    if (!hash) return false;

    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);
    if (!prefix || !suffix) return false;

    if (typeof fetch !== "function") {
      return false;
    }

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      method: "GET",
      headers: {
        "Add-Padding": "true",
      },
      mode: "cors",
    });

    if (!response.ok) {
      return false;
    }

    const text = await response.text();
    const lines = text.split("\n");
    for (const line of lines) {
      const [hashSuffix] = line.trim().split(":");
      if (hashSuffix && hashSuffix.toUpperCase() === suffix) {
        return true;
      }
    }
  } catch (error) {
    console.warn("Failed to verify password leak status", error);
  }

  return false;
};
