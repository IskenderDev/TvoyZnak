import { useEffect, useMemo, useRef, useState } from "react"
import type { ProjectItem } from "./projects"
import { projects } from "./projects"
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6"

type Props = { items?: ProjectItem[] }

export default function ProjectsSection({ items }: Props) {
  const data = useMemo(() => items ?? projects, [items])
  const [active, setActive] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrollSetRef = useRef(false)

  const featured = data[active]
  const max = data.length - 1

  const setActiveSafe = (idx: number) => {
    setActive(idx)
    setMobileOpen(false)
  }

  const goPrev = () => setActiveSafe(Math.max(0, active - 1))
  const goNext = () => setActiveSafe(Math.min(max, active + 1))

  useEffect(() => {
    const container = listRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      let closestIdx = active
      let minDelta = Infinity

      itemRefs.current.forEach((el, idx) => {
        if (!el) return
        const delta = Math.abs(el.offsetLeft - scrollLeft)

        if (delta < minDelta) {
          minDelta = delta
          closestIdx = idx
        }
      })

      setActive((prev) => {
        if (closestIdx !== prev) {
          scrollSetRef.current = true
          return closestIdx
        }
        return prev
      })
    }

    handleScroll()
    container.addEventListener("scroll", handleScroll, { passive: true })

    return () => container.removeEventListener("scroll", handleScroll)
  }, [active])

  useEffect(() => {
    if (scrollSetRef.current) {
      scrollSetRef.current = false
      return
    }

    const container = listRef.current
    const target = itemRefs.current[active]

    if (container && target) {
      target.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })
    }
  }, [active])

  return (
    <section className="text-white py-14 md:py-18">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <h2 className="text-center font-bold uppercase text-2xl md:text-4xl tracking-wide">
          НАШИ ГОТОВЫЕ РАБОТЫ
        </h2>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="text-left rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.25)] relative"
          >
            <div className="aspect-[7/6] md:aspect-[7/6] lg:h-[420px] overflow-hidden">
              <img
                src={featured.cover}
                alt={featured.alt ?? featured.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="absolute inset-x-0 top-0  p-4 md:p-6 bg-linear-180 from-gray-800 to-transparent">
              <div className="absolute inset-0" />
              <h3 className="relative z-10 uppercase font-bold text-lg md:text-2xl tracking-wide">
                {featured.title}
              </h3>
              <div className="relative z-10 mt-2 md:hidden text-xs font-bold uppercase tracking-wide text-white/90">
                {mobileOpen ? "Нажмите, чтобы скрыть" : "Нажмите, чтобы читать описание"}
              </div>
            </div>
          </button>

          <div className="relative pb-16 flex flex-col gap-4">
            <p className="hidden lg:block text-neutral-300 leading-relaxed text-sm sm:text-base bg-[#0F0F10] rounded-2xl p-4 shadow-inner">
              {featured.description}
            </p>

            <div className="">
              <dl className="mt-2 space-y-2 text-sm md:text-lg text-white font-extrabold tracking-wide uppercase">
                ХОТИТЕ ТАКОЙ ЖЕ? — ПОДБЕРЕМ!
              </dl>
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex justify-between">
              <button
                aria-label="Показать предыдущую карточку"
                onClick={goPrev}
                className="w-11 h-11 grid place-items-center bg-[#1E63FF] hover:opacity-90 transition disabled:opacity-40"
                disabled={active === 0}
              >
                <FaArrowLeftLong className="w-5 h-5" />
              </button>
              <button
                aria-label="Показать следующую карточку"
                onClick={goNext}
                className="w-11 h-11 grid place-items-center bg-[#1E63FF] hover:opacity-90 transition disabled:opacity-40"
                disabled={active === max}
              >
                <FaArrowRightLong className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="lg:hidden -mt-2">
            <div
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
                mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="bg-[#0F0F10] rounded-2xl p-4 shadow-inner">
                <p className="text-neutral-300 leading-relaxed text-sm">
                  {featured.description}
                </p>
            
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          <div
            ref={listRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 [-ms-overflow-style:none] [scrollbar-width:none] hide-scroll"
          >
            <style>{`.hide-scroll::-webkit-scrollbar{display:none}`}</style>

            {data.map((item, idx) => (
              <article
                key={item.id}
                ref={(el) => (itemRefs.current[idx] = el)}
                onClick={() => setActiveSafe(idx)}
                className="min-w-[78%] sm:min-w-[48%] md:min-w-[38%] lg:min-w-[30%] snap-start cursor-pointer"
              >
                <div
                  className={`rounded-2xl overflow-hidden bg-[#0F0F10] border border-white/5 transition hover:shadow-lg/20 hover:shadow-black relative ${
                    active === idx ? "ring-2 ring-[#1E63FF]" : ""
                  }`}
                >
                  <div className="aspect-[4/3] lg:h-[260px] overflow-hidden">
                    <img
                      src={item.cover}
                      alt={item.alt ?? item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                    <div className="relative z-10 uppercase font-bold text-sm tracking-wide">
                      {item.title}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            {data.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Показать проект ${idx + 1}`}
                onClick={() => setActiveSafe(idx)}
                className={`h-3 w-3 rounded-full border border-white/20 transition ${
                  active === idx ? "bg-[#1E63FF] border-[#1E63FF]" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
