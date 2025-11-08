import React from "react";
import PlateSelectForm from "./PlateSelectForm";

type CompactProps = Omit<React.ComponentProps<typeof PlateSelectForm>, "size" | "responsive" | "showCaption">;

export default function PlateSelectForm320({ className = "", flagSrc = "/flag-russia.svg", ...rest }: CompactProps) {
  return (
    <PlateSelectForm
      size="xs"
      responsive={false}
      showCaption={true}
      flagSrc={flagSrc}
      className={` ${className}`}
      {...rest}
    />
  );
}
