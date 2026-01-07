import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";

import Button from "@/shared/ui/Button";

const getErrorDetails = (error: unknown): { title: string; description: string } => {
  if (isRouteErrorResponse(error)) {
    const status = error.status;
    const statusText = error.statusText || "Неизвестная ошибка";
    const message =
      typeof error.data === "string"
        ? error.data
        : (error.data as { message?: string })?.message;

    return {
      title: `Ошибка ${status}`,
      description: message || statusText,
    };
  }

  if (error instanceof Error) {
    return {
      title: "Что-то пошло не так",
      description: error.message,
    };
  }

  return {
    title: "Неожиданная ошибка",
    description: "Попробуйте обновить страницу или вернуться назад.",
  };
};

export default function RouteErrorElement() {
  const navigate = useNavigate();
  const error = useRouteError();
  const { title, description } = getErrorDetails(error);

  return (
    <div className="flex min-h-screen-safe flex-col items-center justify-center gap-6 bg-slate-50 p-6 text-center text-slate-900">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="max-w-md text-sm text-slate-600">{description}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => navigate(-1)}>Назад</Button>
        <Button variant="secondary" onClick={() => navigate("/")}>На главную</Button>
        <Button
          variant="ghost"
          onClick={() => {
            navigate(0);
          }}
        >
          Обновить
        </Button>
      </div>
    </div>
  );
}
