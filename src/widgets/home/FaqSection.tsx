import { useState } from "react";
import { faqs } from "./faqs";
import type { FaqItem } from "./faqs";
import { FaSquareMinus, FaSquarePlus } from 'react-icons/fa6'
import { LuInfo } from 'react-icons/lu'

function FaqRow({
  item,
  open,
  onToggle
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-xl border border-neutral-700 bg-[#1A1A1A] shadow-[0_0_0_1px_#2a2a2a] px-4 sm:px-6 py-4 sm:py-5"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="relative mt-1 grid place-items-center w-6 h-6 rounded-full bg-white text-xs shrink-0">
          <LuInfo className='text-[#0177FF] h-4 w-4' />
        </div>

        <div className="flex-1">
          <button
            className="w-full text-left flex items-center justify-between gap-3"
            aria-expanded={open}
            aria-controls={`faq-panel-${item.id}`}
            onClick={onToggle}
          >
            <span className="font-semibold text-[15px] sm:text-base text-white">
              {item.question}
            </span>

            <span
              className="shrink-0 text-white"
              aria-hidden="true"
              title={open ? "Свернуть" : "Развернуть"}
            >
              {open ? (
                <FaSquareMinus className="text-white w-5 h-5" />
              ) : (
                <FaSquarePlus  className="text-[#0177FF] w-5 h-5" />
              )}
            </span>
          </button>

          {/* Ответ */}
          <div
            id={`faq-panel-${item.id}`}
            role="region"
            aria-hidden={!open}
            className={[
              "overflow-hidden transition-all duration-300",
              open ? "max-h-80 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"
            ].join(" ")}
          >
            <p className="text-neutral-300 text-sm sm:text-[15px] leading-relaxed pr-10 mt-3">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection({
  items = faqs,
  defaultOpenIndex = 1 // как на скрине: второй открыт
}: {
  items?: FaqItem[];
  defaultOpenIndex?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <section className=" text-white py-12 md:py-16">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
        <h2 className="text-center text-2xl md:text-4xl font-bold uppercase tracking-wide">
          Часто задаваемые вопросы
        </h2>

        <div className="mt-6 md:mt-8 space-y-4">
          {items.map((item, i) => (
            <FaqRow
              key={item.id}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
