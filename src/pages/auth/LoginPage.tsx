import { useState } from "react";
import { Link, useLocation, useNavigate, type Location } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthPageLayout from "@/components/auth/AuthPageLayout";
import Seo from "@/shared/components/Seo";
import Button from "@/shared/components/Button";
import { paths } from "@/shared/routes/paths";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Введите корректный e-mail"),
  password: z.string().min(3, "Минимум 3 символа"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values); // вернёт { token: "session", user } из /api/auth/login
      const state = location.state as { from?: Location } | undefined;
      const redirectTo = state?.from?.pathname ?? paths.profile;
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось войти";
      setServerError(message);
    }
  };

  return (
    <>
      <Seo title="Вход — Знак отличия" description="Авторизация для зарегистрированных пользователей." />
      <AuthPageLayout
        title="Вход"
        subtitle={<span>Введите e-mail и пароль, чтобы управлять объявлениями.</span>}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
            <label htmlFor="password" className="text-sm font-medium text-white/80">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="h-11 w-full rounded-[10px] border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Введите пароль"
              {...register("password")}
            />
            {errors.password ? <p className="text-xs text-red-300">{errors.password.message}</p> : null}
          </div>

          {serverError ? (
            <p className="text-sm text-red-300" role="alert">
              {serverError}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Входим…" : "Войти"}
          </Button>

          <p className="text-center text-xs text-white/60">
            Нет аккаунта?{" "}
            <Link to={paths.auth.register} className="text-primary underline-offset-4 hover:underline">
              Зарегистрируйтесь
            </Link>
          </p>
        </form>
      </AuthPageLayout>
    </>
  );
}
