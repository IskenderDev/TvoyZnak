import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useId,
} from "react";

type SlotSelectOption = {
  value: string;
  label: string;
  keywords?: string[];
};

type Props = {
  ariaLabel: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<string | SlotSelectOption>;
  fontSize: number;
  slotW: number;
  slotH: number;
  color?: string;
  centerText?: boolean;
  dropdownMaxHeight?: number;
  displayValue?: string;
  onCommit?: (value: string) => void;
  onInvalidKey?: (query: string) => void;
  disabled?: boolean;
  searchPlaceholder?: string;
};

const normalizeOptions = (options: Array<string | SlotSelectOption>): SlotSelectOption[] =>
  options.map((opt) => {
    if (typeof opt === "string") {
      return {
        value: opt,
        label: opt,
        keywords: [opt],
      } satisfies SlotSelectOption;
    }

    const baseKeywords = [opt.value, opt.label, ...(opt.keywords ?? [])]
      .map((keyword) => keyword?.toString().trim())
      .filter((keyword): keyword is string => Boolean(keyword));

    const uniqueKeywords = Array.from(new Set(baseKeywords));

    return {
      value: opt.value,
      label: opt.label,
      keywords: uniqueKeywords.length ? uniqueKeywords : [opt.value, opt.label],
    } satisfies SlotSelectOption;
  });

const isPrintableKey = (event: React.KeyboardEvent) =>
  event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

