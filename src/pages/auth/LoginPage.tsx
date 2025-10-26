import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Seo from "@/shared/components/Seo";
import { useAuth } from "@/shared/contexts/AuthProvider";
import { parseNextParam, resolveNextPath } from "@/shared/lib/navigation";
import { paths } from "@/shared/routes/paths";

const LoginSchema = z.object({
  email: z.string().email("Введите корректную почту"),
  password: z.string().min(6, "Минимум 6 символов"),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nextParam = parseNextParam(location.search);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await auth.login(values.email, values.password);
      toast.success("Вы успешно вошли");
      const target = resolveNextPath(nextParam, paths.profile);
      navigate(target, { replace: true });
    } catch (error) {
      let message = "Не удалось войти";

      if (isAxiosError(error)) {
        const data = error.response?.data as
          | {
              message?: string;
              errors?: Record<string, string | string[]>;
            }
          | undefined;

        if (data?.errors?.email) {
          const emailMessage = Array.isArray(data.errors.email)
            ? data.errors.email[0]
            : data.errors.email;
          form.setError("email", { type: "server", message: emailMessage || message });
        }

        if (data?.errors?.password) {
          const passwordMessage = Array.isArray(data.errors.password)
            ? data.errors.password[0]
            : data.errors.password;
          form.setError("password", { type: "server", message: passwordMessage || message });
        }

        if (data?.message) {
          message = data.message;
        } else if (error.response?.status === 401) {
          message = "Неверная почта или пароль";
        } else if (error.response?.status && error.response.status >= 500) {
          message = "Сервер временно недоступен";
        }
      }

      toast.error(message);
    }
  };

  const {
    register,
    handleSubmit: submitForm,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <section className="py-16 text-white">
      <Seo title="Вход — Знак отличия" description="Авторизуйтесь, чтобы управлять объявлениями" />
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-[#080C16] px-6 py-10 shadow-2xl sm:px-10">
        <h1 className="text-3xl font-actay-wide uppercase text-center">Вход</h1>
        <p className="mt-2 text-center text-sm text-white/60">
          Введите почту и пароль, чтобы перейти в личный кабинет.
        </p>

        <form onSubmit={submitForm(handleSubmit)} className="mt-8 space-y-6" noValidate>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-white/80">
              Почта
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
              Пароль
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

          <button
            type="submit"
            className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#0074FF] to-[#005CDB] text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Входим…" : "Войти"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/50">
          Нет аккаунта? {" "}
          <Link to={paths.auth.register} className="text-[#4B89FF] transition hover:text-white">
            Зарегистрируйтесь
          </Link>
        </p>
      </div>
    </section>
  );
}
