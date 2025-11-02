import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { paths } from "@/shared/routes/paths";

const schema = z.object({
  fullName: z.string().min(3, "Укажите ФИО"),
  email: z.string().email("Невалидный email"),
  phoneNumber: z.string().min(6, "Укажите телефон"),
  password: z.string().min(6, "Минимум 6 символов"),
});

export type RegisterFormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const { register: registerUser, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
  });

  if (isAuthenticated) {
    return <Navigate to={paths.carNumberLots.root} replace />;
  }

  return (
    <section className="flex flex-col items-center gap-6 py-10">
      <div className="mx-auto w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900/60 p-6">
        <h1 className="mb-6 text-2xl font-semibold text-white">Регистрация</h1>
        <form
          onSubmit={handleSubmit(async (values) => {
            try {
              await registerUser(values);
              toast.success("Аккаунт создан");
              navigate(paths.carNumberLots.root);
            } catch (error) {
              console.error(error);
              toast.error("Не удалось создать аккаунт");
            }
          })}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-400">ФИО</span>
            <input
              type="text"
              {...register("fullName")}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
            {errors.fullName && <span className="text-xs text-red-400">{errors.fullName.message}</span>}
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-400">Email</span>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
            {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-400">Телефон</span>
            <input
              type="tel"
              {...register("phoneNumber")}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
            {errors.phoneNumber && <span className="text-xs text-red-400">{errors.phoneNumber.message}</span>}
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-zinc-400">Пароль</span>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
            {errors.password && <span className="text-xs text-red-400">{errors.password.message}</span>}
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-700"
          >
            {loading ? "Загрузка..." : "Создать аккаунт"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default RegisterPage;
