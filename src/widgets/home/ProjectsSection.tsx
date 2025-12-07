import { useMemo, useRef, useState } from "react"
import type { ProjectItem } from "./projects"
import { projects } from "./projects"
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6"

type Props = { items?: ProjectItem[] }

export default function ProjectsSection({ items }: Props) {
	const data = useMemo(() => items ?? projects, [items])

	const [active, setActive] = useState(0)

	const featured = data[active]
	const railRef = useRef<HTMLDivElement | null>(null)

        const go = (dir: "left" | "right") => {
                const max = data.length - 1
                setActive((prev) => (dir === "left" ? Math.max(0, prev - 1) : Math.min(max, prev + 1)))
        }

	return (
		<section className=" text-white py-14 md:py-18">
			<div className="max-w-[1200px] mx-auto px-6 md:px-10">
                             <h2 className="text-center font-bold uppercase text-2xl md:text-4xl tracking-wide">
					НАШИ ГОТОВЫЕ РАБОТЫ
				</h2>

				<div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
					<div className="rounded-2xl overflow-hidden">
						<div className="aspect-[3/4] md:aspect-[7/6] lg:h-[470px]">
							<img
								src={featured.cover}
								alt={featured.alt ?? featured.title}
								className="w-full h-full object-cover"
								loading="lazy"
							/>
						</div>
					</div>

					<div className="relative pb-16">
                                             <h3 className="uppercase font-bold text-xl md:text-2xl tracking-wide">
							{featured.title}
						</h3>

                                             <p className="text-neutral-300 mt-4 leading-relaxed">
							{featured.description}
						</p>

                                             <dl className="mt-6 space-y-2 text-sm md:text-lg text-white font-extrabold tracking-wide uppercase">
							ХОТИТЕ ТАКОЙ ЖЕ? — ПОДБЕРЕМ!
						</dl>

						<div className="absolute bottom-0 left-0 right-0 flex justify-between">
							<button
								aria-label="Показать предыдущую карточку"
								onClick={() => go("left")}
								className="w-11 h-11 grid place-items-center bg-[#1E63FF] hover:opacity-90 transition disabled:opacity-40"
								disabled={active === 0}
							>
								<FaArrowLeftLong className="w-5 h-5" />
							</button>
							<button
								aria-label="Показать следующую карточку"
								onClick={() => go("right")}
								className="w-11 h-11 grid place-items-center bg-[#1E63FF] hover:opacity-90 transition disabled:opacity-40"
								disabled={active === data.length - 1}
							>
								<FaArrowRightLong className="w-5 h-5" />
							</button>
						</div>
					</div>

				</div>

				<div
					ref={railRef}
					className="mt-10 flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 [-ms-overflow-style:none] [scrollbar-width:none]"
				>
					<style>{`.hide-scroll::-webkit-scrollbar{display:none}`}</style>

					{data.slice(1).map((item, i) => {
						const indexInData = i + 1
						return (
							<article
								key={item.id}
								data-card="true"
								onClick={() => setActive(indexInData)}
								className="min-w-[78%] sm:min-w-[48%] md:min-w-[38%] lg:min-w-[30%] snap-start cursor-pointer"
							>
								<div
									className={
										"rounded-2xl overflow-hidden transition hover:shadow-lg/20 hover:shadow-black "
									}
								>
									<div className="aspect-[3/4] lg:h-[420px]">
										<img
											src={item.cover}
											alt={item.alt ?? item.title}
											className="w-full h-full object-cover"
											loading="lazy"
										/>
									</div>
								</div>
							</article>
						)
					})}
				</div>
			</div>
		</section>
	)
}
