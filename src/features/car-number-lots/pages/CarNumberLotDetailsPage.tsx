import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCarNumberLots } from "@/features/car-number-lots/hooks/useCarNumberLots";
import type { CarNumberLot } from "@/shared/types";

export function CarNumberLotDetailsPage() {
  const { id } = useParams();
  const { getLot, loading } = useCarNumberLots();
  const [lot, setLot] = useState<CarNumberLot | null>(null);

  useEffect(() => {
    if (!id) return;
    getLot(id).then(setLot).catch(console.error);
  }, [getLot, id]);

  if (loading && !lot) {
    return (
      <div className="flex justify-center py-10">
        <span className="animate-pulse text-sm text-zinc-400">Загрузка...</span>
      </div>
    );
  }

  if (!lot) {
    return <div className="py-10 text-center text-sm text-zinc-400">Объявление не найдено</div>;
  }

  return (
    <article className="flex flex-col gap-6 rounded-lg border border-zinc-800 bg-zinc-900/60 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold text-white">{lot.title}</h1>
        <span className="text-sm text-zinc-400">{lot.region}</span>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
          <h2 className="text-sm font-semibold text-zinc-200">Информация</h2>
          <dl className="mt-2 grid gap-2 text-sm text-zinc-300">
            <div className="flex justify-between">
              <dt>Госномер</dt>
              <dd className="font-mono text-lg text-white">{lot.number}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Цена</dt>
              <dd className="font-semibold text-emerald-400">{lot.price.toLocaleString()} ₽</dd>
            </div>
            <div className="flex justify-between">
              <dt>Статус</dt>
              <dd className="capitalize text-zinc-200">{lot.status}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Категория</dt>
              <dd>{lot.category ?? "Не указана"}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
          <h2 className="text-sm font-semibold text-zinc-200">Контакты продавца</h2>
          <dl className="mt-2 grid gap-2 text-sm text-zinc-300">
            <div className="flex justify-between">
              <dt>Имя</dt>
              <dd>{lot.owner.fullName}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Email</dt>
              <dd>{lot.owner.email}</dd>
            </div>
            {lot.owner.phoneNumber && (
              <div className="flex justify-between">
                <dt>Телефон</dt>
                <dd>{lot.owner.phoneNumber}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
      {lot.description && (
        <section>
          <h2 className="text-lg font-semibold text-white">Описание</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-zinc-300">{lot.description}</p>
        </section>
      )}
    </article>
  );
}

export default CarNumberLotDetailsPage;