const SlotSelect = React.forwardRef<HTMLButtonElement, Props>(function SlotSelect(
  {
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
    displayValue,
    onCommit,
    onInvalidKey,
    disabled = false,
    searchPlaceholder = "Поиск",
  },
  forwardedRef,
) {
  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);
  const [open, setOpen] = useState(false);
  const [appear, setAppear] = useState(false);
  const [filter, setFilter] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const listboxId = useId();

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const typeBufferRef = useRef("");
  const typeTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const normalizedFilter = filter.trim().toLowerCase();

  const filteredOptions = useMemo(() => {
    if (!normalizedFilter) {
      return normalizedOptions;
    }

    return normalizedOptions.filter((opt) => {
      if (!opt.keywords?.length) {
        return opt.value.toLowerCase().includes(normalizedFilter);
      }

      return opt.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedFilter));
    });
  }, [normalizedFilter, normalizedOptions]);

  useEffect(() => {
    optionRefs.current = new Array(filteredOptions.length).fill(null);
  }, [filteredOptions.length]);

  const assignTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );

  const scrollActiveIntoView = useCallback(() => {
    if (activeIndex < 0) return;
    const el = optionRefs.current[activeIndex];
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (open) {
      setAppear(false);
      const frame = requestAnimationFrame(() => setAppear(true));
      const selectedIndex = filteredOptions.findIndex((opt) => opt.value === value);
      const nextIndex = selectedIndex >= 0 ? selectedIndex : filteredOptions.length ? 0 : -1;
      setActiveIndex(nextIndex);

      window.setTimeout(() => {
        if (filter) {
          searchRef.current?.focus();
          searchRef.current?.setSelectionRange(filter.length, filter.length);
        } else {
          searchRef.current?.focus();
        }
        scrollActiveIntoView();
      }, 0);

      return () => cancelAnimationFrame(frame);
    }

    setAppear(false);
    setFilter("");
    setActiveIndex(0);
    typeBufferRef.current = "";
    if (triggerRef.current) {
      triggerRef.current.focus({ preventScroll: true });
    }
  }, [filter, filteredOptions, open, scrollActiveIntoView, value]);

  useEffect(() => {
    if (!open) return;
    scrollActiveIntoView();
  }, [activeIndex, open, scrollActiveIntoView]);

  const resetTypeTimer = useCallback(() => {
    if (typeTimerRef.current) {
      window.clearTimeout(typeTimerRef.current);
    }
    typeTimerRef.current = window.setTimeout(() => {
      typeBufferRef.current = "";
    }, 700);
  }, []);

  const selectOption = useCallback(
    (option: SlotSelectOption) => {
      onChange(option.value);
      onCommit?.(option.value);
      typeBufferRef.current = "";
      setOpen(false);
      setFilter("");
    },
    [onChange, onCommit],
  );

  const applyTypeahead = useCallback(
    (key: string) => {
      if (!normalizedOptions.length) return;

      if (typeTimerRef.current) {
        window.clearTimeout(typeTimerRef.current);
      }

      typeBufferRef.current = `${typeBufferRef.current}${key}`.slice(-6);
      const buffer = typeBufferRef.current;
      const bufferLower = buffer.toLowerCase();

      const exactMatch = normalizedOptions.find(
        (opt) =>
          opt.value.toLowerCase() === bufferLower || opt.label.toLowerCase() === bufferLower,
      );

      if (exactMatch) {
        selectOption(exactMatch);
        return;
      }

      const partialMatch = normalizedOptions.filter(
        (opt) =>
          opt.value.toLowerCase().startsWith(bufferLower) ||
          opt.label.toLowerCase().startsWith(bufferLower),
      );

      if (partialMatch.length) {
        setOpen(true);
        setFilter(buffer.toUpperCase());
        setActiveIndex(0);
      } else {
        onInvalidKey?.(buffer.toUpperCase());
        setOpen(true);
        setFilter(buffer.toUpperCase());
        setActiveIndex(-1);
      }

      resetTypeTimer();
    },
    [normalizedOptions, onInvalidKey, resetTypeTimer, selectOption],
  );

  const onTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }

        if (!filteredOptions.length) return;
        setActiveIndex((index) => {
          if (index < 0) return 0;
          if (event.key === "ArrowDown") {
            return (index + 1) % filteredOptions.length;
          }
          return (index - 1 + filteredOptions.length) % filteredOptions.length;
        });
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      if (isPrintableKey(event)) {
        event.preventDefault();
        const char = event.key.toUpperCase();
        applyTypeahead(char);
      }
    },
    [applyTypeahead, disabled, filteredOptions.length, open],
  );

  const onListboxKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!filteredOptions.length) return;
        setActiveIndex((index) => {
          const next = index + 1;
          return next >= filteredOptions.length ? 0 : next;
        });
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!filteredOptions.length) return;
        setActiveIndex((index) => {
          const next = index - 1;
          return next < 0 ? filteredOptions.length - 1 : next;
        });
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        if (filteredOptions.length) {
          setActiveIndex(0);
        }
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        if (filteredOptions.length) {
          setActiveIndex(filteredOptions.length - 1);
        }
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const option = filteredOptions[activeIndex];
        if (option) {
          selectOption(option);
        }
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (isPrintableKey(event)) {
        const char = event.key.toUpperCase();
        applyTypeahead(char);
      }
    },
    [activeIndex, applyTypeahead, filteredOptions, selectOption],
  );

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const next = event.target.value.toUpperCase();
    setFilter(next);
    setActiveIndex(0);
  };

  const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (filteredOptions.length) {
        setActiveIndex(0);
        listboxRef.current?.focus();
      }
      return;
    }

    if (event.key === "Enter" && filteredOptions.length === 1) {
      event.preventDefault();
      const option = filteredOptions[0];
      if (option) {
        selectOption(option);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  const displayText = displayValue ?? value ?? "";
  const hasValue = Boolean(displayText);

  return (
    <div ref={wrapperRef} className="relative" style={{ width: slotW, height: slotH }}>
      <button
        ref={assignTriggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
        }}
        onKeyDown={onTriggerKeyDown}
        className={`w-full h-full grid ${centerText ? "place-items-center" : "place-items-end"} select-none transition-colors duration-150 ${
          disabled ? "cursor-not-allowed opacity-60" : "hover:bg-black/5"
        }`}
        style={{
          lineHeight: 0.9,
          fontWeight: 700,
          fontSize,
          color: hasValue ? color : "#9AA0A6",
        }}
        disabled={disabled}
      >
        {displayText || "—"}
      </button>

      {open && (
        <div
          className={`absolute font-actay z-50 left-1/2 -mt-[10%] -translate-x-1/2 transition-all duration-150 ${
            appear ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          }`}
          style={{ top: `calc(100% + 4px)` }}
        >
          <div
            className="rounded-xl bg-[#0019FF] shadow-[0_8px_24px_rgba(0,0,0,0.25)] overflow-hidden"
            style={{
              width: Math.max(48, slotW * 1.1),
              maxHeight: dropdownMaxHeight,
            }}
          >
            <div className="p-2 border-b border-white/20">
              <input
                ref={searchRef}
                type="text"
                value={filter}
                onChange={onSearchChange}
                onKeyDown={onSearchKeyDown}
                placeholder={searchPlaceholder}
                className="w-full rounded-md bg-white/20 px-3 py-2 text-sm font-semibold text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#33D9FF]"
              />
            </div>

            <div
              id={listboxId}
              role="listbox"
              aria-label={ariaLabel}
              aria-activedescendant={activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined}
              ref={listboxRef}
              tabIndex={0}
              onKeyDown={onListboxKeyDown}
              className="outline-none"
            >
              <ul className="max-h-[200px] overflow-y-auto no-scrollbar">
                {filteredOptions.length === 0 ? (
                  <li className="px-4 py-3 text-center text-white/80 text-sm">
                    {normalizedOptions.length === 0 ? "Нет доступных значений" : "Ничего не найдено"}
                  </li>
                ) : (
                  filteredOptions.map((option, index) => {
                    const selected = option.value === value;
                    const highlighted = index === activeIndex;
                    const highlightLength = filter.length;
                    const lowerLabel = option.label.toLowerCase();
                    const highlightIndex =
                      normalizedFilter && highlightLength
                        ? lowerLabel.indexOf(normalizedFilter)
                        : -1;

                    const before =
                      highlightIndex >= 0
                        ? option.label.slice(0, highlightIndex)
                        : option.label;
                    const highlightPart =
                      highlightIndex >= 0
                        ? option.label.slice(highlightIndex, highlightIndex + highlightLength)
                        : "";
                    const after =
                      highlightIndex >= 0
                        ? option.label.slice(highlightIndex + highlightLength)
                        : "";

                    return (
                      <li key={`${option.value}-${option.label}`} className="w-full">
                        <button
                          id={`${listboxId}-opt-${index}`}
                          ref={(node) => {
                            optionRefs.current[index] = node;
                          }}
                          role="option"
                          aria-selected={selected}
                          type="button"
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => selectOption(option)}
                          className={`w-full px-4 py-3 text-left text-white font-semibold transition-colors duration-150 ${
                            highlighted ? "bg-[#0177FF]" : ""
                          } ${selected ? "bg-white/20" : ""}`}
                        >
                          {highlightIndex >= 0 ? (
                            <span>
                              {before}
                              <span className="text-[#33D9FF]">{highlightPart}</span>
                              {after}
                            </span>
                          ) : (
                            option.label
                          )}
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default SlotSelect;
