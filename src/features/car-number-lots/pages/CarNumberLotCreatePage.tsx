import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { CarNumberLotForm } from "@/features/car-number-lots/components/CarNumberLotForm";
import { useCarNumberLots } from "@/features/car-number-lots/hooks/useCarNumberLots";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { paths } from "@/shared/routes/paths";
import type {
  CarNumberLotPayload,
  CreateCarNumberLotWithRegistrationPayload,
} from "@/shared/types";

export function CarNumberLotCreatePage() {
  const { isAuthenticated, autoRegisterWithLot } = useAuth();
  const { createLot } = useCarNumberLots();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (
      values: CarNumberLotPayload | CreateCarNumberLotWithRegistrationPayload,
    ) => {
      try {
        setLoading(true);
        if (isAuthenticated) {
          await createLot(values as CarNumberLotPayload);
          toast.success("Объявление создано и отправлено на модерацию");
        } else {
          const result = await autoRegisterWithLot(
            values as CreateCarNumberLotWithRegistrationPayload,
          );
          if (result) {
            toast.success("Аккаунт создан, объявление отправлено на модерацию");
          }
        }
        navigate(paths.carNumberLots.mine);
      } catch (error) {
        console.error(error);
        toast.error("Не удалось сохранить объявление");
      } finally {
        setLoading(false);
      }
    },
    [autoRegisterWithLot, createLot, isAuthenticated, navigate],
  );

  return (
    <section className="flex flex-col gap-4">
      <header>
        <h1 className="text-3xl font-semibold text-white">Разместить объявление</h1>
        <p className="text-sm text-zinc-400">
          Заполните форму, чтобы выставить номер на продажу. Неавторизованные пользователи будут зарегистрированы автоматически.
        </p>
      </header>
      <CarNumberLotForm
        isAuthenticated={isAuthenticated}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </section>
  );
}

export default CarNumberLotCreatePage;
