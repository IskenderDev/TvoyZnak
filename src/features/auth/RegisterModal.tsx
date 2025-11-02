import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Modal from "@/shared/ui/Modal";
import { useAuth } from "@/shared/hooks/useAuth";

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
  const { register: registerUser } = useAuth();
  const {
    register: formRegister,
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
    if (!open || typeof window === "undefined") {
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
      await registerUser({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
      });

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
      toast.error(extractErrorMessage(error));
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
                {...formRegister("fullName")}
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
                placeholder="example@mail.ru"
                className="h-11 w-full rounded-[10px] bg-white px-4 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-primary"
                {...formRegister("email")}
              />
              {errors.email ? <p className="mt-2 text-xs text-red-400">{errors.email.message}</p> : null}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium text-white/80">
                Телефон
              </label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                className="h-11 w-full rounded-[10px] bg-white px-4 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-primary"
                {...formRegister("phoneNumber")}
              />
              {errors.phoneNumber ? (
                <p className="mt-2 text-xs text-red-400">{errors.phoneNumber.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-white/80">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                placeholder="Минимум 6 символов"
                className="h-11 w-full rounded-[10px] bg-white px-4 text-[14px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-primary"
                {...formRegister("password")}
              />
              {errors.password ? (
                <p className="mt-2 text-xs text-red-400">{errors.password.message}</p>
              ) : null}
            </div>
          </div>

          <label htmlFor="agree" className="flex items-start gap-3 text-sm text-white/70">
            <input
              type="checkbox"
              id="agree"
              className="mt-1 h-4 w-4 rounded border border-white/30 bg-transparent text-primary focus:ring-2 focus:ring-primary"
              {...formRegister("agree")}
            />
            <span>
              Я соглашаюсь на обработку персональных данных и подтверждаю согласие с политикой конфиденциальности.
            </span>
          </label>

          <label htmlFor="remember" className="flex items-center gap-2 text-xs text-white/60">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border border-white/30 bg-transparent text-primary focus:ring-2 focus:ring-primary"
              {...formRegister("remember")}
            />
            Запомнить выбор при следующем открытии
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </Modal>
  );
}

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

  return "Не удалось зарегистрироваться. Попробуйте снова.";
}
