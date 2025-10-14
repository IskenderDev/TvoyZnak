import type { PropsWithChildren } from 'react'

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
};

export default function Modal({ open, onClose, title, children }: PropsWithChildren<Props>) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-neutral-800 p-6 shadow-xl">
        {title ? <h2 className="text-xl font-semibold mb-4">{title}</h2> : null}
        {children}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
