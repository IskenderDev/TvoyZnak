const PHONE_REGEXP = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/u;

const sliceDigits = (digits: string, start: number, end: number): string =>
  digits.slice(start, end);

export const formatPhoneNumber = (rawValue: string): string => {
  const digits = rawValue.replace(/\D/g, "").replace(/^8/, "7");
  const normalized = digits.startsWith("7") ? digits : `7${digits}`;
  const parts = [
    "+7",
    `(${sliceDigits(normalized, 1, 4)}`,
    sliceDigits(normalized, 4, 7),
    sliceDigits(normalized, 7, 9),
    sliceDigits(normalized, 9, 11),
  ];

  const area = parts[1];
  const prefix = parts[2];
  const lineFirst = parts[3];
  const lineSecond = parts[4];

  let result = `${parts[0]}${area.length ? ` ${area}${area.length === 3 ? ")" : ""}` : ""}`;
  if (prefix) {
    result += ` ${prefix}`;
  }
  if (lineFirst) {
    result += `-${lineFirst}`;
  }
  if (lineSecond) {
    result += `-${lineSecond}`;
  }

  return result.trim();
};

export const isValidPhoneNumber = (value: string): boolean => PHONE_REGEXP.test(value);

export { PHONE_REGEXP };
