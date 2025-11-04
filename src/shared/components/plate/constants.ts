// constants.ts
export const LETTERS = [
  "A","B","E","K","M","H","O","P","C","T","У","Х", "*"
] as const;

export const DIGITS = [
  "0","1","2","3","4","5","6","7","8","9", "*"
] as const;

export type PlateSize = "lg" | "xs";

export const PRESETS: Record<PlateSize, { w: number; h: number }> = {
  lg: { w: 879, h: 180 },
  xs: { w: 320, h: 70 },
};

// --------------------------------------------------------------
// useScale.ts (без изменений, только для полноты контекста)
import { useEffect, useRef, useState } from "react";
export function useScale(baseWidth: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [k, setK] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth || baseWidth;
      setK(w / baseWidth);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);
  return { ref, k } as const;
}

