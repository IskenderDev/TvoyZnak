import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import type { ProjectItem } from "./projects"
import { projects } from "./projects"

type Props = { items?: ProjectItem[] }

export default function ProjectsSection({ items }: Props) {
  const data = useMemo(() => items ?? projects, [items])

  const autoplay = useRef(
    Autoplay({
      delay: 3500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      containScroll: false,
      dragFree: false,
      watchDrag: true,
    },
    [autoplay.current]
  )

  const [active, setActive] = useState(0)
  const [count, setCount] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setActive(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    setCount(emblaApi.scrollSnapList().length)
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  const scrollTo = (i: number) => {
    emblaApi?.scrollTo(i)
    autoplay.current.reset()
  }

  return (
    <section className="py-12 md:py-16 text-white">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        {/* approx font-size: 26/34 */}
        <h2 className="mb-8 md:mb-10 text-center text-[22px] md:text-[30px] font-extrabold tracking-[0.08em] uppercase">
          НАШИ ГОТОВЫЕ РАБОТЫ
        </h2>

        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-6 px-6">
              {data.map((item) => (
                <div key={item.id} className="shrink-0 w-[86%] sm:w-[48%] lg:w-[32%]">
                  <article className="relative overflow-hidden rounded-[18px] bg-[#141414] border border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
                    <div className="h-[230px] overflow-hidden">
                      <img
                        src={item.cover}
                        alt={item.alt ?? item.title}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.05]"
                        loading="lazy"
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="relative z-10 px-4 py-4 min-h-[170px]">
                      <h3 className="text-[12px] md:text-[13px] font-semibold tracking-[0.08em] uppercase">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[12px] md:text-[13px] text-white/80 leading-[1.6]">
                        {item.description}
                      </p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-2 w-2 rounded-full transition ${
                active === i ? "bg-[#1E63FF]" : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
