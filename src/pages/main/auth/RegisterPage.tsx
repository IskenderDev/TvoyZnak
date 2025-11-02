import { useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import HomePage from "@/pages/main/home/HomePage";
import AuthModal from "@/pages/main/auth/ui/AuthModal";
import AuthPageLayout from "@/pages/main/auth/ui/AuthPageLayout";
import Seo from "@/shared/components/Seo";
import Button from "@/shared/components/Button";
import { paths } from "@/shared/routes/paths";
import { useAuth } from "@/shared/lib/hooks/useAuth";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Укажите имя"),
    email: z.string().email("Введите корректный e-mail"),
    phoneNumber: z
      .string()
      .min(8, "Введите телефон")
      .max(18, "Введите телефон")
      .refine((value) => /^[+\d][\d\s()+-]{7,}$/u.test(value), "Введите телефон"),
    password: z.string().min(3, "Минимум 3 символа"),
    confirmPassword: z.string().min(3, "Минимум 3 символа"),
    agree: z.literal(true, { errorMap: () => ({ message: "Подтвердите согласие с обработкой" }) }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const titleId = useId();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    setSuccessMessage(null);
    try {
      await registerUser({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
      });
      setSuccessMessage("Регистрация успешна. Вы вошли в систему.");
      navigate(paths.profile, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось зарегистрироваться";
      setServerError(message);
    }
  };

  const handleClose = () => {
    const historyState = window.history.state as { idx?: number } | null;
    if (historyState?.idx && historyState.idx > 0) {
      navigate(-1);
      return;
    }
    navigate(paths.home, { replace: true });
  };

  return (
    <>
      <Seo title="Регистрация — Знак отличия" description="Создание нового аккаунта для покупки и продажи номеров." />
      <HomePage hideSeo />
      <AuthModal onClose={handleClose} labelledBy={titleId}>
        <AuthPageLayout
          title="Регистрация"
          subtitle={
            <span>
              Заполните форму, чтобы получить доступ к личному кабинету. После регистрации вы автоматически будете авторизованы.
            </span>
          }
          onClose={handleClose}
          titleId={titleId}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-sm font-medium text-white/80">
                Имя и фамилия
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                className="h-11 w-full rounded-[10px] border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Иван Иванов"
                {...register("fullName")}
              />
              {errors.fullName ? <p className="text-xs text-red-300">{errors.fullName.message}</p> : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-white/80">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="h-11 w-full rounded-[10px] border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="example@mail.ru"
                {...register("email")}
              />
              {errors.email ? <p className="text-xs text-red-300">{errors.email.message}</p> : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium text-white/80">
                Телефон
              </label>
              <input
                id="phoneNumber"
                type="tel"
                autoComplete="tel"
                className="h-11 w-full rounded-[10px] border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="+7 (900) 000-00-00"
                {...register("phoneNumber")}
              />
              {errors.phoneNumber ? <p className="text-xs text-red-300">{errors.phoneNumber.message}</p> : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-white/80">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className="h-11 w-full rounded-[10px] border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Введите пароль"
                {...register("password")}
              />
              {errors.password ? <p className="text-xs text-red-300">{errors.password.message}</p> : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-white/80">
                Подтверждение пароля
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="h-11 w-full rounded-[10px] border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Повторите пароль"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword ? <p className="text-xs text-red-300">{errors.confirmPassword.message}</p> : null}
            </div>

            <label className="flex items-start gap-3 text-xs text-white/70">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary/60"
                {...register("agree")}
              />
              <span>
                Я соглашаюсь с обработкой персональных данных и принимаю условия {" "}
                <a href="/docs/privacy.pdf" className="text-primary underline-offset-4 hover:underline">
                  политики конфиденциальности
                </a>
                .
              </span>
            </label>
            {errors.agree ? <p className="text-xs text-red-300">{errors.agree.message}</p> : null}

            {serverError ? (
              <p className="text-sm text-red-300" role="alert">
                {serverError}
              </p>
            ) : null}

            {successMessage ? <p className="text-sm text-emerald-300">{successMessage}</p> : null}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Регистрируем…" : "Зарегистрироваться"}
            </Button>

            <p className="text-center text-xs text-white/60">
              Уже есть аккаунт? {" "}
              <Link to={paths.auth.login} className="text-primary underline-offset-4 hover:underline">
                Войдите
              </Link>
            </p>
          </form>
        </AuthPageLayout>
      </AuthModal>
    </>
  );
}
