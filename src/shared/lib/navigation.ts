const ensurePrefixedSearch = (search: string): string => {
  if (!search) return "";
  return search.startsWith("?") ? search : `?${search}`;
};

const sanitizeNext = (value: string | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//iu.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      if (typeof window !== "undefined" && window.location?.origin === url.origin) {
        return `${url.pathname}${url.search}${url.hash}` || "/";
      }
      return null;
    } catch (error) {
      console.warn("Failed to parse next URL", error);
      return null;
    }
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return null;
};

export const parseNextParam = (search: string): string | null => {
  const params = new URLSearchParams(ensurePrefixedSearch(search));
  const raw = params.get("next");
  return sanitizeNext(raw);
};

export const buildNextSearch = (next?: string | null): string => {
  const safeNext = sanitizeNext(next ?? null);
  if (!safeNext) {
    return "";
  }
  const params = new URLSearchParams();
  params.set("next", safeNext);
  return params.toString();
};

export const resolveNextPath = (next: string | null | undefined, fallback: string): string => {
  const safeNext = sanitizeNext(next);
  return safeNext ?? fallback;
};

export const buildCurrentPath = (
  pathname: string,
  search = "",
  hash = "",
): string => {
  const normalizedSearch = search.startsWith("?") ? search : search ? `?${search}` : "";
  const normalizedHash = hash.startsWith("#") ? hash : hash ? `#${hash}` : "";
  return `${pathname}${normalizedSearch}${normalizedHash}`;
};

export { sanitizeNext };
