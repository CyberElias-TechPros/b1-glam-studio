import "@testing-library/jest-dom";
import { configure } from "@testing-library/dom";

// The app animates route + panel transitions; give queries room to settle.
configure({ asyncUtilTimeout: 6000 });

/* ------------------------------------------------------------------
   jsdom shims — the app relies on a handful of browser APIs that
   jsdom does not implement. These stubs keep the happy-path suite
   honest without weakening production behaviour.
   ------------------------------------------------------------------ */

// Default: fine pointer (desktop), reduced motion ON for deterministic tests.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [0];
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element): void {
    // Report as immediately visible so lazy content mounts in tests.
    queueMicrotask(() => {
      this.callback(
        [
          {
            isIntersecting: true,
            target,
            intersectionRatio: 1,
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRect: target.getBoundingClientRect(),
            rootBounds: null,
            time: Date.now(),
          } as IntersectionObserverEntry,
        ],
        this
      );
    });
  }

  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

class MockResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

Object.defineProperty(window, "IntersectionObserver", { writable: true, value: MockIntersectionObserver });
Object.defineProperty(window, "ResizeObserver", { writable: true, value: MockResizeObserver });
Object.defineProperty(globalThis, "IntersectionObserver", { writable: true, value: MockIntersectionObserver });
Object.defineProperty(globalThis, "ResizeObserver", { writable: true, value: MockResizeObserver });

// Navigation + measurement APIs jsdom leaves unimplemented.
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};
Object.defineProperty(navigator, "clipboard", {
  writable: true,
  value: { writeText: async () => {} },
});

// Radix needs pointer-capture APIs that jsdom does not provide.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
}

// Quiet the noisy "not wrapped in act" style console errors during form posts.
const originalError = console.error;
console.error = (...args: unknown[]) => {
  const first = typeof args[0] === "string" ? args[0] : "";
  if (first.includes("Not implemented: window.scrollTo")) return;
  originalError(...(args as []));
};
