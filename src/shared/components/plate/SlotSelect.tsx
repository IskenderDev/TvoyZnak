import React, { useCallback, useEffect, useMemo, useRef, useState, useId } from "react"

type SlotSelectOption = {
  value: string
  label: string
  keywords?: string[]
}

type Props = {
  ariaLabel: string
  value: string
  onChange: (v: string) => void
  options: Array<string | SlotSelectOption>

  fontSize: number
  slotW: number
  slotH: number

  color?: string
  centerText?: boolean
  dropdownMaxHeight?: number
  displayValue?: string
  onCommit?: (value: string) => void
  onInvalidKey?: (query: string) => void
  disabled?: boolean
  searchPlaceholder?: string
  searchable?: boolean

  dropdownWidth?: number
  dropdownOffsetX?: number
}

const normalizeOptions = (options: Array<string | SlotSelectOption>): SlotSelectOption[] => {
  const hasAny = options.some((opt) => (typeof opt === "string" ? opt === "*" : opt.value === "*"))

  const withAny = hasAny
    ? options
    : ([{ value: "*", label: "*", keywords: ["*", "любой", "очистить"] }, ...options] as const)

  return withAny.map((opt) => {
    if (typeof opt === "string") return { value: opt, label: opt, keywords: [opt] }

    const baseKeywords = [opt.value, opt.label, ...(opt.keywords ?? [])]
      .map((k) => k?.toString().trim())
      .filter((k): k is string => Boolean(k))

    const uniqueKeywords = Array.from(new Set(baseKeywords))

    return {
      value: opt.value,
      label: opt.label,
      keywords: uniqueKeywords.length ? uniqueKeywords : [opt.value, opt.label],
    }
  })
}

const isPrintableKey = (event: React.KeyboardEvent) =>
  event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey

