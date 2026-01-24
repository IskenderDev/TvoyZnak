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
    <section className="py-16 text-white">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <h2 className="mb-10 text-center text-2xl md:text-4xl font-semibold tracking-wide uppercase">
          Наши готовые работы
        </h2>

        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-6 pl-6 pr-6">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="shrink-0 w-[82%] sm:w-[48%] lg:w-[32%]"
                >
                  <article className="relative overflow-hidden rounded-2xl bg-[#131313] transition-transform duration-300 ">
                    <div className="h-[300px] overflow-hidden">
                      <img
                        src={item.cover}
                        alt={item.alt ?? item.title}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.05]"
                        loading="lazy"
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

                    <div className="relative z-10 p-5 h-[260px]">
                      <h3 className="text-sm md:text-base font-semibold tracking-wide uppercase">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-2.5 w-2.5 rounded-full transition
                ${
                  active === i
                    ? "bg-[#1E63FF]"
                    : "bg-white/30 hover:bg-white/50"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
