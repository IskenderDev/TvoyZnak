import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { AdminLot, UpdateAdminLotPayload } from "@/api/adminLots";
import { regionsApi, type Region } from "@/shared/services/regionsApi";
import { DIGITS, LETTERS } from "@/shared/components/plate/constants";

const letterValues = new Set(LETTERS.map((letter) => letter.toUpperCase()));
const digitValues = new Set(DIGITS.map((digit) => digit.toUpperCase()));

const letterSchema = (label: string) =>
  z
    .string()
    .min(1, `${label} обязательна`)
    .max(1, `${label} должна содержать 1 символ`)
    .transform((value) => value.toUpperCase())
    .refine((value) => letterValues.has(value), {
      message: `${label}: допустимы только буквы ${Array.from(letterValues)
        .filter((value) => value !== "*")
        .join(", ")}`,
    });

const digitSchema = (label: string) =>
  z
    .string()
    .min(1, `${label} обязательна`)
    .max(1, `${label} должна содержать 1 символ`)
    .transform((value) => value.toUpperCase())
    .refine((value) => digitValues.has(value), {
      message: `${label}: допустимы только цифры 0-9 или *`,
    });

const schema = z.object({
  firstLetter: letterSchema("Первая буква"),
  secondLetter: letterSchema("Вторая буква"),
  thirdLetter: letterSchema("Третья буква"),
  firstDigit: digitSchema("Первая цифра"),
  secondDigit: digitSchema("Вторая цифра"),
  thirdDigit: digitSchema("Третья цифра"),
  regionId: z.coerce.number({ invalid_type_error: "Выберите регион" }).int().min(1, "Выберите регион"),
  markupPrice: z.coerce
    .number({ invalid_type_error: "Укажите наценку" })
    .min(0, "Наценка не может быть отрицательной"),
  comment: z
    .string()
    .optional()
    .transform((value) => value?.trim() ?? "")
    .refine((value) => value.length <= 500, { message: "Комментарий до 500 символов" }),
});

type FormValues = z.infer<typeof schema>;
const FORM_FIELDS: (keyof FormValues)[] = [
  "firstLetter",
  "secondLetter",
  "thirdLetter",
  "firstDigit",
  "secondDigit",
  "thirdDigit",
  "regionId",
  "markupPrice",
  "comment",
];

type AdminLotEditModalProps = {
  open: boolean;
  lot: AdminLot | null;
  onClose: () => void;
  onSubmit: (payload: UpdateAdminLotPayload) => Promise<void>;
  submitting?: boolean;
};

let regionsCache: Region[] | null = null;
let regionsPromise: Promise<Region[]> | null = null;

const FOCUSABLE_SELECTORS = [
  "button",
  "[href]",
  "input",
  "select",
  "textarea",
  "[tabindex]:not([tabindex='-1'])",
]
  .map((selector) => `${selector}:not([disabled])`)
  .join(",");

