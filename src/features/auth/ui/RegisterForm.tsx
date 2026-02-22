import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import Button from "@/shared/components/Button"
import ConsentNotice from "@/shared/components/ConsentNotice"
import { useAuth } from "@/shared/lib/hooks/useAuth"
import type { AuthSession } from "@/entities/session/model/auth"
import { useNavigate } from "react-router-dom"
import { paths } from "@/shared/routes/paths"
import PhoneInput from "@/shared/ui/PhoneInput"
import { isPhoneComplete } from "@/shared/lib/phone"

const registerSchema = z.object({
  fullName: z
    .string({ required_error: "Введите имя" })
    .trim()
    .min(2, "Введите имя"),
  email: z
    .string({ required_error: "Введите e-mail" })
    .trim()
    .min(1, "Введите e-mail")
    .email("Введите корректный e-mail"),
  phoneNumber: z
    .string({ required_error: "Введите телефон" })
    .refine(isPhoneComplete, "Введите номер телефона полностью"),
  password: z
    .string({ required_error: "Введите пароль" })
    .min(6, "Минимум 6 символов"),
  remember: z.boolean().default(false),
})

export type RegisterFormValues = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSuccess: (session: AuthSession) => void
  onSwitchToLogin: () => void
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { register: registerUser } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const navigate = useNavigate()

  const defaultValues = useMemo<RegisterFormValues>(
    () => ({
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      remember: false,
    }),
    [],
  )

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    setFocus,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    try {
      const session = await registerUser({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
      })
      onSuccess(session)
      const roleList = session.user.roles?.length
        ? session.user.roles
        : session.user.role
          ? [session.user.role]
          : []
      const isAdmin = roleList.includes("admin")
      navigate(isAdmin ? paths.admin.lots : paths.profile)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось зарегистрироваться"
      setServerError(message)
      setFocus("password")
    }
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-6" noValidate>
      <div className="flex flex-col gap-4">
        <div>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Имя *"
            aria-invalid={errors.fullName ? "true" : "false"}
            className="h-11 w-full rounded-4xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#0B0B0C] placeholder:text-[#8F9BB3] focus:outline-none focus:border-[#1E66FF] focus:ring-4 focus:ring-[rgba(30,102,255,0.12)] sm:h-12"
            {...register("fullName")}
          />
          {errors.fullName ? (
            <p className="mt-1 text-xs text-[#EF4444]" role="alert">
              {errors.fullName.message}
            </p>
          ) : null}
        </div>

        <div>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="Почта *"
            aria-invalid={errors.email ? "true" : "false"}
            className="h-11 w-full rounded-4xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#0B0B0C] placeholder:text-[#8F9BB3] focus:outline-none focus:border-[#1E66FF] focus:ring-4 focus:ring-[rgba(30,102,255,0.12)] sm:h-12"
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-[#EF4444]" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <PhoneInput
                id="register-phone"
                placeholder="Телефон *"
                aria-invalid={errors.phoneNumber ? "true" : "false"}
                className="h-11 w-full rounded-4xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#0B0B0C] placeholder:text-[#8F9BB3] focus:outline-none focus:border-[#1E66FF] focus:ring-4 focus:ring-[rgba(30,102,255,0.12)] sm:h-12"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          />
          {errors.phoneNumber ? (
            <p className="mt-1 text-xs text-[#EF4444]" role="alert">
              {errors.phoneNumber.message}
            </p>
          ) : null}
        </div>

        <div>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            placeholder="Пароль *"
            aria-invalid={errors.password ? "true" : "false"}
            className="h-11 w-full rounded-4xl border border-[#E5E7EB] bg-white px-4 text-sm text-[#0B0B0C] placeholder:text-[#8F9BB3] focus:outline-none focus:border-[#1E66FF] focus:ring-4 focus:ring-[rgba(30,102,255,0.12)] sm:h-12"
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
        <ConsentNotice />

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("remember")}
            className="mt-0.5 h-4 w-4 rounded-[4px] border border-[#94A3B8] text-[#1E66FF] transition-all duration-200"
          />
          <span className="leading-snug text-white mt-1 ">Запомнить меня</span>
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
          className="h-12 w-full rounded-4xl bg-[#1E66FF] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
            "Зарегистрироваться"
          )}
        </Button>

        <button
          type="button"
          onClick={onSwitchToLogin}
          className="h-12 w-full rounded-4xl bg-[#3B3B3B] text-sm font-semibold text-[#E5E7EB] transition hover:bg-[#4B4B4B]"
        >
          Вход
        </button>
      </div>
    </form>
  )
}
