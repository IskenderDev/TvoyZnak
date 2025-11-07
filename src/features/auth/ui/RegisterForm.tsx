import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuEye, LuEyeOff } from "react-icons/lu";

import Button from "@/shared/components/Button";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import type { AuthSession } from "@/entities/session/model/auth";

const passwordSchema = z
  .string({ required_error: "Введите пароль" })
  .min(3, "Минимум 3 символов")
  .max(64, "Максимум 64 символа");

const optionalNameSchema = z
  .string()
  .trim()
  .max(80, "Максимум 80 символов")
  .optional()
  .refine((value) => (value ? value.length >= 2 : true), {
    message: "Укажите имя",
  });

const optionalPhoneSchema = z
  .string()
  .trim()
  .max(20, "Максимум 20 символов")
  .optional()
  .refine((value) => (value ? /^[+\d][\d\s()+-]{7,}$/u.test(value) : true), {
    message: "Введите корректный телефон",
  });

const registerSchema = z
  .object({
    fullName: optionalNameSchema,
    email: z
      .string({ required_error: "Введите e-mail" })
      .trim()
      .min(1, "Введите e-mail")
      .email("Введите корректный e-mail"),
    phoneNumber: optionalPhoneSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess: (session: AuthSession) => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const defaultValues = useMemo<RegisterFormValues>(
    () => ({
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);

    try {
      const session = await registerUser({
        fullName: values.fullName?.trim() || undefined,
        email: values.email.trim(),
        phoneNumber: values.phoneNumber?.trim() || undefined,
        password: values.password,
      });
      onSuccess(session);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось зарегистрироваться";
      setServerError(message);
      setFocus("password");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="register-name" className="text-sm font-medium text-white/80">
          Имя и фамилия <span className="text-white/40">(необязательно)</span>
        </label>
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="Иван Иванов"
          {...register("fullName")}
        />
        {errors.fullName ? (
          <p className="text-xs text-rose-300" role="alert">
            {errors.fullName.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="register-email" className="text-sm font-medium text-white/80">
          E-mail
        </label>
        <input
          id="register-email"
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
        <label htmlFor="register-phone" className="text-sm font-medium text-white/80">
          Телефон <span className="text-white/40">(необязательно)</span>
        </label>
        <input
          id="register-phone"
          type="tel"
          autoComplete="tel"
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="+7 (900) 000-00-00"
          {...register("phoneNumber")}
        />
        {errors.phoneNumber ? (
          <p className="text-xs text-rose-300" role="alert">
            {errors.phoneNumber.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="register-password" className="text-sm font-medium text-white/80">
          Пароль
        </label>
        <div className="relative">
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 pr-12 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Придумайте пароль"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
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

      <div className="flex flex-col gap-2">
        <label htmlFor="register-confirm" className="text-sm font-medium text-white/80">
          Подтверждение пароля
        </label>
        <div className="relative">
          <input
            id="register-confirm"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 pr-12 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Повторите пароль"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-white/60 transition hover:text-white"
            aria-label={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
            aria-pressed={showConfirmPassword}
          >
            {showConfirmPassword ? <LuEyeOff className="h-5 w-5" /> : <LuEye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword ? (
          <p className="text-xs text-rose-300" role="alert">
            {errors.confirmPassword.message}
          </p>
        ) : null}
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
            Регистрируем…
          </span>
        ) : (
          "Зарегистрироваться"
        )}
      </Button>

      <p className="text-center text-sm text-white/70">
        Уже есть аккаунт?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary underline-offset-4 transition hover:underline"
        >
          Войдите
        </button>
      </p>
    </form>
  );
}
