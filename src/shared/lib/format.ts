export const formatPrice = (n: number) => `${new Intl.NumberFormat("ru-RU").format(n)} ₽`
