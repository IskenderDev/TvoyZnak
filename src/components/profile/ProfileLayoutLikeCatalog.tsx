import type { CSSProperties, ReactNode } from "react";
import { LuPencilLine } from "react-icons/lu";

import PlateStaticSm, { type PlateData } from "@/shared/components/plate/PlateStaticSm";

const GRID_COLS = "140px minmax(260px,1fr) 200px minmax(220px,1fr) 180px";

export type ProfileInfoField = {
  label: string;
  value: string;
};

export type ProfileLotRow = {
  id: string;
  dateLabel: string;
  plate: PlateData;
  priceLabel: string;
  sellerLabel: string;
  onDelete: () => void;
  isDeleting: boolean;
  deleteLabel: string;
  deletingLabel: string;
  onEdit?: () => void;
  editLabel?: string;
};

export type ProfileLayoutLikeCatalogProps = {
  pageTitle: string;
  profileCard: {
    eyebrow?: string;
    title: string;
    description?: string;
    actions?: ReactNode;
    fields?: ProfileInfoField[];
  };
  lotsCard: {
    title: string;
    subtitle?: string;
    headerActions?: ReactNode;
    items: ProfileLotRow[];
    loading: boolean;
    loadingLabel?: string;
    error?: string | null;
    emptyLabel: string;
    canShowMore: boolean;
    onShowMore?: () => void;
    showMoreLabel?: string;
  };
};

const DESKTOP_COLS_STYLE: CSSProperties = { "--cols": GRID_COLS } as CSSProperties;

