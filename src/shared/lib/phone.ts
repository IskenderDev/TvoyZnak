export const PHONE_DIGITS_COUNT = 11;

export const normalizePhone = (formatted: string): string => formatted.replace(/\D/g, "").slice(0, PHONE_DIGITS_COUNT);

export const isPhoneComplete = (value: string): boolean => normalizePhone(value).length === PHONE_DIGITS_COUNT;

export const formatPhone = (raw: string): string => {
  const digits = normalizePhone(raw);

  const country = digits.slice(0, 1);
  const area = digits.slice(1, 4);
  const first = digits.slice(4, 7);
  const second = digits.slice(7, 9);
  const third = digits.slice(9, 11);

  if (!country) {
    return "";
  }

  let result = `+${country}`;

  if (area.length) {
    result += ` ${area}`;
  }

  if (first.length) {
    result += ` ${first}`;
  }

  if (second.length) {
    result += `-${second}`;
  }

  if (third.length) {
    result += `-${third}`;
  }

  return result;
};
