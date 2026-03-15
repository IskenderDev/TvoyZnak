import { useEffect, useState } from "react";
import { DESKTOP_BREAKPOINT } from "@/shared/config/responsive";

export function useIsMdUp() {
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);

    const handler = () => setIsMdUp(media.matches);
    handler();

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return isMdUp;
}
