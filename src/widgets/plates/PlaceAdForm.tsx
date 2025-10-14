// pages/PlaceAdPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import UiSelect from "@/shared/components/UiSelect";
import Toast from "@/shared/components/Toast";
import { useLeadSubmit, type LeadFormPayload } from "@/shared/hooks/useLeadSubmit";
import PlateSelectForm from '@/shared/components/plate/PlateSelectForm'

type LeadForm = LeadFormPayload & {
  email?: string;
  password: string;
  price: string;
  comment?: string;
};

type PlateSelectValue = { text: string; region: string };

const TYPE_OPTIONS = [
  { label: "Купить номер", value: "buy" },
  { label: "Продать номер", value: "sell" },
];

const INITIAL_PLATE: PlateSelectValue = { text: "******", region: "*" };

export default function PlaceAdPage() {
  // --- отправка
  const { submit, loading, error, success } = useLeadSubmit();

  // --- Toast
  const [toast, setToast] =
    useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    if (error) setToast({ type: "error", msg: `Не удалось отправить: ${error}` });
    if (success) setToast({ type: "success", msg: "Заявка успешно отправлена!" });
  }, [error, success]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // --- форма
  const [formData, setFormData] = useState<LeadForm>({
    name: "",
    phone: "",
    type: "",
    number: "",
    consent: false,
    email: "",
    password: "",
    price: "",
    comment: "",
  });

  // --- состояние номера (контролируем PlateSelectForm, чтобы можно было сбрасывать)
  const [plate, setPlate] = useState<PlateSelectValue>(INITIAL_PLATE);

  // Собранная строка номера формата A000AA-REGION
  const composedNumber = useMemo(() => {
    const cleanText = (plate.text || "").replace(/\*/g, "");
    const cleanRegion = (plate.region || "").replace(/\*/g, "");
    return [cleanText, cleanRegion].filter(Boolean).join("-");
  }, [plate]);

  // синхронизируем number в formData при любом изменении слотов
  useEffect(() => {
    setFormData((p) => ({ ...p, number: composedNumber }));
  }, [composedNumber]);

  // валидация (кнопка неактивна, пока не выполнены условия)
  const isSubmitDisabled =
    loading ||
    !formData.name.trim() ||
    !formData.phone.trim() ||
    !formData.password.trim() ||
    !formData.price.trim() ||
    !formData.type ||
    !formData.consent;

  // обработчик селекта действия (поддержка разных сигнатур onChange)
  const handleTypeChange = (v: unknown) => {
    const value =
      typeof v === "string" ? v : (v as { value?: string })?.value ?? "";
  };

  // отправка
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    await submit({
      name: formData.name,
      phone: formData.phone,
      type: formData.type,
      number: formData.number, // может быть пустым — это ок
      consent: formData.consent,
    });

    // При успехе — сброс (сам success ловим эффектом для тоста)
    // Делаем мягкий сброс, иначе, если была ошибка — не теряем данные
    // Сбрасываем только когда success === true
  };

  // как только success стал true — очищаем форму и табличку
  useEffect(() => {
    if (!success) return;
    setFormData({
      name: "",
      phone: "",
      type: "",
      number: "",
      consent: false,
      email: "",
      password: "",
      price: "",
      comment: "",
    });
    setPlate(INITIAL_PLATE);
  }, [success]);

  // общие классы инпутов
  const inputBase =
    "bg-[#F8F9FA] text-black placeholder-[#777] rounded-lg px-4 py-3 " +
    "outline-none focus:ring-2 focus:ring-[#1E63FF]";

  return (
    <section className="bg-[#0B0B0C] text-white py-12 md:py-16" aria-label="Размещение объявления">

      <div className="max-w-[900px] mx-auto px-5 sm:px-8">
        <h2 className="text-center text-3xl md:text-4xl font-bold uppercase font-actay-wide">
          Оставьте заявку!
        </h2>
        <p className="text-center text-neutral-300 mt-2 text-sm md:text-base">
          Все сделки сопровождаются юридической поддержкой, а номера подбираются
          только из проверенных источников.
        </p>

        {/* Номер */}
        <div className="mt-6 md:mt-8">
          <PlateSelectForm
            size="lg"
            responsive
            flagSrc="/flag-russia.svg"
            showCaption={false}
            className="mx-auto"
          />
        </div>

        {/* Форма */}
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              inputMode="text"
              className={inputBase}
              placeholder="Имя *"
              aria-label="Имя"
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name: e.target.value }))
              }
              required
            />

            <input
              type="tel"
              inputMode="tel"
              className={inputBase}
              placeholder="Телефон *"
              aria-label="Телефон"
              value={formData.phone}
              onChange={(e) =>
                setFormData((p) => ({ ...p, phone: e.target.value }))
              }
              required
            />

            <input
              type="email"
              inputMode="email"
              className={inputBase}
              placeholder="Почта *"
              aria-label="Почта"
              value={formData.email}
              onChange={(e) =>
                setFormData((p) => ({ ...p, email: e.target.value }))
              }
            />

            <input
              type="password"
              className={inputBase}
              placeholder="Пароль *"
              aria-label="Пароль"
              value={formData.password}
              onChange={(e) =>
                setFormData((p) => ({ ...p, password: e.target.value }))
              }
              required
            />

            <input
              type="text"
              inputMode="numeric"
              className={inputBase + " sm:col-span-2"}
              placeholder="Стоимость *"
              aria-label="Стоимость"
              value={formData.price}
              onChange={(e) =>
                setFormData((p) => ({ ...p, price: e.target.value }))
              }
              required
            />
          </div>

          {/* красная сноска под Стоимостью */}
          <p className="text-[12px] text-[#FF6B6B]">
            * При публикации объявления к конечной стоимости добавляется комиссия
            в размере 10–30% минимум
          </p>

          {/* Выбор действия */}
          <UiSelect
            name="type"
            placeholder="Выберите действие *"
            options={TYPE_OPTIONS}
            value={formData.type}
            onChange={handleTypeChange}
          />

          {/* Комментарий */}
          <textarea
            className={inputBase + " w-full min-h-[110px] resize-y"}
            placeholder="Комментарий"
            aria-label="Комментарий"
            value={formData.comment}
            onChange={(e) =>
              setFormData((p) => ({ ...p, comment: e.target.value }))
            }
          />

          {/* Чекбокс согласия */}
          <div className="flex items-start gap-2">
            <input
              id="consent"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border border-white/30 bg-white/10 focus:ring-2 focus:ring-[#1E63FF]"
              checked={formData.consent}
              onChange={(e) =>
                setFormData((p) => ({ ...p, consent: e.target.checked }))
              }
              required
            />
            <label htmlFor="consent" className="text-[13px] leading-[1.4]">
              Я согласен на обработку персональных данных *
            </label>
          </div>

          {/* Кнопка */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="rounded-full w-full sm:w-auto px-10 py-3 bg-[#1E63FF] hover:bg-[#1557E0] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
              aria-label="Разместить объявление"
            >
              {loading ? "Отправка..." : "Разместить"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
