import { useState } from "react";
import { faqs } from "./faqs";
import type { FaqItem } from "./faqs";
import { FaMinus, FaPlus } from 'react-icons/fa'

const DEFAULT_OPEN_INDEX = null;

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
    <div className="rounded-4xl   bg-[#131313]  px-4 sm:px-6 py-4 sm:py-5 hover:bg-[#282828] transition-colors duration-500">
      <div className="flex items-center gap-3 sm:gap-4">
        

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
                <FaMinus className='w-3 h-3 text-white' />
              ) : (
                <FaPlus className='w-3 h-3 text-white' />
              )}
            </span>
          </button>

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
  defaultOpenIndex = DEFAULT_OPEN_INDEX,
}: {
  items?: FaqItem[];
  defaultOpenIndex?: number | null;
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
