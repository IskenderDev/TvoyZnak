import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Seo from "@/shared/components/Seo";
import { SellForm, SellFormSchema } from "@/pages/sell/components/SellForm";
import { formatPhoneNumber, isValidPhoneNumber } from "@/shared/lib/phone";
import { useAuth } from "@/shared/contexts/AuthProvider";
import { submitCombinedListing, type CombinedSellFormValues } from "@/pages/sell/lib/submitCombinedListing";
import { numbersApi } from "@/shared/services/numbersApi";
import { parseNextParam, resolveNextPath, buildNextSearch } from "@/shared/lib/navigation";
import { paths } from "@/shared/routes/paths";

const RegisterSchema = z.object({
  fullName: z.string().min(2, "Введите имя"),
  phone: z
    .string()
    .min(1, "Введите телефон")
    .refine((value) => isValidPhoneNumber(value), "Введите телефон в формате +7 (___) ___-__-__"),
  email: z.string().email("Введите почту"),
  password: z.string().min(6, "Минимум 6 символов"),
});

const CombinedSchema = SellFormSchema.extend(RegisterSchema.shape);

type CombinedFormValues = z.infer<typeof CombinedSchema>;

const mapServerErrors = (
  error: unknown,
  values: CombinedFormValues,
  setError: (field: keyof CombinedFormValues, message: string) => void,
): string => {
  let message = "Не удалось разместить объявление";

  if (isAxiosError(error)) {
    const data = error.response?.data as
      | {
          message?: string;
          errors?: Record<string, string | string[]>;
        }
      | undefined;

    if (data?.errors) {
      Object.entries(data.errors).forEach(([field, value]) => {
        if (field in values) {
          const fieldMessage = Array.isArray(value) ? value[0] : value;
          setError(field as keyof CombinedFormValues, fieldMessage || "Проверьте поле");
        }
      });
    }

    if (data?.message) {
      message = data.message;
    } else if (error.response?.status === 409) {
      message = "Указанная почта уже зарегистрирована";
      setError("email", message);
    } else if (error.response?.status === 401) {
      message = "Не удалось авторизоваться";
    } else if (error.response?.status === 400) {
      message = "Проверьте правильность заполнения формы";
    } else if (error.response?.status && error.response.status >= 500) {
      message = "Сервер временно недоступен";
    }
  }

  return message;
};

export default function SellCombinedPage() {
  const form = useForm<CombinedFormValues>({
    resolver: zodResolver(CombinedSchema),
    defaultValues: {
      plate: "",
      region: "",
      comment: "",
      consent: false,
      fullName: "",
      phone: "",
      email: "",
      password: "",
    } as Partial<CombinedFormValues>,
  });

  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nextParam = parseNextParam(location.search);

  useEffect(() => {
    if (!auth.loading && auth.user) {
      const query = nextParam ? `?${buildNextSearch(nextParam)}` : "";
      navigate(`${paths.sellNew}${query}`, { replace: true });
    }
  }, [auth.loading, auth.user, navigate, nextParam]);

  useEffect(() => {
    const phone = form.getValues("phone");
    if (!phone) {
      form.setValue("phone", "+7 (", { shouldDirty: false });
    }
  }, [form]);

  const handleSubmit = async (values: CombinedFormValues) => {
    try {
      const listing = await submitCombinedListing(values as CombinedSellFormValues, {
        auth: {
          user: auth.user,
          register: auth.register,
          login: auth.login,
          ensureSession: auth.ensureSession,
        },
        numbers: {
          create: numbersApi.create,
        },
      });

      toast.success("Объявление размещено");
      const target = resolveNextPath(nextParam, paths.profileListing(String(listing.id)));
      navigate(target, { replace: true });
    } catch (error) {
      const message = mapServerErrors(error, values, (field, messageValue) => {
        form.setError(field, { type: "server", message: messageValue });
      });
      toast.error(message);
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    form.setValue("phone", formatted, { shouldDirty: true, shouldValidate: true });
    return formatted;
  };

  if (auth.loading) {
    return (
      <section className="flex min-h-[420px] items-center justify-center text-white/70">
        Проверяем авторизацию…
      </section>
    );
  }

  if (auth.user) {
    return null;
  }

  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <section className="py-16 text-white">
      <Seo
        title="Продать автомобильный номер — Знак отличия"
        description="Разместите объявление и одновременно зарегистрируйтесь на платформе"
      />
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-[#080C16] px-6 py-10 shadow-xl sm:px-10">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Продажа номера</p>
          <h1 className="text-3xl font-actay-wide uppercase sm:text-4xl">Разместите номер и зарегистрируйтесь</h1>
          <p className="text-sm text-white/60">
            После публикации мы автоматически создадим аккаунт и объявление — остаётся дождаться покупателя.
          </p>
        </div>

        <SellForm
          form={form}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-sm font-medium text-white/80">
                Имя <span className="text-red-400">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Введите имя"
                className="h-12 w-full rounded-xl border border-white/10 bg-[#0B0F1A] px-4 text-base text-white placeholder:text-white/40 focus:border-[#4B89FF] focus:outline-none"
                {...register("fullName")}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
              />
              {errors.fullName ? (
                <p id="fullName-error" className="text-xs text-red-400">
                  {errors.fullName.message as string}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm font-medium text-white/80">
                Телефон <span className="text-red-400">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                placeholder="+7 (___) ___-__-__"
                className="h-12 w-full rounded-xl border border-white/10 bg-[#0B0F1A] px-4 text-base text-white placeholder:text-white/40 focus:border-[#4B89FF] focus:outline-none"
                {...register("phone", {
                  onChange: (event) => {
                    const formatted = handlePhoneChange(event.currentTarget.value);
                    event.currentTarget.value = formatted;
                  },
                })}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone ? (
                <p id="phone-error" className="text-xs text-red-400">
                  {errors.phone.message as string}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-white/80">
                Почта <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@mail.ru"
                className="h-12 w-full rounded-xl border border-white/10 bg-[#0B0F1A] px-4 text-base text-white placeholder:text-white/40 focus:border-[#4B89FF] focus:outline-none"
                {...register("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email ? (
                <p id="email-error" className="text-xs text-red-400">
                  {errors.email.message as string}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-white/80">
                Пароль <span className="text-red-400">*</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="Минимум 6 символов"
                className="h-12 w-full rounded-xl border border-white/10 bg-[#0B0F1A] px-4 text-base text-white placeholder:text-white/40 focus:border-[#4B89FF] focus:outline-none"
                {...register("password")}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password ? (
                <p id="password-error" className="text-xs text-red-400">
                  {errors.password.message as string}
                </p>
              ) : null}
            </div>
          </div>
        </SellForm>
      </div>
    </section>
  );
}
