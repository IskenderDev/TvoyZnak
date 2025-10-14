import type { PropsWithChildren } from 'react'

export default function Container({ children }: PropsWithChildren) {
  return <div className="mx-auto px-4">{children}</div>;
}
