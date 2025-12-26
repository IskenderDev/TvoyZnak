import { useCallback, useEffect, useState } from "react"

export function getStableViewportWidth(): number {
  if (typeof window === "undefined") return 1024

  const vv = window.visualViewport?.width
  if (typeof vv === "number" && Number.isFinite(vv) && vv > 0) return vv

  const cw = document.documentElement?.clientWidth
  if (typeof cw === "number" && Number.isFinite(cw) && cw > 0) return cw

  return window.innerWidth
}

export function useStableViewportWidth() {
  const [width, setWidth] = useState<number>(() => getStableViewportWidth())

  const recalc = useCallback(() => {
    setWidth(getStableViewportWidth())
  }, [])

  useEffect(() => {
    const onResize = () => recalc()

    window.addEventListener("resize", onResize)
    window.addEventListener("orientationchange", onResize)

    const vv = window.visualViewport
    vv?.addEventListener("resize", onResize)
    vv?.addEventListener("scroll", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("orientationchange", onResize)
      vv?.removeEventListener("resize", onResize)
      vv?.removeEventListener("scroll", onResize)
    }
  }, [recalc])

  return { width, recalc }
}
