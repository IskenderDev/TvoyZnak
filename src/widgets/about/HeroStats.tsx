// components/HeroStats.tsx
import { BsArrowUpRightCircleFill } from "react-icons/bs"

type Props = {
	carSrc?: string
	className?: string
}

export default function HeroStats({
        carSrc = "/about-img/car.png",
        className = "",
}: Props) {
        return (
                <section
                        className={`relative z-0 bg-background text-foreground ${className}`}
                        aria-label="Красивые номера — безопасные сделки"
                >
			<div className="max-w-screen mx-auto px-6 md:px-10 pt-14 md:pt-18 pb-14 md:pb-28">
				<header className="text-center">
                                        <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide leading-tight font-actay-wide">
                                                КРАСИВЫЕ <span className="text-primary-200">НОМЕРА</span>, БЕЗОПАСНЫЕ
						<br className="hidden md:block" />
						<span className="block md:inline"> СДЕЛКИ, ВАШ СТАТУС НА ДОРОГЕ</span>
					</h2>

					<p className="mt-5 md:mt-6 text-neutral-300 text-base md:text-lg leading-relaxed max-w-[900px] mx-auto">
						Мы оцениваем уникальные комбинации, выкупаем номера по выгодной цене и
						подбираем идеальный вариант под ваши пожелания. С нами покупка и продажа номеров
						становится простой, прозрачной и надёжной.
					</p>
				</header>

				<div className="relative my-10 ">
					<div className="h-30 md:h-72 lg:h-80" aria-hidden />
					<img src={carSrc} alt="Черный автомобиль — визуальный акцент секции" className=" absolute left-1/2 -translate-x-1/2 -top-10 w-auto h-auto md:h-96 lg:h-[400px] z-30 drop-shadow-xl " />
				</div>
                                <div className="relative z-10 -mt-10 md:-mt-16 lg:-mt-20">
                                        <div className="rounded-[28px] bg-surface-muted/90 px-6 py-7 md:px-8 md:py-9 ">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 ">
                                                        <article className="relative rounded-[18px] bg-primary-500 p-6 text-primary-foreground md:p-8">
								<BsArrowUpRightCircleFill
									aria-hidden
									className="absolute top-4 right-4 opacity-90 w-6 h-6 md:w-8 md:h-8"
								/>
								<h3 className="text-4xl md:text-6xl font-extrabold font-actay-druk">
									500+
								</h3>
								<p className="mt-4 text-neutral-100 text-sm md:text-base">
									сделок по оценке, выкупу
									<br className="hidden md:block" /> и продаже номеров.
								</p>
							</article>

                                                        <article className="rounded-[18px] bg-surface p-6 text-foreground md:p-8 ">
                                                                <h3 className="text-3xl md:text-5xl font-extrabold font-actay-druk">
									Более 200
								</h3>
								<p className="mt-4 text-neutral-600 text-sm md:text-base">
									Более 2000 уникальных комбинаций в каталоге на любой вкус.
								</p>
							</article>

                                                        <article className="rounded-[18px] bg-surface p-6 text-foreground md:p-8 ">
                                                                <h3 className="text-3xl md:text-5xl font-extrabold font-actay-druk">
									1 день
								</h3>
								<p className="mt-4 text-neutral-600 text-sm md:text-base">
									Выкуп номеров за 1 день с полным юридическим сопровождением.
								</p>
							</article>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
