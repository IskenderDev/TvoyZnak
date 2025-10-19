import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

import Modal from "@/shared/ui/Modal";
import apiClient from "@/shared/api/client";
import { useAuth, type AuthUser } from "@/shared/hooks/useAuth";

const registerSchema = z.object({
  fullName: z.string().min(1, "Укажите имя"),
  email: z.string().email("Введите почту"),
  phoneNumber: z
    .string()
    .min(8, "Введите телефон")
    .max(18, "Введите телефон")
    .refine((value) => /^[+\d][\d\s()+-]{7,}$/u.test(value), "Введите телефон"),
  password: z.string().min(6, "Минимум 6 символов"),
  agree: z
    .boolean()
    .refine((value) => value, "Подтвердите согласие…"),
  remember: z.boolean().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

type RegisterModalProps = {
  open: boolean;
  onClose: () => void;
};

const rememberKey = "registerRemember";

export default function RegisterModal({ open, onClose }: RegisterModalProps) {
  const { setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      agree: false,
      remember: false,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const savedRemember = window.localStorage.getItem(rememberKey);
    if (savedRemember) {
      setValue("remember", savedRemember === "true");
    }
  }, [open, setValue]);

  const handleClose = () => {
    const rememberDefault =
      typeof window !== "undefined" && window.localStorage.getItem(rememberKey) === "true";

    reset({
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      agree: false,
      remember: rememberDefault,
    });
    onClose();
  };

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const response = await apiClient.post("/api/auth/register", {
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
      });

      const rawData = (response?.data as { user?: unknown } | undefined) ?? undefined;
      const userData = (rawData && typeof rawData === "object" && "user" in rawData
        ? (rawData as { user?: AuthUser | Record<string, unknown> }).user
        : response?.data) as AuthUser | Record<string, unknown> | undefined;

      const normalizedUser: AuthUser = {
        id:
          userData && typeof userData === "object" && "id" in userData
            ? (userData as { id?: AuthUser["id"] }).id
            : undefined,
        fullName:
          (userData && typeof userData === "object" && "fullName" in userData
            ? (userData as { fullName?: string }).fullName
            : undefined) ?? values.fullName,
        email:
          userData && typeof userData === "object" && "email" in userData
            ? (userData as { email?: string }).email
            : values.email,
        phoneNumber:
          userData && typeof userData === "object" && "phoneNumber" in userData
            ? (userData as { phoneNumber?: string }).phoneNumber
            : values.phoneNumber,
        role:
          userData && typeof userData === "object" && "role" in userData
            ? normalizeRole((userData as { role?: unknown }).role)
            : undefined,
        token:
          userData && typeof userData === "object" && "token" in userData
            ? (userData as { token?: string }).token
            : undefined,
      };

      normalizedUser.fullName = normalizedUser.fullName?.trim() ?? values.fullName.trim();
      normalizedUser.email = normalizedUser.email?.trim() ?? values.email.trim();
      normalizedUser.phoneNumber =
        normalizedUser.phoneNumber?.trim() ?? values.phoneNumber.trim();

      setUser(normalizedUser);

      if (typeof window !== "undefined") {
        if (values.remember) {
          window.localStorage.setItem(rememberKey, "true");
        } else {
          window.localStorage.removeItem(rememberKey);
        }
      }

      toast.success("Регистрация успешна");
      handleClose();
    } catch (error) {
      let message = "Не удалось зарегистрироваться";

      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string; error?: string } | string | undefined;
        if (typeof data === "string" && data.trim()) {
          message = data;
        } else if (data && typeof data === "object") {
          message = data.message || data.error || message;
        }
      }

      toast.error(message);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="relative mx-auto w-full max-w-[700px] rounded-2xl bg-[#0B0B0C] px-6 py-7 text-white md:px-8 md:py-8">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-6 top-6 text-white/60 transition hover:text-white"
          aria-label="Закрыть модальное окно"
        >
          ×
        </button>

        <h2 className="mb-6 text-[22px] font-semibold uppercase tracking-wide text-primary">
          ЗАРЕГИСТРИРОВАТЬСЯ
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-white/80">
                Имя
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Введите имя"
                className="h-11 w-full rounded-[10px] bg-white px-4 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("fullName")}
              />
              {errors.fullName ? (
                <p className="mt-2 text-xs text-red-400">{errors.fullName.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/80">
                Почта <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@mail.com"
                className="h-11 w-full rounded-[10px] bg-white px-4 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("email")}
              />
              {errors.email ? (
                <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium text-white/80">
                Телефон <span className="text-red-400">*</span>
              </label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="+996 700 000 000"
                className="h-11 w-full rounded-[10px] bg-white px-4 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("phoneNumber")}
              />
              {errors.phoneNumber ? (
                <p className="mt-2 text-xs text-red-400">{errors.phoneNumber.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-white/80">
                Пароль <span className="text-red-400">*</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="Введите пароль"
                className="h-11 w-full rounded-[10px] bg-white px-4 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("password")}
              />
              {errors.password ? (
                <p className="mt-2 text-xs text-red-400">{errors.password.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 text-sm text-white/80">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 accent-[#0177FF]"
                {...register("agree")}
              />
              <span>
                Я согласен на обработку персональных данных <span className="text-red-400">*</span>
              </span>
            </label>
            {errors.agree ? <p className="text-xs text-red-400">{errors.agree.message}</p> : null}

            <label className="flex items-center gap-3 text-sm text-white/80">
              <input type="checkbox" className="h-5 w-5 accent-[#0177FF]" {...register("remember")} />
              <span>Запомнить меня</span>
            </label>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-primary text-[15px] font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Регистрация…
                </>
              ) : (
                "Зарегистрироваться"
              )}
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center justify-center rounded-[10px] bg-[#3D3D3D] text-[15px] font-medium text-white transition hover:bg-[#4A4A4A]"
            >
              Вход
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

const normalizeRole = (value: unknown): AuthUser["role"] => {
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized === "admin" || normalized === "user") {
      return normalized;
    }
  }
  return undefined;
};
