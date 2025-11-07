import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  remember: z.boolean().default(false),
  consent: z
    .boolean()
    .default(false)
    .refine((value) => value, "Необходимо согласие"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: (session: AuthSession) => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setFocus,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
      consent: false,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

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
    <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-6" noValidate>
      <div className="flex flex-col gap-4">
        <div>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="Почта *"
            aria-invalid={errors.email ? "true" : "false"}
            className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#0B0B0C] placeholder:text-[#8F9BB3] focus:outline-none focus:border-[#1E66FF] focus:ring-4 focus:ring-[rgba(30,102,255,0.12)] sm:h-12"
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-[#EF4444]" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Пароль *"
            aria-invalid={errors.password ? "true" : "false"}
            className="h-11 w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#0B0B0C] placeholder:text-[#8F9BB3] focus:outline-none focus:border-[#1E66FF] focus:ring-4 focus:ring-[rgba(30,102,255,0.12)] sm:h-12"
            {...register("password")}
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-[#EF4444]" role="alert">
              {errors.password.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 text-[13px] text-slate-300">
        <div>
          <label className="flex items-start gap-3">
            <input type="checkbox" className="peer sr-only" {...register("consent")} />
            <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-[4px] border border-[#94A3B8] bg-transparent transition peer-checked:border-[#1E66FF] peer-checked:bg-[#1E66FF]">
              <svg
                className="h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M13.5 4.5L6.5 11.5L3 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="leading-snug">
              Я согласен на обработку персональных данных *
            </span>
          </label>
          {errors.consent ? (
            <p className="mt-1 text-xs text-[#EF4444]" role="alert">
              {errors.consent.message}
            </p>
          ) : null}
        </div>

        <label className="flex items-start gap-3">
          <input type="checkbox" className="peer sr-only" {...register("remember")} />
          <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-[4px] border border-[#94A3B8] bg-transparent transition peer-checked:border-[#1E66FF] peer-checked:bg-[#1E66FF]">
            <svg
              className="h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M13.5 4.5L6.5 11.5L3 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="leading-snug">Запомнить меня</span>
        </label>
      </div>

      {serverError ? (
        <p className="rounded-[12px] border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]" role="alert">
          {serverError}
        </p>
      ) : null}

      <div className="mt-auto flex flex-col gap-3">
        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="h-12 w-full rounded-[10px] bg-[#1E66FF] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
              Подождите…
            </span>
          ) : (
            "Войти"
          )}
        </Button>

        <button
          type="button"
          onClick={onSwitchToRegister}
          className="h-12 w-full rounded-[10px] bg-[#3B3B3B] text-sm font-semibold text-[#E5E7EB] transition hover:bg-[#4B4B4B]"
        >
          Зарегистрироваться
        </button>
      </div>
    </form>
  );
}
