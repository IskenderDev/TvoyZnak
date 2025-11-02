import { Link } from "react-router-dom";

import type { CarNumberLot } from "@/shared/types";
import { paths } from "@/shared/routes/paths";

interface Props {
  lot: CarNumberLot;
}

export function CarNumberLotCard({ lot }: Props) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{lot.title}</h3>
        <span className="rounded bg-zinc-800 px-2 py-1 text-xs uppercase text-zinc-300">
          {lot.status}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm text-zinc-300 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase text-zinc-500">Регион</dt>
          <dd>{lot.region}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-zinc-500">Номер</dt>
          <dd className="font-mono text-base text-white">{lot.number}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-zinc-500">Цена</dt>
          <dd className="font-semibold text-emerald-400">{lot.price.toLocaleString()} ₽</dd>
        </div>
      </dl>
      {lot.description && <p className="text-sm text-zinc-400">{lot.description}</p>}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Продавец: {lot.owner.fullName}</span>
        <span>{new Date(lot.createdAt).toLocaleString()}</span>
      </div>
      <Link
        to={paths.carNumberLots.details(lot.id)}
        className="rounded bg-emerald-500 px-3 py-2 text-center text-sm font-semibold text-zinc-900 transition hover:bg-emerald-400"
      >
        Подробнее
      </Link>
    </article>
  );
}

export default CarNumberLotCard;