export default function AdminLotEditModal({
  open,
  lot,
  onClose,
  onSubmit,
  submitting = false,
}: AdminLotEditModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [regions, setRegions] = useState<Region[]>(regionsCache ?? []);
  const [regionsError, setRegionsError] = useState<string | null>(null);
  const [regionsLoading, setRegionsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: lot
      ? {
          firstLetter: lot.firstLetter ?? "",
          secondLetter: lot.secondLetter ?? "",
          thirdLetter: lot.thirdLetter ?? "",
          firstDigit: lot.firstDigit ?? "",
          secondDigit: lot.secondDigit ?? "",
          thirdDigit: lot.thirdDigit ?? "",
          regionId: lot.regionId ?? 0,
          markupPrice: lot.markupPrice ?? 0,
          comment: lot.comment ?? "",
        }
      : undefined,
  });

  useEffect(() => {
    if (open && lot) {
      reset({
        firstLetter: lot.firstLetter ?? "",
        secondLetter: lot.secondLetter ?? "",
        thirdLetter: lot.thirdLetter ?? "",
        firstDigit: lot.firstDigit ?? "",
        secondDigit: lot.secondDigit ?? "",
        thirdDigit: lot.thirdDigit ?? "",
        regionId: lot.regionId ?? 0,
        markupPrice: lot.markupPrice ?? 0,
        comment: lot.comment ?? "",
      });
      setFormError(null);
    }
  }, [open, lot, reset]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let active = true;
    if (regionsCache) {
      setRegions(regionsCache);
      return;
    }

    const loadRegions = async () => {
      setRegionsLoading(true);
      setRegionsError(null);
      let currentPromise: Promise<Region[]> | null = null;
      try {
        currentPromise = regionsPromise ?? regionsApi.list();
        regionsPromise = currentPromise;
        const data = await currentPromise;
        if (!active) {
          return;
        }
        regionsCache = data;
        setRegions(data);
      } catch (error) {
        if (!active) {
          return;
        }
        setRegionsError(extractErrorMessage(error, "Не удалось загрузить регионы"));
      } finally {
        if (regionsPromise === currentPromise) {
          regionsPromise = null;
        }
        if (active) {
          setRegionsLoading(false);
        }
      }
    };

    void loadRegions();

    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
        if (!focusable || focusable.length === 0) {
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    focusable?.[0]?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const handleOverlayMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === overlayRef.current) {
      onClose();
    }
  };

  const onFormSubmit = handleSubmit(async (values) => {
    if (!lot) {
      return;
    }

    setFormError(null);

    try {
      await onSubmit({
        ...values,
        comment: values.comment ?? "",
      });
      onClose();
    } catch (error) {
      const backendErrors = extractBackendErrors(error);
      if (backendErrors.message) {
        setFormError(backendErrors.message);
      }
      if (backendErrors.fields) {
        Object.entries(backendErrors.fields).forEach(([field, message]) => {
          if (message) {
            const fieldName = field as keyof FormValues;
            if (FORM_FIELDS.includes(fieldName)) {
              setError(fieldName, { type: "server", message });
            }
          }
        });
      }
    }
  });

  const isBusy = submitting || isSubmitting;
  const effectiveRegions = useMemo(
    () => regions.map((region) => ({ value: region.id, label: `${region.regionCode} — ${region.regionName}` })),
    [regions],
  );

  if (!open || !lot) {
    return null;
  }

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 px-4"
      role="presentation"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-lot-edit-title"
        className="w-full max-w-2xl rounded-2xl bg-neutral-900 text-white shadow-2xl"
      >
        <div className="border-b border-white/10 px-6 py-4">
          <h2 id="admin-lot-edit-title" className="text-xl font-semibold">
            Редактирование лота {lot.fullCarNumber}
          </h2>
          <p className="mt-1 text-sm text-neutral-300">Измените данные и сохраните изменения.</p>
        </div>

        <form onSubmit={onFormSubmit} className="flex flex-col gap-6 px-6 py-6">
          {formError ? (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {formError}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Первая буква" error={errors.firstLetter?.message}>
              <input
                {...register("firstLetter")}
                maxLength={1}
                className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-center text-lg uppercase tracking-wide focus:border-emerald-500 focus:outline-none"
              />
            </Field>
            <Field label="Вторая буква" error={errors.secondLetter?.message}>
              <input
                {...register("secondLetter")}
                maxLength={1}
                className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-center text-lg uppercase tracking-wide focus:border-emerald-500 focus:outline-none"
              />
            </Field>
            <Field label="Третья буква" error={errors.thirdLetter?.message}>
              <input
                {...register("thirdLetter")}
                maxLength={1}
                className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-center text-lg uppercase tracking-wide focus:border-emerald-500 focus:outline-none"
              />
            </Field>
            <Field label="Первая цифра" error={errors.firstDigit?.message}>
              <input
                {...register("firstDigit")}
                maxLength={1}
                className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-center text-lg focus:border-emerald-500 focus:outline-none"
              />
            </Field>
            <Field label="Вторая цифра" error={errors.secondDigit?.message}>
              <input
                {...register("secondDigit")}
                maxLength={1}
                className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-center text-lg focus:border-emerald-500 focus:outline-none"
              />
            </Field>
            <Field label="Третья цифра" error={errors.thirdDigit?.message}>
              <input
                {...register("thirdDigit")}
                maxLength={1}
                className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-center text-lg focus:border-emerald-500 focus:outline-none"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Регион" error={errors.regionId?.message}>
              <select
                {...register("regionId", { valueAsNumber: true })}
                className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Выберите регион</option>
                {effectiveRegions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
              {regionsLoading ? (
                <p className="mt-2 text-xs text-neutral-400">Загрузка регионов...</p>
              ) : null}
              {regionsError ? (
                <p className="mt-2 text-xs text-red-400">{regionsError}</p>
              ) : null}
            </Field>
            <Field label="Наценка" error={errors.markupPrice?.message}>
              <input
                type="number"
                step="100"
                min={0}
                {...register("markupPrice", { valueAsNumber: true })}
                className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </Field>
          </div>

          <Field label="Комментарий" error={errors.comment?.message}>
            <textarea
              {...register("comment")}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="Комментарий для покупателя"
            />
          </Field>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg border border-white/10 bg-neutral-800 px-4 py-2 text-sm font-medium transition hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:w-auto"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isBusy || regionsLoading}
              className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/60 sm:w-auto"
            >
              {isBusy ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-neutral-100">{label}</span>
      {children}
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </label>
  );
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const withMessage = error as {
      message?: unknown;
      response?: { data?: { message?: unknown; error?: unknown } };
    };
    const responseMessage = withMessage.response?.data?.message;
    const responseError = withMessage.response?.data?.error;
    const message = withMessage.message;

    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }
    if (typeof responseError === "string" && responseError.trim()) {
      return responseError;
    }
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
};

type BackendErrors = { message?: string | null; fields?: Record<string, string> | null };

const extractBackendErrors = (error: unknown): BackendErrors => {
  if (error && typeof error === "object") {
    const maybe = error as {
      message?: unknown;
      response?: { data?: { message?: unknown; error?: unknown; errors?: Record<string, string> } };
    };
    const message = maybe.response?.data?.message ?? maybe.message ?? maybe.response?.data?.error;
    const fields = maybe.response?.data?.errors;
    return {
      message: typeof message === "string" ? message : null,
      fields: typeof fields === "object" && fields ? fields : null,
    };
  }
  return { message: null, fields: null };
};
