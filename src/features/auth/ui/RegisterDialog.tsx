import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthModal from "@/pages/main/auth/ui/AuthModal";
import AuthPageLayout from "@/pages/main/auth/ui/AuthPageLayout";
import Button from "@/shared/components/Button";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { isPasswordCompromised } from "@/shared/lib/security/passwordLeakCheck";

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterDialogProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSuccess: (redirectTo?: string | null) => void;
  redirectTo: string | null;
}

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

export default function RegisterDialog({
  onClose,
  onSwitchToLogin,
  onSuccess,
  redirectTo,
}: RegisterDialogProps) {
  const titleId = useId();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      const compromised = await isPasswordCompromised(values.password);
      if (compromised) {
        setServerError(
          "Этот пароль уже фигурирует в базах утечек. Пожалуйста, придумайте новый надёжный пароль.",
        );
        return;
      }

      await registerUser({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
      });
      reset();
      onSuccess(redirectTo ?? undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось зарегистрироваться";
      setServerError(message);
    }
  };

  return (
    <AuthModal onClose={onClose} labelledBy={titleId}>
      <AuthPageLayout
        title="Регистрация"
        subtitle={
          <span>
            Заполните форму, чтобы получить доступ к личному кабинету. После регистрации вы автоматически будете авторизованы.
          </span>
        }
        onClose={onClose}
        titleId={titleId}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="register-fullName" className="text-sm font-medium text-white/80">
              Имя и фамилия
            </label>
            <input
              id="register-fullName"
              type="text"
              autoComplete="name"
              className="h-11 w-full rounded-[10px] border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Иван Иванов"
              {...register("fullName")}
            />
            {errors.fullName ? <p className="text-xs text-red-300">{errors.fullName.message}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="register-email" className="text-sm font-medium text-white/80">
              E-mail
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              className="h-11 w-full rounded-[10px] border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="example@mail.ru"
              {...register("email")}
            />
            {errors.email ? <p className="text-xs text-red-300">{errors.email.message}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="register-phoneNumber" className="text-sm font-medium text-white/80">
              Телефон
            </label>
            <input
              id="register-phoneNumber"
              type="tel"
              autoComplete="tel"
              className="h-11 w-full rounded-[10px] border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="+7 (900) 000-00-00"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber ? <p className="text-xs text-red-300">{errors.phoneNumber.message}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="register-password" className="text-sm font-medium text-white/80">
              Пароль
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              className="h-11 w-full rounded-[10px] border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Введите пароль"
              {...register("password")}
            />
            {errors.password ? <p className="text-xs text-red-300">{errors.password.message}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="register-confirmPassword" className="text-sm font-medium text-white/80">
              Подтверждение пароля
            </label>
            <input
              id="register-confirmPassword"
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Регистрируем…" : "Зарегистрироваться"}
          </Button>

          <p className="text-center text-xs text-white/60">
            Уже есть аккаунт? {" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary underline-offset-4 hover:underline"
            >
              Войдите
            </button>
          </p>
        </form>
      </AuthPageLayout>
    </AuthModal>
  );
}
