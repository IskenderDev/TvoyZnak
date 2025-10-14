import PageTitle from "@/shared/components/PageTitle";
import Seo from "@/shared/components/Seo";

export default function NumbersPage() {
  return (
    <>
      <Seo title="Номера — Знак отличия" description="Каталог номеров (каркас, без логики)." />
      <PageTitle>Номера</PageTitle>
      <div className="mb-6">
        <p>TODO: панель фильтров (без логики и данных).</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-md bg-neutral-800 text-sm">
          Пустая карточка №1 (пример заглушки, без данных)
        </div>
        <div className="p-4 rounded-md bg-neutral-800 text-sm">Пустая карточка №2</div>
        <div className="p-4 rounded-md bg-neutral-800 text-sm">Пустая карточка №3</div>
      </div>
    </>
  );
}
