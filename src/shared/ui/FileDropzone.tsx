import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

import Button from "./Button";

const DEFAULT_ACCEPT = ["image/jpeg", "image/png", "image/webp"] as const;

export type FileDropzoneProps = {
  file?: File | null;
  onFileChange: (file: File | null) => void;
  onValidationError?: (message: string) => void;
  error?: string;
  helperText?: string;
  accept?: readonly string[];
  maxSize?: number;
  previewUrl?: string;
  className?: string;
};

const readableSize = (bytes: number) =>
  `${(bytes / 1024 / 1024).toFixed(1)} МБ`.replace(".0", "");

export default function FileDropzone({
  file,
  onFileChange,
  onValidationError,
  error,
  helperText,
  accept = DEFAULT_ACCEPT,
  maxSize = 5 * 1024 * 1024,
  previewUrl,
  className,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const displayPreview = objectUrl ?? previewUrl ?? null;

  const acceptAttr = useMemo(() => accept.join(","), [accept]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) {
        return;
      }

      const candidate = files[0];

      if (accept.length > 0 && !accept.includes(candidate.type)) {
        onValidationError?.(
          `Поддерживаются только файлы: ${accept
            .map((type) => type.split("/")[1] ?? type)
            .join(", ")}`,
        );
        return;
      }

      if (candidate.size > maxSize) {
        onValidationError?.(
          `Размер файла не должен превышать ${readableSize(maxSize)}`,
        );
        return;
      }

      onFileChange(candidate);
    },
    [accept, maxSize, onFileChange, onValidationError],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleClear = () => {
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const hint = helperText ?? `JPG, PNG или WEBP до ${readableSize(maxSize)}`;

  return (
    <div className={twMerge("space-y-2", className)}>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <div
        className={twMerge(
          "group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50",
          dragActive ? "border-blue-500 bg-blue-50" : "",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        {displayPreview ? (
          <img
            src={displayPreview}
            alt="Предпросмотр изображения"
            className="h-48 w-full max-w-xs rounded-2xl object-cover shadow-sm"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <span className="text-lg font-semibold text-slate-700">
              Перетащите изображение сюда
            </span>
            <span className="text-sm">или нажмите, чтобы выбрать файл</span>
          </div>
        )}

        <span className="text-xs text-slate-400">{hint}</span>

        {file || previewUrl ? (
          <Button
            variant="ghost"
            size="sm"
            className="mt-4"
            onClick={(event) => {
              event.stopPropagation();
              handleClear();
            }}
          >
            Очистить
          </Button>
        ) : null}

        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
