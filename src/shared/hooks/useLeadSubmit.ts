import { useState, useCallback } from "react";
import { feedbacksApi } from "@/shared/services/feedbacksApi";

export type LeadFormPayload = {
  name: string;
  phone: string;
  type: string;
  number: string;
  consent: boolean;
  message?: string;
};

export function useLeadSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(
    async (data: LeadFormPayload) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        await feedbacksApi.create({
          name: data.name,
          phone: data.phone,
          type: data.type,
          number: data.number,
          message: data.message,
        });
        setSuccess(true);
        return true;
      } catch (error: unknown) {
        const msg = extractErrorMessage(error, "Ошибка отправки");
        setError(msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { submit, loading, error, success };
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const withMessage = error as { message?: unknown; response?: { data?: { message?: unknown; error?: unknown } } };
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
