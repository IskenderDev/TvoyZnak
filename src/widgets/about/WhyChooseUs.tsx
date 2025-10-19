// components/WhyChooseUs.tsx

export default function WhyChooseUs() {
	const cardBase =
		"rounded-xl border border-[#D2D2D2] bg-[#FFFFFF1A] backdrop-blur-[2px] " +
		"text-[14px] md:text-[24px] p-1 md:p-4 " +
		"max-w-[250px] md:max-w-[450px] "

	return (
		<section className="relative text-white py-9 md:py-12" aria-label="Почему выбирают нас">
			<div className="max-w-[1120px] mx-auto px-6 md:px-10">
				<h2 className="text-center text-2xl md:text-5xl font-extrabold tracking-wide font-actay-wide">
					ПОЧЕМУ ВЫБИРАЮТ НАС
				</h2>
				<div className="relative mx-auto mt-6 md:mt-8">
					<div
						className="relative mt-6 md:mt-8 rounded-[22px] md:rounded-[26px] px-4 md:px-8 py-10 md:py-14"
						style={{
							backgroundImage: "url('/about-img/circles.svg')",
							backgroundRepeat: "no-repeat",
							backgroundPosition: "center",
							backgroundSize: "contain",
						}}
					>

						<ul className="grid grid-cols-1 gap-y-3 md:gap-y-4">
							<li
								role="note"
								aria-label="Официальные сделки через МРЭО с внесением данных в ПТС и СТС"
								className={`${cardBase} justify-self-end -mr-10`}
							>
								Все сделки проходят официально через МРЭО, с внесением данных в ПТС и СТС.
							</li>

							<li
								role="note"
								aria-label="Оценка реальной стоимости и выкуп за 1 день"
								className={`${cardBase} justify-self-start -ml-10`}
							>
								Определяем реальную стоимость номера и выкупаем его за 1 день.
							</li>

							<li
								role="note"
								aria-label="Поиск редких комбинаций по вашим критериям"
								className={`${cardBase} justify-self-end -mr-10`}
							>
								Находим редкие комбинации по вашим критериям: цифры, буквы, регион.
							</li>

							<li
								role="note"
								aria-label="Более 2000 актуальных и уникальных комбинаций"
								className={`${cardBase} justify-self-start -ml-10`}
							>
								Более 2000 актуальных и уникальных комбинаций на любой вкус.
							</li>

							<li
								role="note"
								aria-label="Полное юридическое сопровождение сделок"
								className={`${cardBase} justify-self-end -mr-10`}
							>
								Все сделки сопровождаются юридическим сопровождением, гарантируя полную защиту
								интересов клиента.
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	)
}
