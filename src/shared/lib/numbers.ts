export const sanitizeNumericInput = (value: string): string => value.replace(/[^0-9]/g, "");

export const formatPriceDisplay = (value: number | string): string => {
  const number = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(number)) {
    return "";
  }
  return new Intl.NumberFormat("ru-RU").format(number);
};
