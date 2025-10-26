import type { FormEventHandler, ReactNode } from "react";
import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { sanitizeNumericInput } from "@/shared/lib/numbers";

const REGION_OPTIONS = [
  { value: "77", label: "Москва" },
  { value: "78", label: "Санкт-Петербург" },
  { value: "50", label: "Московская область" },
  { value: "23", label: "Краснодарский край" },
  { value: "63", label: "Самарская область" },
  { value: "66", label: "Свердловская область" },
  { value: "16", label: "Республика Татарстан" },
  { value: "54", label: "Новосибирская область" },
];

const normalizePlate = (value: string): string =>
  value
    .toUpperCase()
    .replace(/[^A-ZА-Я0-9]/gu, "")
    .slice(0, 8);

const PlatePreview = ({ plate, region }: { plate: string; region: string }) => {
  const displayPlate = plate || "******";
  const displayRegion = region || "RUS";

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-3xl border border-white/10 bg-[#05070A] p-6 sm:flex-row">
      <div className="flex items-center gap-4 rounded-2xl bg-white px-6 py-4 text-black shadow-inner">
        <span className="text-4xl font-semibold tracking-widest sm:text-5xl">
          {displayPlate}
        </span>
        <div className="flex flex-col items-center gap-1">
          <span className="rounded-md bg-[#0B1F40] px-3 py-1 text-sm font-semibold text-white">{displayRegion}</span>
          <span className="text-xs text-black/60">RUS</span>
        </div>
      </div>
      <p className="text-sm text-white/60">
        Проверьте корректность номера перед публикацией объявления.
      </p>
    </div>
  );
};

export type SellFormValues = {
  plate: string;
  region: string;
  price: number;
  comment?: string;
  consent: boolean;
};

export const SellFormSchema: z.ZodType<SellFormValues> = z.object({
  plate: z.string().min(1, "Введите государственный номер"),
  region: z.string().min(1, "Выберите регион"),
  price: z
    .coerce.number({
      invalid_type_error: "Введите стоимость",
      required_error: "Введите стоимость",
    })
    .refine((value) => Number.isFinite(value) && value > 0, "Стоимость должна быть больше 0"),
  comment: z
    .string()
    .max(500, "Комментарий слишком длинный")
    .optional()
    .transform((value) => (value && value.trim() ? value.trim() : undefined)),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Необходимо согласие" }),
  }),
});

type SellFormProps<TFieldValues extends SellFormValues> = {
  form: UseFormReturn<TFieldValues>;
  onSubmit: (values: TFieldValues) => Promise<void> | void;
  submitLabel?: string;
  isSubmitting?: boolean;
  disableSubmit?: boolean;
  children?: ReactNode;
};

export function SellForm<TFieldValues extends SellFormValues>({
  form,
  onSubmit,
  submitLabel = "Разместить",
  isSubmitting,
  disableSubmit,
  children,
}: SellFormProps<TFieldValues>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const plateValue = watch("plate") ?? "";
  const regionValue = watch("region") ?? "";
  const consentValue = watch("consent");

  const handlePriceChange: FormEventHandler<HTMLInputElement> = (event) => {
    const input = event.currentTarget;
    const digitsOnly = sanitizeNumericInput(input.value);
    if (digitsOnly !== input.value) {
      input.value = digitsOnly;
    }
  };

  const handlePlateChange: FormEventHandler<HTMLInputElement> = (event) => {
    const input = event.currentTarget;
    const normalized = normalizePlate(input.value);
    input.value = normalized;
    setValue("plate", normalized as TFieldValues["plate"], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 text-white" noValidate>
      <PlatePreview plate={plateValue} region={regionValue} />

      <div className="grid gap-6 sm:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-2">
          <label htmlFor="plate" className="text-sm font-medium text-white/80">
            Госномер <span className="text-red-400">*</span>
          </label>
          <input
            id="plate"
            type="text"
            className="h-12 w-full rounded-xl border border-white/10 bg-[#0B0F1A] px-4 text-lg uppercase text-white placeholder:text-white/40 focus:border-[#4B89FF] focus:outline-none"
            placeholder="A123AA"
            {...register("plate", {
              onChange: handlePlateChange,
            })}
            aria-invalid={Boolean(errors.plate)}
            aria-describedby={errors.plate ? "plate-error" : undefined}
          />
          {errors.plate ? (
            <p id="plate-error" className="text-xs text-red-400">
              {errors.plate.message as string}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="region" className="text-sm font-medium text-white/80">
            Регион <span className="text-red-400">*</span>
          </label>
          <select
            id="region"
            className="h-12 w-full rounded-xl border border-white/10 bg-[#0B0F1A] px-4 text-base text-white focus:border-[#4B89FF] focus:outline-none"
            {...register("region")}
            aria-invalid={Boolean(errors.region)}
            aria-describedby={errors.region ? "region-error" : undefined}
          >
            <option value="" disabled>
              Выберите регион
            </option>
            {REGION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value} — {option.label}
              </option>
            ))}
          </select>
          {errors.region ? (
            <p id="region-error" className="text-xs text-red-400">
              {errors.region.message as string}
            </p>
          ) : null}
        </div>
      </div>

      {children}

      <div className="flex flex-col gap-2">
        <label htmlFor="price" className="text-sm font-medium text-white/80">
          Стоимость, ₽ <span className="text-red-400">*</span>
        </label>
        <input
          id="price"
          type="text"
          inputMode="numeric"
          placeholder="Например, 150000"
          className="h-12 w-full rounded-xl border border-white/10 bg-[#0B0F1A] px-4 text-lg text-white placeholder:text-white/40 focus:border-[#4B89FF] focus:outline-none"
          {...register("price", {
            valueAsNumber: true,
            onChange: handlePriceChange,
          })}
          aria-invalid={Boolean(errors.price)}
          aria-describedby={errors.price ? "price-error" : undefined}
        />
        {errors.price ? (
          <p id="price-error" className="text-xs text-red-400">
            {errors.price.message as string}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="comment" className="text-sm font-medium text-white/80">
          Комментарий
        </label>
        <textarea
          id="comment"
          rows={4}
          placeholder="Добавьте дополнительную информацию"
          className="w-full rounded-xl border border-white/10 bg-[#0B0F1A] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#4B89FF] focus:outline-none"
          {...register("comment")}
          aria-invalid={Boolean(errors.comment)}
          aria-describedby={errors.comment ? "comment-error" : undefined}
        />
        {errors.comment ? (
          <p id="comment-error" className="text-xs text-red-400">
            {errors.comment.message as string}
          </p>
        ) : null}
      </div>

      <p className="rounded-2xl border border-dashed border-white/10 bg-[#0A1120] px-4 py-3 text-xs text-white/60">
        *При публикации объявлений конечной стоимости добавляется комиссия в размере 10–30% минимум.
      </p>

      <label className="flex items-start gap-3 text-sm text-white/80">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-white/20 bg-[#0B0F1A] accent-[#4B89FF]"
          {...register("consent")}
        />
        <span>
          Я согласен на обработку персональных данных <span className="text-red-400">*</span>
        </span>
      </label>
      {errors.consent ? (
        <p className="text-xs text-red-400">{errors.consent.message as string}</p>
      ) : null}

      <button
        type="submit"
        className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#0074FF] to-[#005CDB] text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={Boolean(disableSubmit) || Boolean(isSubmitting) || !consentValue}
      >
        {isSubmitting ? "Отправляем…" : submitLabel}
      </button>
    </form>
  );
}
