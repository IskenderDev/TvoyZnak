import { useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";

import Modal from "@/shared/ui/Modal";
import Toast from "@/shared/components/Toast";
import PlateSelectForm from "@/features/plate-select/ui/PlateSelectForm";
import {
  DEFAULT_PLATE_VALUE,
  type PlateSelectValue,
} from "@/features/plate-select/model/types";
import { numbersApi } from "@/shared/services/numbersApi";
import type { NumberItem } from "@/entities/number/types";
import type { AdminLot } from "@/api/adminLots";

const INPUT_BASE =
  "bg-[#f9f9fa] text-black placeholder-[#777] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#1E63FF] border";

type ToastState = { type: "success" | "error"; msg: string } | null;

export type EditNumberModalSubmitPayload = {
  price: number;
  firstLetter: string;
  secondLetter: string;
  thirdLetter: string;
  firstDigit: string;
  secondDigit: string;
  thirdDigit: string;
  comment?: string;
  regionId: number;
};

type EditNumberModalLot = NumberItem | AdminLot;

type EditNumberModalSubmitHandler<TLot extends EditNumberModalLot> = (
  lot: TLot,
  payload: EditNumberModalSubmitPayload,
) => Promise<TLot>;

type EditNumberModalProps<TLot extends EditNumberModalLot> = {
  open: boolean;
  lot: TLot | null;
  onClose: () => void;
  onUpdated: (lot: TLot) => void;
  onSubmit?: (lot: TLot, payload: EditNumberModalSubmitPayload) => Promise<TLot>;
};

const isNumberItem = (lot: EditNumberModalLot): lot is NumberItem => {
  return (lot as NumberItem).plate !== undefined;
};

const toPlateValue = (lot: EditNumberModalLot | null): PlateSelectValue => {
  if (!lot) return { ...DEFAULT_PLATE_VALUE };

  if (isNumberItem(lot)) {
    const { plate, region } = lot;
    const text = [
      plate.firstLetter || "*",
      plate.firstDigit || "*",
      plate.secondDigit || "*",
      plate.thirdDigit || "*",
      plate.secondLetter || "*",
      plate.thirdLetter || "*",
    ].join("");

    return {
      text,
      regionCode: region || "",
      regionId: (() => {
        const numeric = Number(plate.regionId);
        return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
      })(),
    };
  }

  const text = [
    lot.firstLetter || "*",
    lot.firstDigit || "*",
    lot.secondDigit || "*",
    lot.thirdDigit || "*",
    lot.secondLetter || "*",
    lot.thirdLetter || "*",
  ].join("");

  return {
    text,
    regionCode: lot.regionCode || "",
    regionId: lot.regionId ?? null,
  };
};

const extractPlateParts = (value: PlateSelectValue) => {
  const text = (value.text || "******").toUpperCase();

  return {
    firstLetter: text[0] ?? "",
    firstDigit: text[1] ?? "",
    secondDigit: text[2] ?? "",
    thirdDigit: text[3] ?? "",
    secondLetter: text[4] ?? "",
    thirdLetter: text[5] ?? "",
  };
};

const normalizePrice = (value: string): number => {
  if (!value) return NaN;
  const normalized = value.replace(/[^0-9.,]/g, "").replace(/,/g, ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const getInitialPrice = (lot: EditNumberModalLot | null) => {
  if (!lot) return "";
  const value = isNumberItem(lot) ? lot.price : lot.markupPrice;
  if (!Number.isFinite(value) || value <= 0) return "";
  return String(value);
};

const getInitialComment = (lot: EditNumberModalLot | null) => {
  if (!lot) return "";
  if (isNumberItem(lot)) {
    return lot.plate.comment ?? lot.description ?? "";
  }
  return lot.comment ?? "";
};

export default function EditNumberModal<TLot extends EditNumberModalLot>({
  open,
  lot,
  onClose,
  onUpdated,
  onSubmit,
}: EditNumberModalProps<TLot>) {
  const [plate, setPlate] = useState<PlateSelectValue>(() => toPlateValue(lot));
  const [price, setPrice] = useState<string>(() => getInitialPrice(lot));
  const [comment, setComment] = useState<string>(() => getInitialComment(lot));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [plateSize, setPlateSize] = useState<"xs" | "lg">(() => {
    if (typeof window === "undefined") return "lg";
    return window.innerWidth < 640 ? "xs" : "lg";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setPlateSize(window.innerWidth < 640 ? "xs" : "lg");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!open) return;
    setPlate(toPlateValue(lot));
    setPrice(getInitialPrice(lot));
    setComment(getInitialComment(lot));
    setError(null);
  }, [open, lot]);

  const isSubmitDisabled = useMemo(() => {
    if (!open) return true;
    return (
      loading ||
      !price.trim() ||
      plate.text.includes("*") ||
      !plate.regionCode.trim() ||
      plate.regionId == null
    );
  }, [loading, open, plate.regionCode, plate.regionId, plate.text, price]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!lot) return;

    const priceValue = normalizePrice(price);
    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      setError("Укажите корректную стоимость");
      return;
    }

    if (plate.text.includes("*")) {
      setError("Укажите полный номер без символов *");
      return;
    }

    if (!plate.regionCode.trim() || plate.regionId == null) {
      setError("Выберите регион");
      return;
    }

    const parts = extractPlateParts(plate);
    setLoading(true);
    setError(null);

    try {
      const payload: EditNumberModalSubmitPayload = {
        price: priceValue,
        firstLetter: parts.firstLetter,
        firstDigit: parts.firstDigit,
        secondDigit: parts.secondDigit,
        thirdDigit: parts.thirdDigit,
        secondLetter: parts.secondLetter,
        thirdLetter: parts.thirdLetter,
        comment: comment.trim() ? comment.trim() : undefined,
        regionId: Number(plate.regionId ?? plate.regionCode),
      };
      const submit: EditNumberModalSubmitHandler<TLot> = onSubmit
        ? onSubmit
        : ((defaultSubmit as unknown) as EditNumberModalSubmitHandler<TLot>);
      const updated = await submit(lot, payload);
      onUpdated(updated);
      setToast({ type: "success", msg: "Изменения сохранены" });
      onClose();
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "Не удалось обновить объявление");
      setError(message);
      setToast({ type: "error", msg: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast ? <Toast type={toast.type} message={toast.msg} onClose={() => setToast(null)} /> : null}
      <Modal open={open && Boolean(lot)} onClose={handleClose}>
        <div className="relative max-h-[90vh] overflow-hidden rounded-[32px] bg-[#fff] text-black shadow-2xl">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-black transition hover:bg-white/20"
            aria-label="Закрыть окно редактирования"
          >
            <FiX className="h-5 w-5" />
          </button>

          <div className="max-h-[90vh] overflow-y-auto px-6 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12">
            <div className="mx-auto w-full max-w-[640px]">
              <h2 className="text-center font-actay-wide text-3xl uppercase md:text-4xl">Изменение объявления</h2>
              <p className="mt-3 text-center text-sm text-black/70 md:text-base">
                Обновите данные номера и сохраните изменения.
              </p>

              <div className="mt-6 md:mt-8">
                <PlateSelectForm
                  size={plateSize}
                  responsive
                  flagSrc="/flag-russia.svg"
                  showCaption={true}
                  className="mx-auto"
                  value={plate}
                  onChange={setPlate}
                />
              </div>

              <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                <input
                  type="text"
                  inputMode="numeric"
                  className={`${INPUT_BASE} w-full`}
                  placeholder="Стоимость *"
                  aria-label="Стоимость"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                />

                <textarea
                  className={`${INPUT_BASE} w-full min-h-[110px] resize-y`}
                  placeholder="Комментарий"
                  aria-label="Комментарий"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                />

                {error ? <p className="text-sm text-[#EB5757]">{error}</p> : null}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="w-full rounded-full bg-[#1E63FF] px-10 py-3 font-medium text-white transition-colors hover:bg-[#1557E0] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {loading ? "Сохраняем..." : "Сохранить изменения"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const withMessage = error as {
      message?: unknown;
      response?: { data?: { message?: unknown; error?: unknown } };
    };

    const responseMessage = withMessage.response?.data?.message;
    const responseError = withMessage.response?.data?.error;
    const message = withMessage.message;

    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }
    if (typeof responseError === "string" && responseError.trim()) {
      return responseError;
    }
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
};

const defaultSubmit: EditNumberModalSubmitHandler<NumberItem> = async (
  lot,
  payload,
) => {
  return numbersApi.updateAuthorized(lot.id, {
    price: payload.price,
    firstLetter: payload.firstLetter,
    firstDigit: payload.firstDigit,
    secondDigit: payload.secondDigit,
    thirdDigit: payload.thirdDigit,
    secondLetter: payload.secondLetter,
    thirdLetter: payload.thirdLetter,
    comment: payload.comment,
    regionId: payload.regionId,
  });
};
