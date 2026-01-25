import React from "react";
import PlateSelectForm from "./PlateSelectForm";
import { useIsMdUp } from '@/shared/hooks/useIsMdUp'

type CompactProps = Omit<
  React.ComponentProps<typeof PlateSelectForm>,
  "size" | "responsive" | "showCaption"
>;

export default function PlateSelectForm320({
  className = "",
  flagSrc = "/flag-russia.svg",
  ...rest
}: CompactProps) {
  const isMdUp = useIsMdUp();

  return (
    <PlateSelectForm
      size={isMdUp ? "md" : "xs"}   
      responsive={false}
      showCaption={true}
      flagSrc={flagSrc}
      className={className}
      {...rest}
    />
  );
}