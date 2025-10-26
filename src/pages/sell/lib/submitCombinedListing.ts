import { isAxiosError } from "axios";

import type { SellFormValues } from "@/pages/sell/components/SellForm";
import type { CreateNumberPayload, NumberItem } from "@/shared/services/numbersApi";
import type { ExtendedAuthUser } from "@/shared/contexts/AuthProvider";
import type { RegisterPayload } from "@/shared/services/authApi";

type AuthMethods = {
  user: ExtendedAuthUser | null;
  register: (payload: RegisterPayload) => Promise<ExtendedAuthUser>;
  login: (email: string, password: string) => Promise<ExtendedAuthUser>;
  ensureSession: () => Promise<ExtendedAuthUser | null>;
};

type NumbersMethods = {
  create: (payload: CreateNumberPayload) => Promise<NumberItem>;
};

export type CombinedSellFormValues = SellFormValues & {
  fullName: string;
  phone: string;
  email: string;
  password: string;
};

export interface CombinedSubmitDeps {
  auth: AuthMethods;
  numbers: NumbersMethods;
}

export const submitCombinedListing = async (
  values: CombinedSellFormValues,
  deps: CombinedSubmitDeps,
): Promise<NumberItem> => {
  const { auth, numbers } = deps;

  if (!auth.user) {
    try {
      await auth.register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        await auth.login(values.email, values.password);
      } else {
        throw error;
      }
    }

    try {
      await auth.ensureSession();
    } catch (error) {
      if (!isAxiosError(error) || error.response?.status !== 401) {
        throw error;
      }
    }
  }

  return numbers.create({
    plate: values.plate,
    region: values.region,
    price: values.price,
    comment: values.comment,
    phone: values.phone,
  });
};
