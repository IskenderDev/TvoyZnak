export default function WhyChooseUs() {
	const cardBase =
		"rounded-[16px] border border-white/5 bg-white/5 backdrop-blur-[2px] " +
		"text-[12px] md:text-[14px] leading-[1.5] px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.25)] " +
		"max-w-[260px] md:max-w-[360px]"


	return (
		<section className="relative text-white py-10 md:py-14" aria-label="Почему выбирают нас">
			<div className="max-w-[1120px] mx-auto px-6 md:px-10">
				<header className="text-center">
					<h2 className="text-[22px] md:text-[36px] font-extrabold tracking-[0.06em] uppercase">
						ПОЧЕМУ ВЫБИРАЮТ НАС
					</h2>
				</header>

				<div className="relative mx-auto mt-6 md:mt-8">
					<div className="relative mt-4 md:mt-6 rounded-[26px] px-4 md:px-8 py-10 md:py-14 bg-[url('/about-img/circles.svg')] bg-center bg-no-repeat bg-contain">
						<ul className="grid grid-cols-1 gap-y-4 md:gap-y-6">
							<li
								role="note"
								aria-label="Официальные сделки через МРЭО с внесением данных в ПТС и СТС"
								className={`${cardBase} justify-self-end md:translate-x-6`}
							>
								Все сделки проходят официально через МРЭО, с внесением данных в ПТС и СТС.
							</li>

							<li
								role="note"
								aria-label="Оценка реальной стоимости и выкуп за 1 день"
								className={`${cardBase} justify-self-start md:-translate-x-6`}
							>
								Определяем реальную стоимость номера и выкупаем его за 1 день.
							</li>

							<li
								role="note"
								aria-label="Поиск редких комбинаций по вашим критериям"
								className={`${cardBase} justify-self-end md:translate-x-6`}
							>
								Находим редкие комбинации по вашим критериям: цифры, буквы, регион.
							</li>

							<li
								role="note"
								aria-label="Более 200 актуальных и уникальных комбинаций"
								className={`${cardBase} justify-self-start md:-translate-x-6`}
							>
								Более 200 актуальных и уникальных комбинаций на любой вкус.
							</li>

							<li
								role="note"
								aria-label="Полное юридическое сопровождение сделок"
								className={`${cardBase} justify-self-end md:translate-x-6`}
							>
								Все сделки сопровождаются юридически, гарантируя полную защиту
								интересов клиента.
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	)
}