const matchesOption = (opt: SlotSelectOption, target: string) => {
  const normalized = target.toUpperCase()
  return (
    opt.value.toUpperCase() === normalized ||
    opt.label.toUpperCase() === normalized ||
    opt.keywords?.some((k) => k.toUpperCase() === normalized)
  )
}

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
    searchable = true,
    dropdownWidth,
    dropdownOffsetX = 0,
  },
  forwardedRef,
) {
  const normalizedOptions = useMemo(() => normalizeOptions(options), [options])

  const [open, setOpen] = useState(false)
  const [appear, setAppear] = useState(false)
  const [filter, setFilter] = useState("")
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const listboxId = useId()

  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const listboxRef = useRef<HTMLDivElement | null>(null)
  const searchRef = useRef<HTMLInputElement | null>(null)

  const typeBufferRef = useRef("")
  const typeTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)

  const normalizedFilter = searchable ? filter.trim().toLowerCase() : ""

  const filteredOptions = useMemo(() => {
    if (!searchable || !normalizedFilter) return normalizedOptions
    return normalizedOptions.filter((opt) => {
      if (!opt.keywords?.length) return opt.value.toLowerCase().includes(normalizedFilter)
      return opt.keywords.some((k) => k.toLowerCase().includes(normalizedFilter))
    })
  }, [normalizedFilter, normalizedOptions, searchable])

  const assignTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node
      if (typeof forwardedRef === "function") forwardedRef(node)
      else if (forwardedRef)
        (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
    },
    [forwardedRef],
  )

  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      if (!event.target) return
      const wrapper = triggerRef.current?.parentElement
      if (!wrapper) return
      if (!wrapper.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  useEffect(() => {
    if (open) {
      setAppear(false)
      const frame = requestAnimationFrame(() => setAppear(true))
      const selectedIndex = filteredOptions.findIndex((opt) => opt.value === value)
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : filteredOptions.length ? 0 : -1)

      window.setTimeout(() => {
        if (searchable) {
          searchRef.current?.focus()
          if (filter) searchRef.current?.setSelectionRange(filter.length, filter.length)
        } else {
          listboxRef.current?.focus()
        }
      }, 0)

      return () => cancelAnimationFrame(frame)
    }

    setAppear(false)
    setFilter("")
    setActiveIndex(0)
    typeBufferRef.current = ""
    triggerRef.current?.focus({ preventScroll: true })
  }, [open, filteredOptions, searchable, value, filter])

  const resetTypeTimer = useCallback(() => {
    if (!searchable) return
    if (typeTimerRef.current) window.clearTimeout(typeTimerRef.current)
    typeTimerRef.current = window.setTimeout(() => {
      typeBufferRef.current = ""
    }, 700)
  }, [searchable])

  const selectOption = useCallback(
    (option: SlotSelectOption) => {
      onChange(option.value)
      onCommit?.(option.value)
      typeBufferRef.current = ""
      setOpen(false)
      setFilter("")
    },
    [onChange, onCommit],
  )

  const resetToAny = useCallback(() => {
    if (value !== "*") {
      onChange("*")
      onCommit?.("*")
    }
    typeBufferRef.current = ""
    setFilter("")
  }, [onChange, onCommit, value])

  const applyTypeahead = useCallback(
    (key: string) => {
      if (!searchable) return
      if (!normalizedOptions.length) return

      if (typeTimerRef.current) window.clearTimeout(typeTimerRef.current)

      typeBufferRef.current = `${typeBufferRef.current}${key}`.slice(-6)
      const buffer = typeBufferRef.current
      const bufferLower = buffer.toLowerCase()

      const exactMatch = normalizedOptions.find((opt) => {
        const kws = opt.keywords?.map((k) => k.toLowerCase()) ?? []
        return (
          opt.value.toLowerCase() === bufferLower ||
          opt.label.toLowerCase() === bufferLower ||
          kws.includes(bufferLower)
        )
      })
      if (exactMatch) {
        selectOption(exactMatch)
        return
      }

      const partialMatch = normalizedOptions.filter(
        (opt) =>
          opt.value.toLowerCase().startsWith(bufferLower) ||
          opt.label.toLowerCase().startsWith(bufferLower),
      )

      setOpen(true)
      setFilter(buffer.toUpperCase())
      setActiveIndex(partialMatch.length ? 0 : -1)
      if (!partialMatch.length) onInvalidKey?.(buffer.toUpperCase())

      resetTypeTimer()
    },
    [normalizedOptions, onInvalidKey, resetTypeTimer, searchable, selectOption],
  )

  const handlePrintableKey = useCallback(
    (key: string) => {
      const char = key.toUpperCase()
      if (searchable) {
        applyTypeahead(char)
        return
      }
      const directMatch = normalizedOptions.find((opt) => matchesOption(opt, char))
      if (directMatch) selectOption(directMatch)
      else onInvalidKey?.(char)
    },
    [applyTypeahead, normalizedOptions, onInvalidKey, searchable, selectOption],
  )

  const onTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault()
        if (!open) {
          setOpen(true)
          return
        }
        if (!filteredOptions.length) return

        setActiveIndex((index) => {
          if (index < 0) return 0
          if (event.key === "ArrowDown") return (index + 1) % filteredOptions.length
          return (index - 1 + filteredOptions.length) % filteredOptions.length
        })
        return
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        setOpen((prev) => !prev)
        return
      }

      if (event.key === "Backspace") {
        event.preventDefault()
        resetToAny()
        return
      }

      if (isPrintableKey(event)) {
        event.preventDefault()
        handlePrintableKey(event.key)
      }
    },
    [disabled, filteredOptions.length, handlePrintableKey, open, resetToAny],
  )

  const onListboxKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault()
        if (!filteredOptions.length) return
        setActiveIndex((i) => (i + 1 >= filteredOptions.length ? 0 : i + 1))
        return
      }

      if (event.key === "ArrowUp") {
        event.preventDefault()
        if (!filteredOptions.length) return
        setActiveIndex((i) => (i - 1 < 0 ? filteredOptions.length - 1 : i - 1))
        return
      }

      if (event.key === "Home") {
        event.preventDefault()
        if (filteredOptions.length) setActiveIndex(0)
        return
      }

      if (event.key === "End") {
        event.preventDefault()
        if (filteredOptions.length) setActiveIndex(filteredOptions.length - 1)
        return
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        const option = filteredOptions[activeIndex]
        if (option) selectOption(option)
        return
      }

      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
        return
      }

      if (event.key === "Backspace") {
        event.preventDefault()
        resetToAny()
        return
      }

      if (isPrintableKey(event)) handlePrintableKey(event.key)
    },
    [activeIndex, filteredOptions, handlePrintableKey, resetToAny, selectOption],
  )

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setFilter(event.target.value.toUpperCase())
    setActiveIndex(0)
  }

  const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (filteredOptions.length) {
        setActiveIndex(0)
        listboxRef.current?.focus()
      }
      return
    }
    if (event.key === "Enter" && filteredOptions.length === 1) {
      event.preventDefault()
      const option = filteredOptions[0]
      if (option) selectOption(option)
      return
    }
    if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
    }
    if (event.key === "Backspace") {
      resetToAny()
    }
  }

  const displayText = displayValue ?? value ?? ""
  const hasValue = Boolean(displayText)
  const shownText = displayText || "*"

  const highlightLength = searchable ? filter.length : 0
  const shouldHighlight = searchable && normalizedFilter && highlightLength > 0
  const listContainerClasses = "grid grid-cols-3 gap-2 p-3 justify-items-center"

  const menuW = dropdownWidth
  const searchBoxHeight = searchable ? 56 : 0
  const listMaxHeight = Math.max(dropdownMaxHeight - searchBoxHeight, 160)
  const optionSize = 48

  return (
    <div className="relative" style={{ width: slotW, height: slotH }}>
      <button
        ref={assignTriggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => {
          if (disabled) return
          setOpen((p) => !p)
        }}
        onKeyDown={onTriggerKeyDown}
        className={`w-full h-full grid ${centerText ? "place-items-center" : "place-items-end"} select-none transition-colors duration-150 font-auto-number ${disabled ? "cursor-not-allowed opacity-60" : ""
          }`}
        style={{ lineHeight: 0.9, fontWeight: 590, fontSize, color: hasValue ? color : "#9AA0A6" }}
        disabled={disabled}
      >
        {shownText === "*" ? (
          <span
            aria-hidden="true"
            className='font-sans translate-y-3 '
          >
            *
          </span>
        ) : (
          shownText
        )}

      </button>

      {open && (
        <div
          className={`absolute z-50 -mt-[10%] transition-all duration-150 ${appear ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
            }`}
          style={{
            top: `calc(100% + 4px)`,
            left: "50%",
            transform: `translateX(calc(-50% + ${dropdownOffsetX}px))`,
          }}
        >
          <div
            className="rounded-xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] flex flex-col font-auto-number border border-neutral-100"
            style={{ width: menuW, maxHeight: dropdownMaxHeight, overflow: "hidden" }}
          >
            {searchable && (
              <div className=" border-b border-neutral-200">
                <input
                  ref={searchRef}
                  type="text"
                  value={filter}
                  onChange={onSearchChange}
                  onKeyDown={onSearchKeyDown}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-md bg-neutral-100 px-3 py-2 text-lg font-semibold text-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#0177FF]"
                />
              </div>
            )}

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
              <ul
                className={`${listContainerClasses} overflow-y-auto overflow-x-hidden no-scrollbar`}
                style={{
                  maxHeight: listMaxHeight,
                  minHeight: searchable ? undefined : 160,
                  touchAction: "pan-y",
                  overscrollBehavior: "contain",
                }}
              >
                {filteredOptions.length === 0 ? (
                  <li className="px-4 py-3 text-center text-neutral-500 text-sm">
                    {normalizedOptions.length === 0 ? "Нет доступных значений" : "Ничего не найдено"}
                  </li>
                ) : (
                  filteredOptions.map((option, index) => {
                    const selected = option.value === value
                    const highlighted = index === activeIndex

                    const lowerLabel = option.label.toLowerCase()
                    const highlightIndex = shouldHighlight ? lowerLabel.indexOf(normalizedFilter) : -1

                    const before = highlightIndex >= 0 ? option.label.slice(0, highlightIndex) : option.label
                    const highlightPart =
                      highlightIndex >= 0 ? option.label.slice(highlightIndex, highlightIndex + highlightLength) : ""
                    const after = highlightIndex >= 0 ? option.label.slice(highlightIndex + highlightLength) : ""

                    return (
                      <li key={`${option.value}-${option.label}`} className="w-full">
                        <button
                          id={`${listboxId}-opt-${index}`}
                          role="option"
                          aria-selected={selected}
                          type="button"
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => selectOption(option)}
                          className={`w-full flex items-center justify-center transition-colors duration-150 rounded-full border text-center font-medium ${selected
                              ? "bg-[#0177FF] text-white border-[#0177FF]"
                              : "bg-neutral-200 text-neutral-800 border-neutral-200 hover:bg-neutral-300 text-[18px]"
                            } ${highlighted && !selected ? "ring-2 ring-[#0177FF]/40" : ""}`}
                          style={{
                            height: optionSize,
                            width: optionSize,
                            minHeight: optionSize,
                            minWidth: optionSize,
                            padding: 0,
                            lineHeight: 1,
                            aspectRatio: "1 / 1",
                            flexShrink: 0,
                          }}
                        >
                          {shouldHighlight && highlightPart ? (
                            <span>
                              {before}
                              <span className="text-[#0019FF]">{highlightPart}</span>
                              {after}
                            </span>
                          ) : (
                            option.label
                          )}
                        </button>
                      </li>
                    )
                  })
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default SlotSelect
