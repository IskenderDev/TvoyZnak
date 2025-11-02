import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import PageTitle from "@/shared/components/PageTitle";
import Seo from "@/shared/components/Seo";
import { useAuth } from "@/shared/hooks/useAuth";
import { paths } from "@/shared/routes/paths";

const registerSchema = z
  .object({
    fullName: z.string().min(1, "Укажите имя"),
    email: z.string().email("Введите корректный email"),
    phoneNumber: z
      .string()
      .min(8, "Введите телефон")
      .max(18, "Введите телефон")
      .refine((value) => /^[+\d][\d\s()+-]{7,}$/u.test(value), "Введите корректный телефон"),
    password: z.string().min(6, "Минимум 6 символов"),
    confirmPassword: z.string().min(6, "Подтвердите пароль"),
    consent: z.boolean().refine((value) => value, "Подтвердите согласие"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      consent: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError(null);

    try {
      await registerUser({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
      });
      navigate(paths.profile, { replace: true });
    } catch (error) {
      const message = extractErrorMessage(error);
      setFormError(message);
    }
  };

  return (
    <section className="py-12 text-white">
      <Seo
        title="Регистрация — Знак отличия"
        description="Создайте аккаунт, чтобы публиковать объявления и управлять ими."
      />
      <div className="mx-auto flex max-w-2xl flex-col gap-6 rounded-3xl border border-white/10 bg-[#0F1624] px-6 py-8 shadow-xl sm:px-8">
        <PageTitle className="text-center">Регистрация</PageTitle>
        <p className="text-center text-sm text-white/70">
          Заполните форму, чтобы получить доступ к личному кабинету и публиковать объявления.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-xs uppercase tracking-wide text-white/60">
                Имя
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                className={INPUT_CLASSNAME}
                placeholder="Иван Иванов"
                {...formRegister("fullName")}
              />
              {errors.fullName ? (
                <p className="text-xs text-red-400">{errors.fullName.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs uppercase tracking-wide text-white/60">
                Почта
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={INPUT_CLASSNAME}
                placeholder="user@example.com"
                {...formRegister("email")}
              />
              {errors.email ? <p className="text-xs text-red-400">{errors.email.message}</p> : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phoneNumber" className="text-xs uppercase tracking-wide text-white/60">
                Телефон
              </label>
              <input
                id="phoneNumber"
                type="tel"
                autoComplete="tel"
                className={INPUT_CLASSNAME}
                placeholder="+7 (999) 123-45-67"
                {...formRegister("phoneNumber")}
              />
              {errors.phoneNumber ? (
                <p className="text-xs text-red-400">{errors.phoneNumber.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs uppercase tracking-wide text-white/60">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className={INPUT_CLASSNAME}
                placeholder="Придумайте пароль"
                {...formRegister("password")}
              />
              {errors.password ? (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-xs uppercase tracking-wide text-white/60">
                Повторите пароль
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={INPUT_CLASSNAME}
                placeholder="Повторите пароль"
                {...formRegister("confirmPassword")}
              />
              {errors.confirmPassword ? (
                <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
              ) : null}
            </div>
          </div>

          <label className="flex items-start gap-3 text-xs text-white/70">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border border-white/30 bg-transparent text-primary focus:ring-2 focus:ring-primary"
              {...formRegister("consent")}
            />
            <span>
              Согласен на обработку персональных данных и принимаю условия использования сервиса.
            </span>
          </label>

          {formError ? <p className="text-sm text-red-400">{formError}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Создаем аккаунт..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="text-center text-xs text-white/60">
          Уже есть аккаунт? {" "}
          <Link to={paths.auth.login} className="text-primary hover:underline">
            Войдите
          </Link>
        </p>
      </div>
    </section>
  );
}

const INPUT_CLASSNAME =
  "h-12 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary";

function extractErrorMessage(error: unknown): string {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const record = error as {
      message?: unknown;
      response?: { data?: { message?: unknown; error?: unknown } | string };
    };

    const responseData = record.response?.data;
    if (typeof responseData === "string" && responseData.trim()) {
      return responseData;
    }

    if (responseData && typeof responseData === "object") {
      const message = (responseData as { message?: unknown; error?: unknown }).message;
      const apiError = (responseData as { message?: unknown; error?: unknown }).error;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
      if (typeof apiError === "string" && apiError.trim()) {
        return apiError;
      }
    }

    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
  }

  return "Не удалось завершить регистрацию. Попробуйте снова.";
}
