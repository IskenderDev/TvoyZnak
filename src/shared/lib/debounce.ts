export type DebouncedFunction<T extends (...args: never[]) => unknown> = (
  ...args: Parameters<T>
) => void;

export const debounce = <T extends (...args: never[]) => unknown>(
  fn: T,
  delay: number,
): DebouncedFunction<T> => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

