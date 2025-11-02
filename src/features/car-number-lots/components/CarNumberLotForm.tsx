import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import type {
  CarNumberLot,
  CarNumberLotPayload,
  CreateCarNumberLotWithRegistrationPayload,
} from "@/shared/types";

const baseSchema = z.object({
  title: z.string().min(3, "Укажите заголовок"),
  number: z.string().min(6, "Укажите номер"),
  region: z.string().min(1, "Укажите регион"),
  price: z.coerce.number().min(1, "Минимальная цена 1 ₽"),
  description: z.string().optional(),
  category: z.string().optional(),
});

const guestSchema = baseSchema.extend({
  fullName: z.string().min(3, "Укажите ФИО"),
  email: z.string().email("Невалидный email"),
  phoneNumber: z.string().min(6, "Укажите телефон"),
  password: z.string().min(6, "Минимум 6 символов"),
});

export type CarNumberLotFormValues = z.infer<typeof guestSchema>;

interface Props {
  defaultValues?: Partial<CarNumberLot>;
  isAuthenticated: boolean;
  loading?: boolean;
  onSubmit:
    | ((values: CarNumberLotPayload) => Promise<void>)
    | ((values: CreateCarNumberLotWithRegistrationPayload) => Promise<void>);
}

export function CarNumberLotForm({ defaultValues, isAuthenticated, loading, onSubmit }: Props) {
  const form = useForm<CarNumberLotFormValues>({
    resolver: zodResolver(isAuthenticated ? baseSchema : guestSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      number: defaultValues?.number ?? "",
      region: defaultValues?.region ?? "",
      price: defaultValues?.price ?? 0,
      description: defaultValues?.description ?? "",
      category: defaultValues?.category ?? "",
      email: "",
      phoneNumber: "",
      password: "",
      fullName: "",
    } as CarNumberLotFormValues,
  });

  useEffect(() => {
    form.reset({
      title: defaultValues?.title ?? "",
      number: defaultValues?.number ?? "",
      region: defaultValues?.region ?? "",
      price: defaultValues?.price ?? 0,
      description: defaultValues?.description ?? "",
      category: defaultValues?.category ?? "",
      email: "",
      phoneNumber: "",
      password: "",
      fullName: "",
    } as CarNumberLotFormValues);
  }, [defaultValues, form]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        if (isAuthenticated) {
          const payload: CarNumberLotPayload = {
            title: values.title,
            number: values.number,
            region: values.region,
            price: Number(values.price),
            description: values.description,
            category: values.category,
          };
          await (onSubmit as (input: CarNumberLotPayload) => Promise<void>)(payload);
        } else {
          const payload: CreateCarNumberLotWithRegistrationPayload = {
            title: values.title,
            number: values.number,
            region: values.region,
            price: Number(values.price),
            description: values.description,
            category: values.category,
            email: values.email!,
            phoneNumber: values.phoneNumber!,
            password: values.password!,
            fullName: values.fullName!,
          };
          await (
            onSubmit as (
              input: CreateCarNumberLotWithRegistrationPayload,
            ) => Promise<void>
          )(payload);
        }
      })}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">Заголовок</span>
          <input
            type="text"
            {...register("title")}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
          {errors.title && <span className="text-xs text-red-400">{errors.title.message}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">Регион</span>
          <input
            type="text"
            {...register("region")}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
          {errors.region && <span className="text-xs text-red-400">{errors.region.message}</span>}
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">Номер</span>
          <input
            type="text"
            {...register("number")}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
          {errors.number && <span className="text-xs text-red-400">{errors.number.message}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-zinc-400">Цена</span>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
          {errors.price && <span className="text-xs text-red-400">{errors.price.message}</span>}
        </label>
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-sm text-zinc-400">Категория</span>
        <input
          type="text"
          {...register("category")}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
        />
        {errors.category && <span className="text-xs text-red-400">{errors.category.message}</span>}
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm text-zinc-400">Описание</span>
        <textarea
          rows={4}
          {...register("description")}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
        />
        {errors.description && <span className="text-xs text-red-400">{errors.description.message}</span>}
      </label>

      {!isAuthenticated && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
          <h4 className="mb-3 text-sm font-semibold text-white">
            Вы не авторизованы — укажите контактные данные для регистрации
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-zinc-400">ФИО</span>
              <input
                type="text"
                {...register("fullName")}
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
              {errors.fullName && <span className="text-xs text-red-400">{errors.fullName.message}</span>}
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-zinc-400">Email</span>
              <input
                type="email"
                {...register("email")}
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
              {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-zinc-400">Телефон</span>
              <input
                type="tel"
                {...register("phoneNumber")}
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
              {errors.phoneNumber && (
                <span className="text-xs text-red-400">{errors.phoneNumber.message}</span>
              )}
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-zinc-400">Пароль</span>
              <input
                type="password"
                {...register("password")}
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
              {errors.password && <span className="text-xs text-red-400">{errors.password.message}</span>}
            </label>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-700"
      >
        {loading ? "Сохранение..." : "Сохранить"}
      </button>
    </form>
  );
}

export default CarNumberLotForm;
