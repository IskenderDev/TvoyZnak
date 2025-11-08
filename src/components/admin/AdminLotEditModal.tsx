import { useEffect, useMemo, useState, type ReactNode } from "react";
import { FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { AdminLot, UpdateAdminLotPayload } from "@/api/adminLots";
import { regionsApi, type Region } from "@/shared/services/regionsApi";
import { DIGITS, LETTERS } from "@/shared/components/plate/constants";
import PlateStaticSm, { type PlateData } from "@/shared/components/plate/PlateStaticSm";
import Modal from "@/shared/ui/Modal";
import { format2 } from "@/shared/lib/format/format2";

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

export default function AdminLotEditModal({
  open,
  lot,
  onClose,
  onSubmit,
  submitting = false,
}: AdminLotEditModalProps) {
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
    watch,
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
    () =>
      regions.map((region) => ({
        value: region.id,
        label: `${format2(region.regionCode)} — ${region.regionName}`,
      })),
    [regions],
  );

  const firstLetterValue = watch("firstLetter");
  const secondLetterValue = watch("secondLetter");
  const thirdLetterValue = watch("thirdLetter");
  const firstDigitValue = watch("firstDigit");
  const secondDigitValue = watch("secondDigit");
  const thirdDigitValue = watch("thirdDigit");
  const regionFieldValue = watch("regionId");
  const commentValue = watch("comment");

  const previewPlate = useMemo<PlateData>(() => {
    const fallbackPlate: PlateData = {
      price: lot?.originalPrice ?? 0,
      comment: lot?.comment ?? "",
      firstLetter: lot?.firstLetter ?? "",
      secondLetter: lot?.secondLetter ?? "",
      thirdLetter: lot?.thirdLetter ?? "",
      firstDigit: lot?.firstDigit ?? "",
      secondDigit: lot?.secondDigit ?? "",
      thirdDigit: lot?.thirdDigit ?? "",
      regionId: lot?.regionCode ?? "",
    };

    if (!lot) {
      return fallbackPlate;
    }

    const ensureString = (value: unknown, fallback: string) =>
      typeof value === "string" && value.trim() ? value.trim().toUpperCase() : fallback;
    const ensureDigit = (value: unknown, fallback: string) =>
      typeof value === "string" && value.trim() ? value.trim() : fallback;

    const regionPreview = (() => {
      if (typeof regionFieldValue === "number" && Number.isFinite(regionFieldValue)) {
        return String(regionFieldValue);
      }
      if (typeof regionFieldValue === "string" && regionFieldValue.trim()) {
        return regionFieldValue.trim();
      }
      return lot.regionCode ?? "";
    })();

    return {
      price: lot.originalPrice ?? 0,
      comment: typeof commentValue === "string" ? commentValue : lot.comment ?? "",
      firstLetter: ensureString(firstLetterValue, lot.firstLetter ?? ""),
      secondLetter: ensureString(secondLetterValue, lot.secondLetter ?? ""),
      thirdLetter: ensureString(thirdLetterValue, lot.thirdLetter ?? ""),
      firstDigit: ensureDigit(firstDigitValue, lot.firstDigit ?? ""),
      secondDigit: ensureDigit(secondDigitValue, lot.secondDigit ?? ""),
      thirdDigit: ensureDigit(thirdDigitValue, lot.thirdDigit ?? ""),
      regionId: regionPreview,
    } satisfies PlateData;
  }, [commentValue, firstDigitValue, firstLetterValue, lot, regionFieldValue, secondDigitValue, secondLetterValue, thirdDigitValue, thirdLetterValue]);

  if (!lot) {
    return null;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative max-h-[90vh] overflow-hidden rounded-[32px] bg-white text-black shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black transition hover:bg-black/10"
          aria-label="Закрыть окно редактирования"
        >
          <FiX className="h-5 w-5" />
        </button>

        <div className="max-h-[90vh] overflow-y-auto px-6 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12">
          <div className="mx-auto w-full max-w-[720px] space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-actay-wide uppercase md:text-3xl">Редактирование лота</h2>
              <p className="mt-2 text-sm text-black/70 md:text-base">Обновите данные номера и сохраните изменения.</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-black/40">{lot.fullCarNumber}</p>
            </div>

            <div className="flex justify-center">
              <PlateStaticSm data={previewPlate} responsive showCaption={false} className="w-full max-w-[220px]" />
            </div>

            <form className="space-y-6" onSubmit={onFormSubmit}>
              {formError ? (
                <div className="rounded-2xl border border-[#EB5757]/40 bg-[#EB5757]/10 px-4 py-3 text-sm text-[#EB5757]">
                  {formError}
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Первая буква" error={errors.firstLetter?.message}>
                  <input
                    {...register("firstLetter")}
                    maxLength={1}
                    className="w-full rounded-xl border border-black/10 bg-[#f5f6f8] px-4 py-3 text-center text-lg uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
                  />
                </Field>
                <Field label="Вторая буква" error={errors.secondLetter?.message}>
                  <input
                    {...register("secondLetter")}
                    maxLength={1}
                    className="w-full rounded-xl border border-black/10 bg-[#f5f6f8] px-4 py-3 text-center text-lg uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
                  />
                </Field>
                <Field label="Третья буква" error={errors.thirdLetter?.message}>
                  <input
                    {...register("thirdLetter")}
                    maxLength={1}
                    className="w-full rounded-xl border border-black/10 bg-[#f5f6f8] px-4 py-3 text-center text-lg uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
                  />
                </Field>
                <Field label="Первая цифра" error={errors.firstDigit?.message}>
                  <input
                    {...register("firstDigit")}
                    maxLength={1}
                    className="w-full rounded-xl border border-black/10 bg-[#f5f6f8] px-4 py-3 text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
                  />
                </Field>
                <Field label="Вторая цифра" error={errors.secondDigit?.message}>
                  <input
                    {...register("secondDigit")}
                    maxLength={1}
                    className="w-full rounded-xl border border-black/10 bg-[#f5f6f8] px-4 py-3 text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
                  />
                </Field>
                <Field label="Третья цифра" error={errors.thirdDigit?.message}>
                  <input
                    {...register("thirdDigit")}
                    maxLength={1}
                    className="w-full rounded-xl border border-black/10 bg-[#f5f6f8] px-4 py-3 text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Регион" error={errors.regionId?.message}>
                  <select
                    {...register("regionId", { valueAsNumber: true })}
                    className="w-full rounded-xl border border-black/10 bg-[#f5f6f8] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
                  >
                    <option value="">Выберите регион</option>
                    {effectiveRegions.map((region) => (
                      <option key={region.value} value={region.value}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                  {regionsLoading ? (
                    <p className="mt-2 text-xs text-black/50">Загрузка регионов...</p>
                  ) : null}
                  {regionsError ? (
                    <p className="mt-2 text-xs text-[#EB5757]">{regionsError}</p>
                  ) : null}
                </Field>
                <Field label="Наценка" error={errors.markupPrice?.message}>
                  <input
                    type="number"
                    step="100"
                    min={0}
                    {...register("markupPrice", { valueAsNumber: true })}
                    className="w-full rounded-xl border border-black/10 bg-[#f5f6f8] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
                  />
                </Field>
              </div>

              <Field label="Комментарий" error={errors.comment?.message}>
                <textarea
                  {...register("comment")}
                  rows={4}
                  className="w-full rounded-xl border border-black/10 bg-[#f5f6f8] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
                  placeholder="Комментарий для покупателя"
                />
              </Field>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-full border border-black/10 px-6 py-3 text-sm font-medium text-black transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[#1E63FF]/40 sm:w-auto"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isBusy || regionsLoading}
                  className="w-full rounded-full bg-[#1E63FF] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1557E0] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isBusy ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-black">
      <span className="font-semibold text-black/70">{label}</span>
      {children}
      {error ? <span className="text-xs text-[#EB5757]">{error}</span> : null}
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
