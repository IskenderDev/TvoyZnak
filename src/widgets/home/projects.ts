export type ProjectItem = {
	id: string
	slug: string
	title: string
	description: string
	category: string
	date: string
	tags: string[]
	cover: string
	gallery?: string[]
	alt?: string
}

export const projects: ProjectItem[] = [
	{
		id: "p1",
		slug: "odinakovie-cifry",
		title: "ОДИНАКОВЫЕ ЦИФРЫ",
		description:
			"Эти номера легко запоминаются благодаря повторяющимся цифрам. Они идеально подходят для тех, кто ценит простоту и стиль. Такие комбинации привлекают внимание на дороге и подчёркивают статус владельца.",
		category: "Категория номеров",
		date: "2025",
		tags: ["Редкие", "Престижные", "Статус"],
		cover: "/bmw.png",
		alt: "BMW с красивым госномером"
	},
	{
		id: "p2",
		slug: "vip-sereyka",
		title: "VIP СЕРИЯ",
		description:
			"Подходит для представительских авто и подчёркивает имидж компании.",
		category: "Категория номеров",
		date: "2025",
		tags: ["VIP", "Имидж"],
		cover: "/bmw.png", alt: "Hongqi с премиальным номером"
	},
	{
		id: "p3",
		slug: "prestige-mercedes",
		title: "ПРЕСТИЖНЫЕ",
		description:
			"Выверенные комбинации, которые ценят коллекционеры и предприниматели.",
		category: "Категория номеров",
		date: "2025",
		tags: ["Престиж", "Коллекция"],
		cover: "/bmw.png", alt: "Mercedes с красивым номером"
	},{
		id: "p3",
		slug: "prestige-mercedes",
		title: "ПРЕСТИЖНЫЕ",
		description:
			"Выверенные комбинации, которые ценят коллекционеры и предприниматели.",
		category: "Категория номеров",
		date: "2025",
		tags: ["Престиж", "Коллекция"],
		cover: "/bmw.png", alt: "Mercedes с красивым номером"
	},{
		id: "p3",
		slug: "prestige-mercedes",
		title: "ПРЕСТИЖНЫЕ",
		description:
			"Выверенные комбинации, которые ценят коллекционеры и предприниматели.",
		category: "Категория номеров",
		date: "2025",
		tags: ["Престиж", "Коллекция"],
		cover: "/bmw.png", alt: "Mercedes с красивым номером"
	},
	{
		id: "p4",
		slug: "status-bmw",
		title: "СТАТУСНЫЕ",
		description:
			"Комбинации с высокой узнаваемостью для тех, кто любит внимание.",
		category: "Категория номеров",
		date: "2025",
		tags: ["Статус"],
		cover: "/bmw.png", alt: "BMW X5 с номером"
	}
]
