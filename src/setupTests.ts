import "@testing-library/jest-dom/vitest";

class ResizeObserverMock implements ResizeObserver {
  observe(): void {
    // noop
  }

  unobserve(): void {
    // noop
  }

  disconnect(): void {
    // noop
  }
}

if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
  // @ts-expect-error – jsdom environment augmentation
  window.ResizeObserver = ResizeObserverMock;
}
