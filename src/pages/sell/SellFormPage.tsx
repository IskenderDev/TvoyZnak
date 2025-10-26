import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Seo from "@/shared/components/Seo";
import { SellForm, SellFormSchema, type SellFormValues } from "@/pages/sell/components/SellForm";
import { numbersApi } from "@/shared/services/numbersApi";
import { useAuth } from "@/shared/contexts/AuthProvider";
import { parseNextParam, resolveNextPath } from "@/shared/lib/navigation";
import { paths } from "@/shared/routes/paths";

export default function SellFormPage() {
  const form = useForm<SellFormValues>({
    resolver: zodResolver(SellFormSchema),
    defaultValues: {
      plate: "",
      region: "",
      comment: "",
      consent: false,
    } as Partial<SellFormValues>,
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nextParam = parseNextParam(location.search);

  const handleSubmit = useCallback(
    async (values: SellFormValues) => {
      try {
        const listing = await numbersApi.create({
          plate: values.plate,
          region: values.region,
          price: values.price,
          comment: values.comment,
          phone: user?.phone ?? user?.phoneNumber ?? undefined,
        });

        toast.success("Объявление размещено");
        const target = resolveNextPath(nextParam, paths.profileListing(String(listing.id)));
        navigate(target, { replace: true });
      } catch (error) {
        let message = "Не удалось разместить объявление";

        if (isAxiosError(error)) {
          const data = error.response?.data as
            | {
                message?: string;
                errors?: Record<string, string | string[]>;
              }
            | undefined;

          if (data?.errors) {
            Object.entries(data.errors).forEach(([field, value]) => {
              if (field in values) {
                const messageValue = Array.isArray(value) ? value[0] : value;
                form.setError(field as keyof SellFormValues, {
                  type: "server",
                  message: messageValue || "Проверьте поле",
                });
              }
            });
          }

          if (data?.message) {
            message = data.message;
          } else if (typeof error.response?.status === "number") {
            if (error.response.status === 400) {
              message = "Проверьте правильность заполнения формы";
            } else if (error.response.status >= 500) {
              message = "Сервер временно недоступен";
            }
          }
        }

        toast.error(message);
      }
    },
    [form, navigate, nextParam, user?.phone, user?.phoneNumber],
  );

  return (
    <section className="py-16 text-white">
      <Seo
        title="Разместить объявление — Знак отличия"
        description="Добавьте новый автомобильный номер на маркетплейс"
      />
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-[#080C16] px-6 py-10 shadow-xl sm:px-10">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Продажа номера</p>
          <h1 className="text-3xl font-actay-wide uppercase sm:text-4xl">Чистая публикация</h1>
          <p className="text-sm text-white/60">
            Укажите данные номера и стоимость — объявление появится в каталоге после проверки.
          </p>
        </div>

        <SellForm
          form={form}
          onSubmit={handleSubmit}
          isSubmitting={form.formState.isSubmitting}
        />
      </div>
    </section>
  );
}
