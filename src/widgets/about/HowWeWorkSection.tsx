export default function HowWeWorkSection() {
	return (
		<section className="relative text-white py-12 md:py-16" aria-label="Как мы работаем">
			<div className="max-w-[1100px] mx-auto px-6 md:px-10">
				<header className="text-center">
					<h2 className="text-2xl md:text-4xl font-extrabold tracking-wide font-actay-wide">
						КАК МЫ РАБОТАЕМ
					</h2>
					<p className="text-[#A7C6FF] text-sm md:text-base mt-1">Просто, быстро и безопасно.</p>
				</header>

				<div className="relative bg-[#0177FF] rounded-[26px] md:rounded-[28px] mt-6 md:mt-8 px-5 md:px-8 py-6 md:py-10">
					{/* Сетка шагов */}
					<div className="relative flex flex-col gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
						{/* 1 */}
						<div className='flex gap-4 md:gap-6 items-center'>
							<div
								aria-hidden="true"
								className="
                relative w-[60px] md:w-[90px] pr-2 md:pr-3 text-right
                text-6xl md:text-9xl font-extrabold leading-none text-white/95 select-none font-actay-druk 
                after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2
                after:top-full after:h-full after:my-2 md:after:h-12 after:border-l-4 after:border-dashed after:border-white
              "
							>
								1
							</div>
							<article aria-labelledby="step1-title">
								<h3 id="step1-title" className="font-semibold text-base md:text-lg">Оставляете заявку</h3>
								<p className="text-white/90 text-sm md:text-[15px] leading-relaxed mt-1">
									Заполняйте форму на сайте или свяжитесь с нами через мессенджеры — мы сразу уточним ваши пожелания.
								</p>
							</article></div>
						<div className='flex gap-4 md:gap-6 items-center'>
							{/* 2 */}
							<div
								aria-hidden="true"
								className="
                relative w-[60px] md:w-[90px] pr-2 md:pr-3 text-right
                text-6xl md:text-9xl font-extrabold leading-none text-white/95 select-none font-actay-druk
                after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2
                after:top-full after:h-full after:my-2 md:after:h-12 after:border-l-4 after:border-dashed after:border-white
              "
							>
								2
							</div>
							<article aria-labelledby="step2-title">
								<h3 id="step2-title" className="font-semibold text-base md:text-lg">Консультация и подбор</h3>
								<p className="text-white/90 text-sm md:text-[15px] leading-relaxed mt-1">
									Наши специалисты оценят ваш номер или подберут редкую комбинацию по вашим критериям: цифры, буквы, регион.
								</p>
							</article></div>
						<div className='flex gap-4 md:gap-6 items-center'>
							{/* 3 */}
							<div
								aria-hidden="true"
								className="
                relative w-[60px] md:w-[90px] pr-2 md:pr-3 text-right
                text-6xl md:text-9xl font-extrabold leading-none text-white/95 select-none font-actay-druk
                after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2
                after:top-full after:h-full after:my-2 md:after:h-12 after:border-l-4 after:border-dashed after:border-white
              "
							>
								3
							</div>
							<article aria-labelledby="step3-title">
								<h3 id="step3-title" className="font-semibold text-base md:text-lg">Сделка и оформление</h3>
								<p className="text-white/90 text-sm md:text-[15px] leading-relaxed mt-1">
									Все документы оформляются официально через МРЭО, с внесением данных в ПТС и СТС.
								</p>
							</article></div>
						<div className='flex gap-4 md:gap-6 items-center'>
							{/* 4 */}
							<div
								aria-hidden="true"
								className="
                relative w-[60px] md:w-[90px] pr-2 md:pr-3 text-right
                text-6xl md:text-9xl font-extrabold leading-none text-white/95 select-none font-actay-druk
                after:hidden
              "
							>
								4
							</div>
							<article aria-labelledby="step4-title">
								<h3 id="step4-title" className="font-semibold text-base md:text-lg">Готовый результат</h3>
								<p className="text-white/90 text-sm md:text-[15px] leading-relaxed mt-1">
									Вы получаете выбранный номер или деньги за проданный номер быстро, безопасно и без лишних хлопот.
								</p>
							</article></div>
					</div>
				</div>
			</div>
		</section>
	)
}
