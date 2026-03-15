import { useEffect, useState } from "react";

const MD_LAYOUT_QUERY =
  "(min-width: 768px) and (min-height: 500px), (min-width: 768px) and (hover: hover), (min-width: 768px) and (pointer: fine)";

export function useIsMdUp() {
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(MD_LAYOUT_QUERY);

    const handler = () => setIsMdUp(media.matches);
    handler();

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return isMdUp;
}
