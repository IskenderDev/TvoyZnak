import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Modal from "@/shared/ui/Modal";
import Input from "@/shared/ui/Input";
import Textarea from "@/shared/ui/Textarea";
import Button from "@/shared/ui/Button";
import Spinner from "@/shared/ui/Spinner";
import FileDropzone from "@/shared/ui/FileDropzone";
import type { Post } from "@/entities/post/types";
import { useCreatePost, useUpdatePost } from "@/entities/post/hooks";

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Минимум 3 символа")
    .max(120, "Максимум 120 символов"),
  description: z
    .string()
    .trim()
    .min(10, "Минимум 10 символов")
    .max(5000, "Максимум 5000 символов"),
  imageFile: z
    .custom<File | null>((value) => value == null || value instanceof File, {
      message: "Некорректный файл",
    })
    .optional()
    .nullable(),
  clearImage: z.boolean().optional(),
});

export type PostFormModalProps = {
  open: boolean;
  mode: "create" | "update";
  post?: Post | null;
  onClose: () => void;
};

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  title: "",
  description: "",
  imageFile: null,
  clearImage: false,
};

export default function PostFormModal({
  open,
  mode,
  post,
  onClose,
}: PostFormModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [formError, setFormError] = useState<string | null>(null);

  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const clearImage = watch("clearImage");

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      title: post?.title ?? "",
      description: post?.description ?? "",
      imageFile: null,
      clearImage: false,
    });
    setFormError(null);
  }, [open, post, reset]);

  const onSubmit = useCallback(async (values: FormValues) => {
    setFormError(null);

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      imageFile: values.imageFile ?? undefined,
    };

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(payload);
      } else if (post) {
        await updateMutation.mutateAsync({
          id: post.id,
          ...payload,
          clearImage: Boolean(values.clearImage) && !values.imageFile,
        });
      }

      toast.success("Сохранено");
      onClose();
    } catch (error) {
      const message = extractErrorMessage(error, "Не удалось сохранить новость");
      setFormError(message);
    }
  }, [createMutation, mode, onClose, post, updateMutation]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        void handleSubmit(onSubmit)();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, onSubmit, open]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const existingImageUrl = post?.imageUrl;
  const clearImageAvailable = mode === "update" && Boolean(existingImageUrl);

  const previewUrl = useMemo(() => {
    if (clearImage) {
      return undefined;
    }
    return existingImageUrl ?? undefined;
  }, [clearImage, existingImageUrl]);

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex flex-col gap-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              {mode === "create" ? "Создание новости" : "Редактирование новости"}
            </h2>
            <p className="text-sm text-slate-600">
              Заполните форму и нажмите «Сохранить». Ctrl/⌘ + Enter тоже сработает.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Заголовок"
                  placeholder="Введите заголовок"
                  maxLength={120}
                  error={errors.title?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Описание"
                  placeholder="Расскажите подробнее о новости"
                  maxLength={5000}
                  error={errors.description?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="imageFile"
              render={({ field }) => (
                <FileDropzone
                  file={field.value ?? undefined}
                  onFileChange={(file) => {
                    field.onChange(file);
                    setValue("clearImage", false);
                    clearErrors("imageFile");
                  }}
                  onValidationError={(message) => {
                    setError("imageFile", { type: "validate", message });
                  }}
                  error={errors.imageFile?.message ?? undefined}
                  previewUrl={field.value ? undefined : previewUrl}
                />
              )}
            />

            {clearImageAvailable ? (
              <Controller
                control={control}
                name="clearImage"
                render={({ field }) => (
                  <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={field.value ?? false}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        field.onChange(checked);
                        if (checked) {
                          setValue("imageFile", null);
                          clearErrors("imageFile");
                        }
                      }}
                    />
                    Отправить пустое значение для image
                  </label>
                )}
              />
            ) : null}

            {formError ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:w-auto"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    <span>Сохраняем...</span>
                  </span>
                ) : (
                  "Сохранить"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const maybe = error as { message?: unknown };
    if (typeof maybe.message === "string" && maybe.message.trim()) {
      return maybe.message;
    }
  }

  return fallback;
};
