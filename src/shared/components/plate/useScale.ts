import { useEffect, useRef, useState } from "react";

/** Масштабирует внутреннюю вёрстку под доступную ширину контейнера */
export function useScale(baseWidth: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [k, setK] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const boxSize = entry.contentBoxSize;
      let inlineSize = entry.contentRect.width;

      if (Array.isArray(boxSize)) {
        inlineSize = boxSize[0]?.inlineSize ?? inlineSize;
      } else if (boxSize && typeof boxSize === "object" && "inlineSize" in boxSize) {
        const size = boxSize as unknown as ResizeObserverSize;
        inlineSize = size.inlineSize ?? inlineSize;
      }

      const w = inlineSize || el.clientWidth;
      const scale = (w || el.clientWidth) / baseWidth;
      setK(scale > 0 ? scale : 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);

  return { ref, k };
}
