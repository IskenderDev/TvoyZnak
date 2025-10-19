import { useEffect, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

type Option<T extends string> = { label: string; value: T };
type UiSelectProps<T extends string> = {
  name: string;
  value: T | "";
  onChange: (value: T) => void;
  placeholder?: string;
  options: Option<T>[];
  className?: string;
  valueClassName?: string;
  placeholderClassName?: string;
};

export default function UiSelect<T extends string>({
  name,
  value,
  onChange,
  placeholder = "Выберите действие",
  options,
  className = "w-full rounded-lg bg-surface px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary-500",
  valueClassName = "text-foreground",
  placeholderClassName = "text-muted/80",
}: UiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const current = options.find((o) => o.value === value);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      setActiveIdx(Math.max(0, options.findIndex((o) => o.value === value)));
      return;
    }
    if (!open) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setActiveIdx(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = options[activeIdx];
      if (opt) {
        onChange(opt.value);
        setOpen(false);
      }
    }
  };

  return (
    <div className="relative" onKeyDown={handleKeyDown}>
      <input type="hidden" name={name} value={value} readOnly />

      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className={`${className} relative pr-10 text-left ${value ? valueClassName : placeholderClassName}`}
      >
        {current?.label ?? placeholder}
        <LuChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${open ? "rotate-180" : ""}`}
          size={18}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-20 mt-2 w-full rounded-2xl bg-primary-500 p-3 text-primary-foreground shadow-lg"
        >
          {options.map((opt, idx) => {
            const selected = value === opt.value;
            const active = idx === activeIdx;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={selected}
                tabIndex={-1}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="cursor-pointer rounded-lg px-2 py-2 transition-colors hover:bg-primary-600/60"
              >
                <span
                  className={[
                    "inline-flex items-center rounded-full px-2 py-1",
                    selected || active ? "ring-2 ring-primary-foreground/70" : "",
                  ].join(" ")}
                >
                  {opt.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
