import { FiCheckCircle, FiXCircle, FiX } from "react-icons/fi";

export default function Toast({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-x-0 top-4 z-[1000] flex justify-center px-4">
      <div
        role="alert"
        className={`max-w-[640px] w-full rounded-md px-4 py-3 text-white shadow-lg
          ${type === "success" ? "bg-emerald-600/95" : "bg-red-600/95"}`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-[2px]">
            {type === "success" ? <FiCheckCircle size={20} /> : <FiXCircle size={20} />}
          </div>
          <div className="flex-1 text-sm md:text-base">{message}</div>
          <button
            aria-label="Закрыть уведомление"
            onClick={onClose}
            className="shrink-0 p-1 rounded hover:bg-white/10"
            type="button"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