export default function ProfileLayoutLikeCatalog({ pageTitle, profileCard, lotsCard }: ProfileLayoutLikeCatalogProps) {
  const {
    eyebrow,
    title,
    description,
    actions,
    fields,
  } = profileCard;

  const {
    title: lotsTitle,
    subtitle: lotsSubtitle,
    headerActions,
    items,
    loading,
    loadingLabel,
    error,
    emptyLabel,
    canShowMore,
    onShowMore,
    showMoreLabel,
  } = lotsCard;

  const hasFields = Boolean(fields && fields.length);

  return (
    <section className="min-h-screen bg-[#0B0B0C] py-12 text-white">
      <div className="mx-auto w-full px-4 sm:px-6">
        <h1 className="mb-6 text-3xl font-actay-wide uppercase md:text-4xl">{pageTitle}</h1>

        <div className="grid gap-6">
          <article className="rounded-2xl bg-white px-6 py-6 text-black shadow-sm sm:px-8 sm:py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                {eyebrow ? (
                  <p className="text-xs uppercase tracking-[0.3em] text-black/50">{eyebrow}</p>
                ) : null}
                <h2 className="mt-2 text-3xl font-actay-wide uppercase text-black md:text-4xl">{title}</h2>
                {description ? (
                  <p className="mt-3 max-w-2xl text-sm text-black/70 md:text-base">{description}</p>
                ) : null}
              </div>
              {actions ? <div className="md:pt-2">{actions}</div> : null}
            </div>

            {hasFields ? (
              <dl className="mt-6 grid gap-4 md:grid-cols-2">
                {fields!.map((field) => (
                  <div key={field.label} className="rounded-2xl bg-black/5 px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-black/50">{field.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-black md:text-base">{field.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </article>

          <article className="overflow-hidden rounded-2xl bg-white text-black shadow-sm">
            <div className="flex flex-col gap-4 border-b border-black/10 px-6 py-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-actay-wide uppercase text-black md:text-3xl">{lotsTitle}</h2>
                {lotsSubtitle ? <p className="mt-1 text-sm text-black/70 md:text-base">{lotsSubtitle}</p> : null}
              </div>
              {headerActions ? <div className="flex flex-wrap items-center gap-3">{headerActions}</div> : null}
            </div>

            {error ? (
              <p className="mx-6 mt-4 rounded-xl bg-white px-4 py-3 text-[#FF6B6B]">{error}</p>
            ) : null}
            {loading ? <p className="mx-6 mt-4 text-neutral-500">{loadingLabel ?? "Загрузка..."}</p> : null}

            {!loading && !items.length && !error ? (
              <p className="mx-6 mt-6 rounded-xl bg-white px-6 py-10 text-center text-black">{emptyLabel}</p>
            ) : null}

            {items.length ? (
              <div className="mt-6">
                <div className="hidden border-y border-black/10 md:block">
                  <div className="grid items-center gap-4 px-6 py-3 text-center font-actay-druk text-lg font-bold [grid-template-columns:var(--cols)]" style={DESKTOP_COLS_STYLE}>
                    <span>Дата</span>
                    <span>Номер</span>
                    <span>Цена</span>
                    <span>Продавец</span>
                    <span className="justify-self-end text-base font-medium">Действия</span>
                  </div>

                  <ul className="divide-y divide-black/10">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="grid items-center gap-4 px-6 py-4 text-center font-actay text-sm md:text-base [grid-template-columns:var(--cols)]"
                        style={DESKTOP_COLS_STYLE}
                      >
                        <span className="tabular-nums text-black/80">{item.dateLabel}</span>
                        <div className="flex items-center justify-center">
                          <PlateStaticSm data={item.plate} responsive showCaption={false} className="mx-auto max-w-[210px]" />
                        </div>
                        <span className="font-actay-druk text-base font-medium text-black">{item.priceLabel}</span>
                        <span className="text-black/80">{item.sellerLabel}</span>
                        <div className="justify-self-end">
                          <div className="flex items-center justify-end gap-2">
                            {item.onEdit ? (
                              <button
                                type="button"
                                onClick={item.onEdit}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/20 text-black transition hover:bg-black/5"
                                aria-label={item.editLabel ?? "Изменить номер"}
                              >
                                <LuPencilLine className="h-4 w-4" />
                                
                              </button>
                            ) : null}
                            <button
                              type="button"
                              onClick={item.onDelete}
                              disabled={item.isDeleting}
                              className="rounded-full border border-black/20 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {item.isDeleting ? item.deletingLabel : item.deleteLabel}
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <ul className="grid gap-4 px-4 pb-6 md:hidden">
                  {items.map((item) => (
                    <li key={item.id} className="rounded-2xl bg-white px-4 py-4 text-black shadow-sm ring-1 ring-black/10">
                      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-black/50">
                        <span>Дата</span>
                        <span className="tabular-nums text-sm text-black/80">{item.dateLabel}</span>
                      </div>

                      <div className="mt-3 flex justify-center">
                        <PlateStaticSm data={item.plate} responsive showCaption={false} className="max-w-[210px]" />
                      </div>

                      <dl className="mt-4 grid gap-2 text-sm">
                        <div className="flex items-center justify-between">
                          <dt className="text-black/60">Цена</dt>
                          <dd className="font-actay-druk text-base font-medium text-black">{item.priceLabel}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-black/60">Продавец</dt>
                          <dd className="text-black/80">{item.sellerLabel}</dd>
                        </div>
                      </dl>

                      <div className="mt-4 flex items-center gap-2">
                        {item.onEdit ? (
                          <button
                            type="button"
                            onClick={item.onEdit}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-black transition hover:bg-black/5"
                            aria-label={item.editLabel ?? "Изменить номер"}
                          >
                            <LuPencilLine className="h-4 w-4" />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={item.onDelete}
                          disabled={item.isDeleting}
                          className="flex-1 rounded-full border border-black/20 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {item.isDeleting ? item.deletingLabel : item.deleteLabel}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {canShowMore && onShowMore ? (
              <div className="border-t border-black/10 px-6 py-5 text-center">
                <button
                  type="button"
                  onClick={onShowMore}
                  className="rounded-full border border-black/20 bg-white px-6 py-2 text-sm font-medium text-black transition hover:bg-white/90"
                >
                  {showMoreLabel ?? "Показать ещё"}
                </button>
              </div>
            ) : null}
          </article>
        </div>
      </div>
    </section>
  );
}
