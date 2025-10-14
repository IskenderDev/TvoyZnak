import { useEffect, useRef, useState } from "react";

/** Масштабирует внутреннюю вёрстку под доступную ширину контейнера */
export function useScale(baseWidth: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [k, setK] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w =
        (Array.isArray(entry.contentBoxSize)
          ? entry.contentBoxSize[0]?.inlineSize
          : (entry as any).contentBoxSize?.inlineSize) ?? entry.contentRect.width;
      const scale = (w || el.clientWidth) / baseWidth;
      setK(scale > 0 ? scale : 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);

  return { ref, k };
}
