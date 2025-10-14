import { useState, useCallback } from "react";

export type LeadFormPayload = {
  name: string;
  phone: string;
  type: "buy" | "sell" | "evaluate" | "";
  number: string;
  consent: boolean;
};

type UseLeadSubmitOptions = {
  url?: string; // можно прокинуть свой endpoint
  headers?: Record<string, string>;
};

export function useLeadSubmit(options: UseLeadSubmitOptions = {}) {
  const { url = "/api/lead", headers = { "Content-Type": "application/json" } } =
    options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(
    async (data: LeadFormPayload) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        // Пока просто логируем. Когда будет бэкенд — раскомментируйте fetch.
        console.log("Lead submit:", data);

        // const res = await fetch(url, {
        //   method: "POST",
        //   headers,
        //   body: JSON.stringify(data),
        // });
        // if (!res.ok) {
        //   const text = await res.text().catch(() => "");
        //   throw new Error(text || `Request failed: ${res.status}`);
        // }

        setSuccess(true);
        return true;
      } catch (e: any) {
        setError(e?.message || "Ошибка отправки");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [url, headers]
  );

  return { submit, loading, error, success };
}
