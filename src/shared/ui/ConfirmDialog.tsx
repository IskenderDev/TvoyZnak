import { useEffect } from "react";

import Button from "./Button";
import Modal from "./Modal";
import Spinner from "./Spinner";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        if (!loading) {
          onConfirm();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [loading, onConfirm, open]);

  const handleCancel = () => {
    if (loading) return;
    onCancel();
  };

  return (
    <Modal open={open} onClose={handleCancel}>
      <div className="max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          {description ? (
            <p className="text-sm text-slate-600">{description}</p>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" />
                <span>Удаляем...</span>
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
