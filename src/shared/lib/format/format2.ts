export function format2(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  const raw = String(value).trim();
  if (!raw) {
    return "";
  }

  const negative = raw.startsWith("-");
  const digits = negative ? raw.slice(1) : raw;

  if (!/^\d+$/.test(digits)) {
    return raw;
  }

  if (digits.length >= 2) {
    return raw;
  }

  const padded = digits.padStart(2, "0");
  return negative ? `-${padded}` : padded;
}

