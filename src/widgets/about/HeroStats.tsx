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
			className={`relative z-0 text-white ${className}`}
			aria-label="Красивые номера — безопасные сделки"
		>
			<div className="mx-auto max-w-[1200px] px-6 md:px-10 pt-12 md:pt-16 pb-14 md:pb-24">
				<header className="text-center">
					<h2 className="text-[26px] md:text-[36px] font-bold uppercase tracking-[0.02em] leading-[1.15]">
						КРАСИВЫЕ <span className="text-[#0177FF]">АВТОНОМЕРА</span> — ВАШ СТАТУС НА ДОРОГЕ
					</h2>
					<p className="mt-4 md:mt-5 text-[#C8C8C8] text-[14px] md:text-[18px] leading-[1.7] max-w-[880px] mx-auto">
						Мы оцениваем уникальные комбинации, выкупаем номера по выгодной цене и подбираем
						идеальный вариант под ваши пожелания. С нами покупка и продажа номеров становится
						простой, прозрачной и надёжной.
					</p>
				</header>

				<div className="relative my-10">
					<img
						src={carSrc}
						alt="Черный автомобиль — визуальный акцент секции"
						className="relative left-1/2 -translate-x-1/2  w-auto lg:h-[300px] z-30 "
					/>
				</div>

				<div className="relative z-10">
					<div className="bg-[#1C1C1C] rounded-[26px] px-6 md:px-8 py-6 md:py-8 ">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
							<article className="relative rounded-[18px] p-6 md:p-7 bg-[#0177FF] text-white">
								<BsArrowUpRightCircleFill
									aria-hidden
									className="absolute top-4 right-4 opacity-90 w-6 h-6 md:w-7 md:h-7"
								/>
								<h3 className="text-[36px] md:text-[48px] font-extrabold leading-none">
									500+
								</h3>
								<p className="mt-3 text-white/90 text-[13px] md:text-[14px] leading-[1.5]">
									сделок по выкупу
									<br className="hidden md:block" /> и продаже номеров.
								</p>
							</article>

							<article className="rounded-[18px] p-6 md:p-7 bg-[#F4F5F7] text-black">
								<h3 className="text-[28px] md:text-[36px] font-extrabold text-[#151515] leading-none">
									Более 200
								</h3>
								<p className="mt-3 text-[#4A4A4A] text-[13px] md:text-[14px] leading-[1.5]">
									Более 200 уникальных комбинаций в каталоге на любой вкус.
								</p>
							</article>

							<article className="rounded-[18px] p-6 md:p-7 bg-[#F4F5F7] text-black">
								<h3 className="text-[28px] md:text-[36px] font-extrabold text-[#151515] leading-none">
									1 день
								</h3>
								<p className="mt-3 text-[#4A4A4A] text-[13px] md:text-[14px] leading-[1.5]">
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
