import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Невалидный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

export type AuthFormValues = z.infer<typeof authSchema>;

interface Props {
  title: string;
  submitText: string;
  defaultValues?: Partial<AuthFormValues>;
  onSubmit: (values: AuthFormValues) => Promise<void> | void;
  extraFields?: React.ReactNode;
  loading?: boolean;
}

export function AuthForm({ title, submitText, defaultValues, onSubmit, extraFields, loading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues,
  });

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900/60 p-6">
      <h1 className="mb-6 text-2xl font-semibold text-white">{title}</h1>
      <form
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
        })}
        className="flex flex-col gap-4"
      >
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
          <span className="text-sm text-zinc-400">Пароль</span>
          <input
            type="password"
            {...register("password")}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
          {errors.password && <span className="text-xs text-red-400">{errors.password.message}</span>}
        </label>
        {extraFields}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-700"
        >
          {loading ? "Загрузка..." : submitText}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;
