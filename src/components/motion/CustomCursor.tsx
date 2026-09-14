import { useEffect, useRef, useState } from "react";

interface CursorState {
  variant: "default" | "link" | "view" | "text";
  label: string;
}

/**
 * A single adaptive cursor: a precise gold dot with a lagging ring.
 * The ring expands and can carry a contextual label ("VIEW", "DRAG") whenever
 * it travels over an element declaring `data-cursor`.
 * Never rendered for touch devices or reduced-motion users.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>({ variant: "default", label: "" });
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pointer.x, y: pointer.y };
    let raf = 0;

    document.documentElement.classList.add("cursor-none-all");

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      setVisible(true);

      const el = event.target as HTMLElement | null;
      const holder = el?.closest?.("[data-cursor], a, button, input, textarea, select, label") as HTMLElement | null;

      if (!holder) {
        setState({ variant: "default", label: "" });
        return;
      }

      const declared = holder.getAttribute("data-cursor");
      if (declared === "view" || declared === "drag") {
        setState({ variant: declared, label: holder.getAttribute("data-cursor-label") || declared.toUpperCase() });
      } else if (holder.tagName === "INPUT" || holder.tagName === "TEXTAREA") {
        setState({ variant: "text", label: "" });
      } else {
        setState({ variant: "link", label: "" });
      }
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const render = () => {
      ring.x += (pointer.x - ring.x) * 0.16;
      ring.y += (pointer.y - ring.y) * 0.16;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("cursor-none-all");
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringSize = state.variant === "view" || state.variant === "drag" ? 96 : state.variant === "link" ? 52 : 34;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[10000] hidden lg:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 rounded-full bg-gold-light transition-[width,height,opacity] duration-300 ease-expo"
        style={{
          width: state.variant === "view" || state.variant === "drag" ? 0 : pressed ? 10 : 6,
          height: state.variant === "view" || state.variant === "drag" ? 0 : pressed ? 10 : 6,
          opacity: visible ? 1 : 0,
          boxShadow: "0 0 18px 2px hsl(44 74% 78% / 0.55)",
        }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color,opacity] duration-500 ease-expo"
        style={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? 1 : 0,
          borderColor: state.variant === "default" ? "hsl(40 62% 62% / 0.45)" : "hsl(44 74% 78% / 0.85)",
          backgroundColor: state.variant === "view" ? "hsl(40 62% 62% / 0.14)" : "transparent",
          backdropFilter: state.variant === "view" ? "blur(3px)" : "none",
        }}
      >
        <span
          className="font-sans text-[9px] uppercase tracking-[0.24em] text-gold-light transition-opacity duration-300"
          style={{ opacity: state.label ? 1 : 0 }}
        >
          {state.label}
        </span>
      </div>
    </div>
  );
}

export default CustomCursor;
