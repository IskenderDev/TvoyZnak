// PlateSelectForm320.tsx — НОВЫЙ КОМПОНЕНТ-ОБЁРТКА РОВНО 320×70
import React from "react";
import PlateSelectForm from "./PlateSelectForm";

// Наследуем все пропсы, кроме тех что фиксируем
type CompactProps = Omit<React.ComponentProps<typeof PlateSelectForm>, "size" | "responsive" | "showCaption">;

export default function PlateSelectForm320({ className = "", flagSrc = "/flag-russia.svg", ...rest }: CompactProps) {
  return (
    <PlateSelectForm
      size="xs"
      responsive={false}
      showCaption={false}
      flagSrc={flagSrc}
      className={` ${className}`}
      {...rest}
    />
  );
}
