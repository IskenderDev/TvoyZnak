import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthModal from "@/pages/main/auth/ui/AuthModal";
import AuthPageLayout from "@/pages/main/auth/ui/AuthPageLayout";
import Button from "@/shared/components/Button";
import { useAuth } from "@/shared/lib/hooks/useAuth";

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginDialogProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSuccess: (redirectTo?: string | null) => void;
  redirectTo: string | null;
}

const loginSchema = z.object({
  email: z.string().email("Введите корректный e-mail"),
  password: z.string().min(3, "Минимум 3 символа"),
});

export default function LoginDialog({
  onClose,
  onSwitchToRegister,
  onSuccess,
  redirectTo,
}: LoginDialogProps) {
  const titleId = useId();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values);
      reset();
      onSuccess(redirectTo ?? undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось войти";
      setServerError(message);
    }
  };

  return (
    <AuthModal onClose={onClose} labelledBy={titleId}>
      <AuthPageLayout
        title="Вход"
        subtitle={<span>Введите e-mail и пароль, чтобы управлять объявлениями.</span>}
        onClose={onClose}
        titleId={titleId}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="login-email" className="text-sm font-medium text-white/80">
              E-mail
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              className="h-11 w-full rounded-[10px] border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="example@mail.ru"
              {...register("email")}
            />
            {errors.email ? <p className="text-xs text-red-300">{errors.email.message}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="login-password" className="text-sm font-medium text-white/80">
              Пароль
            </label>
            <input
              id="login-password"
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
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary underline-offset-4 hover:underline"
            >
              Зарегистрируйтесь
            </button>
          </p>
        </form>
      </AuthPageLayout>
    </AuthModal>
  );
}
