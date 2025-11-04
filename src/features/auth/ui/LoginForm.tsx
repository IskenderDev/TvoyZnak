import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuEye, LuEyeOff } from "react-icons/lu";

import Button from "@/shared/components/Button";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import type { AuthSession } from "@/entities/session/model/auth";

const loginSchema = z.object({
  email: z
    .string({ required_error: "Введите e-mail" })
    .trim()
    .min(1, "Введите e-mail")
    .email("Введите корректный e-mail"),
  password: z
    .string({ required_error: "Введите пароль" })
    .min(6, "Минимум 6 символов"),
  remember: z.boolean().default(true),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: (session: AuthSession) => void;
  onSwitchToRegister: () => void;
  onForgotPassword?: () => void;
}

export default function LoginForm({
  onSuccess,
  onSwitchToRegister,
  onForgotPassword,
}: LoginFormProps) {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember: true,
    },
    mode: "onBlur",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);

    try {
      const session = await login({
        email: values.email.trim(),
        password: values.password,
        remember: values.remember,
      });
      onSuccess(session);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось войти";
      setServerError(message);
      setFocus("password");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="login-email" className="text-sm font-medium text-white/80">
          E-mail
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="example@mail.ru"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-xs text-rose-300" role="alert">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="login-password" className="text-sm font-medium text-white/80">
          Пароль
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 pr-12 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Введите пароль"
            {...register("password")}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center text-white/60 transition hover:text-white"
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            aria-pressed={showPassword}
          >
            {showPassword ? <LuEyeOff className="h-5 w-5" /> : <LuEye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password ? (
          <p className="text-xs text-rose-300" role="alert">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary/60"
            {...register("remember")}
          />
          <span>Запомнить меня</span>
        </label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="self-start text-primary underline-offset-4 transition hover:underline"
        >
          Забыли пароль?
        </button>
      </div>

      {serverError ? (
        <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200" role="alert">
          {serverError}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
            Входим…
          </span>
        ) : (
          "Войти"
        )}
      </Button>

      <p className="text-center text-sm text-white/70">
        Нет аккаунта?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-primary underline-offset-4 transition hover:underline"
        >
          Зарегистрируйтесь
        </button>
      </p>
    </form>
  );
}
