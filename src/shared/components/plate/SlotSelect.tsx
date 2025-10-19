import React, { useCallback, useEffect, useRef, useState, useId } from "react";

type Props = {
  ariaLabel: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  fontSize: number;
  slotW: number;
  slotH: number;
  color?: string;
  centerText?: boolean;
  dropdownMaxHeight?: number;
};

export default function SlotSelect({
  ariaLabel,
  value,
  onChange,
  options,
  fontSize,
  slotW,
  slotH,
  color = "#000",
  centerText = false,
  dropdownMaxHeight = 240,
}: Props) {
  const [open, setOpen] = useState(false);
  const [appear, setAppear] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const i = options.findIndex((o) => o === value);
    return i >= 0 ? i : 0;
  });

  // тайпахед
  const typeBufferRef = useRef("");
  const typeTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const listboxId = useId();

  const scrollActiveIntoView = useCallback(() => {
    const el = optionRefs.current[activeIndex];
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (open) {
      setAppear(false);
      const id = requestAnimationFrame(() => setAppear(true));
      const selIndex = options.findIndex((o) => o === value);
      setActiveIndex(selIndex >= 0 ? selIndex : 0);
      setTimeout(() => {
        listboxRef.current?.focus();
        scrollActiveIntoView();
      }, 0);
      return () => cancelAnimationFrame(id);
    }

    setAppear(false);
    triggerRef.current?.focus({ preventScroll: true });
    return;
  }, [open, options, scrollActiveIntoView, value]);

  useEffect(() => {
    if (!open) return;
    scrollActiveIntoView();
  }, [activeIndex, open, scrollActiveIntoView]);

  const isPrintableKey = (e: React.KeyboardEvent) =>
    e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

  const applyTypeahead = (key: string) => {
    if (typeTimerRef.current) {
      window.clearTimeout(typeTimerRef.current);
    }
    typeBufferRef.current += key;
    const q = typeBufferRef.current.toLowerCase();
    let idx = options.findIndex((o) => o.toLowerCase().startsWith(q));
    if (idx < 0) {
      idx = options.findIndex((o) => o.toLowerCase() === q);
    }
    if (idx >= 0) setActiveIndex(idx);

    typeTimerRef.current = window.setTimeout(() => {
      typeBufferRef.current = "";
    }, 600);
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      if (e.key === "ArrowDown") {
        setActiveIndex((i) => (i + 1) % options.length);
      } else {
        setActiveIndex((i) => (i - 1 + options.length) % options.length);
      }
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
      return;
    }
    if (isPrintableKey(e)) {
      setOpen(true);
      applyTypeahead(e.key);
    }
  };

  const onListboxKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % options.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + options.length) % options.length);
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(options.length - 1);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const opt = options[activeIndex];
      if (opt != null) {
        onChange(opt);
        setOpen(false);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (isPrintableKey(e)) {
      applyTypeahead(e.key);
      return;
    }
  };

  return (
    <div ref={wrapperRef} className="relative" style={{ width: slotW, height: slotH }}>
      {/* Триггер */}
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        className={`w-full h-full grid ${centerText ? "place-items-center" : "place-items-end"} select-none transition-colors duration-150 `}
        style={{
          lineHeight: 0.9,
          fontWeight: 700,
          fontSize,
          color,
        }}
      >
        {value}
      </button>

      {open && (
        <div
          className={`absolute font-actay z-50 left-[50%] -mt-[10%] -translate-x-1/2 transition-all duration-150 ${
            appear ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          }`}
          style={{ top: `calc(100% + 4px)` }}
        >
          <div
            className="rounded-xl bg-[#0019FF] overflow-y-auto no-scrollbar shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
            style={{
              width: Math.max(40),
              maxHeight: dropdownMaxHeight, // скролл внутри, без полосы
            }}
          >
            <div
              id={listboxId}
              role="listbox"
              aria-label={ariaLabel}
              aria-activedescendant={`${listboxId}-opt-${activeIndex}`}
              ref={listboxRef}
              tabIndex={-1}
              onKeyDown={onListboxKeyDown}
            >
              <ul className="flex flex-col items-center">
                {options.map((opt, idx) => {
                  const selected = opt === value;
                  const highlighted = idx === activeIndex;
                  return (
                    <li key={opt} className="w-full">
                      <button
                        id={`${listboxId}-opt-${idx}`}
                        ref={(el) => {
                          optionRefs.current[idx] = el
                        }}
                        role="option"
                        aria-selected={selected}
                        type="button"
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => {
                          onChange(opt);
                          setOpen(false);
                        }}
                        className={`w-full grid place-items-center text-white font-bold transition-transform duration-150
                          ${highlighted && !selected ? " bg-[#0177FF]" : ""}
                        `}
                        style={{
                          paddingTop: 12,
                          paddingBottom: 12,
                          lineHeight: 1,
                          fontSize: Math.max(14),
                        }}
                      >
                        {opt}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
