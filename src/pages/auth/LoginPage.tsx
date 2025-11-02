import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";

import PageTitle from "@/shared/components/PageTitle";
import Seo from "@/shared/components/Seo";
import { useAuth } from "@/shared/hooks/useAuth";
import { paths } from "@/shared/routes/paths";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LocationState = {
  from?: { pathname?: string };
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedEmail = window.localStorage.getItem("auth:rememberEmail");
    if (savedEmail) {
      setValue("email", savedEmail);
      setValue("remember", true);
    }
  }, [setValue]);

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);

    try {
      await login({ email: values.email.trim(), password: values.password });

      if (typeof window !== "undefined") {
        if (values.remember) {
          window.localStorage.setItem("auth:rememberEmail", values.email.trim());
        } else {
          window.localStorage.removeItem("auth:rememberEmail");
        }
      }

      const state = (location.state as LocationState | null) ?? null;
      const redirectPath = state?.from?.pathname ?? paths.profile;
      navigate(redirectPath, { replace: true });
    } catch (error) {
      const message = extractErrorMessage(error);
      setFormError(message);
    }
  };

  return (
    <section className="py-12 text-white">
      <Seo
        title="Вход — Знак отличия"
        description="Авторизация для управления объявлениями и доступ к личному кабинету."
      />
      <div className="mx-auto flex max-w-xl flex-col gap-6 rounded-3xl border border-white/10 bg-[#0F1624] px-6 py-8 shadow-xl sm:px-8">
        <PageTitle className="text-center">Вход</PageTitle>
        <p className="text-center text-sm text-white/70">
          Введите почту и пароль, чтобы перейти в личный кабинет.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
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
              {errors.email ? (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs uppercase tracking-wide text-white/60">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={INPUT_CLASSNAME}
                placeholder="Введите пароль"
                {...formRegister("password")}
              />
              {errors.password ? (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              ) : null}
            </div>

            <label className="flex items-center gap-2 text-xs text-white/70">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border border-white/30 bg-transparent text-primary focus:ring-2 focus:ring-primary"
                {...formRegister("remember")}
              />
              Запомнить почту
            </label>
          </div>

          {formError ? <p className="text-sm text-red-400">{formError}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Входим..." : "Войти"}
          </button>
        </form>

        <p className="text-center text-xs text-white/60">
          Нет аккаунта? {" "}
          <Link to={paths.auth.register} className="text-primary hover:underline">
            Зарегистрируйтесь
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

  return "Не удалось войти. Проверьте данные и попробуйте снова.";
}
