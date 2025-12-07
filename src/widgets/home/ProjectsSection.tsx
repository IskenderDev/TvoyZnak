import { useMemo, useRef, useState } from "react"
import type { ProjectItem } from "./projects"
import { projects } from "./projects"
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6"

type ModalState = {
        open: boolean
        item: ProjectItem | null
}

type Props = { items?: ProjectItem[] }

export default function ProjectsSection({ items }: Props) {
	const data = useMemo(() => items ?? projects, [items])

        const [active, setActive] = useState(0)
        const [modal, setModal] = useState<ModalState>({ open: false, item: null })

        const featured = data[active]
        const railRef = useRef<HTMLDivElement | null>(null)

        const go = (dir: "left" | "right") => {
                const max = data.length - 1
                setActive((prev) => (dir === "left" ? Math.max(0, prev - 1) : Math.min(max, prev + 1)))
        }

        const openModal = (item: ProjectItem) => setModal({ open: true, item })
        const closeModal = () => setModal({ open: false, item: null })

        const shortDescription = (text: string) => {
                if (text.length <= 180) return text
                return `${text.slice(0, 180).trim()}…`
        }

        return (
                <section className=" text-white py-14 md:py-18">
                        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
                             <h2 className="text-center font-bold uppercase text-2xl md:text-4xl tracking-wide">
                                        НАШИ ГОТОВЫЕ РАБОТЫ
                                </h2>

                                <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                                        <div className="rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                                                <div className="aspect-[4/3] md:aspect-[7/6] lg:h-[420px]">
                                                        <img
                                                                src={featured.cover}
                                                                alt={featured.alt ?? featured.title}
                                                                className="w-full h-full object-cover"
                                                                loading="lazy"
                                                        />
                                                </div>
                                        </div>

                                        <div className="relative pb-16 flex flex-col gap-4">
                                             <h3 className="uppercase font-bold text-xl md:text-2xl tracking-wide flex items-center justify-between">
                                                        <span>{featured.title}</span>
                                                        <button
                                                                type="button"
                                                                onClick={() => openModal(featured)}
                                                                className="ml-4 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white hover:text-[#0177FF] transition"
                                                        >
                                                                Полный текст
                                                        </button>
                                                </h3>

                                             <p className="text-neutral-300 leading-relaxed text-sm sm:text-base bg-[#0F0F10] rounded-2xl p-4 shadow-inner">
                                                        {shortDescription(featured.description)}
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
                                                                <div className="rounded-2xl overflow-hidden bg-[#0F0F10] border border-white/5 transition hover:shadow-lg/20 hover:shadow-black">
                                                                        <div className="aspect-[4/3] lg:h-[260px] relative">
                                                                                <img
                                                                                        src={item.cover}
                                                                                        alt={item.alt ?? item.title}
                                                                                        className="w-full h-full object-cover"
                                                                                        loading="lazy"
                                                                                />
                                                                                <div className="absolute inset-x-0 bottom-0 bg-black/50 backdrop-blur-sm px-4 py-2">
                                                                                        <h4 className="text-sm font-bold uppercase">{item.title}</h4>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </article>
                                                )
                                        })}
                                </div>
                        </div>

                        {modal.open && modal.item && (
                                <div
                                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
                                        role="dialog"
                                        aria-modal="true"
                                        aria-label={`История ${modal.item.title}`}
                                        onClick={closeModal}
                                >
                                        <div
                                                className="relative w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl bg-[#0B0B0C] text-white shadow-2xl"
                                                onClick={(e) => e.stopPropagation()}
                                        >
                                                <button
                                                        type="button"
                                                        onClick={closeModal}
                                                        className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold hover:bg-white/20"
                                                >
                                                        Закрыть
                                                </button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-6">
                                                        <div className="rounded-xl overflow-hidden bg-black/20">
                                                                <img
                                                                        src={modal.item.cover}
                                                                        alt={modal.item.alt ?? modal.item.title}
                                                                        className="w-full h-full object-cover"
                                                                />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                                <h3 className="text-xl md:text-2xl font-bold uppercase">{modal.item.title}</h3>
                                                                <p className="text-neutral-200 leading-relaxed text-sm sm:text-base">
                                                                        {modal.item.description}
                                                                </p>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        )}
                </section>
        )
}
