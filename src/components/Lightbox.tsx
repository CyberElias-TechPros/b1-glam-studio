import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from "lucide-react";
import { sourcesFor } from "@/lib/portfolioImages";

const EASE = [0.16, 1, 0.3, 1] as const;

export interface LightboxProps {
  images: string[];
  captions?: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  /** Optional call to action rendered in the bottom bar. */
  action?: React.ReactNode;
  eyebrow?: string;
}

/**
 * The house lightbox: one image, full attention.
 * Wheel to zoom, drag to pan, arrows to travel, Esc to leave, swipe on touch.
 */
export function Lightbox({
  images,
  captions = [],
  currentIndex,
  onClose,
  onNavigate,
  action,
  eyebrow = "B1touch Artistry",
}: LightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef({ x: 0, y: 0 });
  const pressPoint = useRef<{ x: number; y: number } | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const total = images.length;
  const current = images[currentIndex];
  const sources = sourcesFor(current || "");

  const go = useCallback(
    (delta: number) => {
      if (!total) return;
      onNavigate((currentIndex + delta + total) % total);
    },
    [currentIndex, onNavigate, total]
  );

  const reset = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    reset();
  }, [currentIndex, reset]);

  // Keep the keyboard contract stable: the parent re-renders on scroll and on
  // every image change, so the listener is registered exactly once and reads
  // the freshest handlers through refs.
  const onCloseRef = useRef(onClose);
  const goRef = useRef(go);
  const resetRef = useRef(reset);

  useEffect(() => {
    onCloseRef.current = onClose;
    goRef.current = go;
    resetRef.current = reset;
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          onCloseRef.current();
          break;
        case "ArrowRight":
          goRef.current(1);
          break;
        case "ArrowLeft":
          goRef.current(-1);
          break;
        case "+":
        case "=":
          setZoom((z) => Math.min(3, z + 0.4));
          break;
        case "-":
          setZoom((z) => Math.max(1, z - 0.4));
          break;
        case "0":
          resetRef.current();
          break;
        default:
          break;
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const onWheel = (event: React.WheelEvent) => {
    if (!event.ctrlKey && Math.abs(event.deltaY) < 6) return;
    setZoom((z) => Math.min(3, Math.max(1, z - event.deltaY * 0.0016)));
  };

  const onPointerDown = (event: React.PointerEvent) => {
    pressPoint.current = { x: event.clientX, y: event.clientY };
    if (zoom <= 1) return;
    setDragging(true);
    dragOrigin.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
  };

  /**
   * The dark surround is an exit. Ignore presses that travelled (a pan, a swipe)
   * and only close when the press landed on empty stage or rail.
   */
  const closeOnEmptyPress = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const origin = pressPoint.current;
    pressPoint.current = null;
    if (origin && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 8) return;
    onClose();
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging || zoom <= 1) return;
    setOffset({ x: event.clientX - dragOrigin.current.x, y: event.clientY - dragOrigin.current.y });
  };

  const onTouchStart = (event: React.TouchEvent) => {
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (zoom > 1 || !touchStart.current) return;
    const dx = event.changedTouches[0].clientX - touchStart.current.x;
    const dy = event.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) go(dx > 0 ? -1 : 1);
    touchStart.current = null;
  };

  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="fixed inset-0 z-[1200] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${currentIndex + 1} of ${total}`}
    >
      <div className="absolute inset-0 bg-[hsl(20_14%_3%_/_0.97)] backdrop-blur-xl" onClick={onClose} />

      {/* Top rail */}
      <div
        className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-8"
        onClick={closeOnEmptyPress}
      >
        <div className="flex items-baseline gap-3">
          <span className="eyebrow">{eyebrow}</span>
          <span className="numeral text-xs text-muted-foreground">
            {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(1, z - 0.4))}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border/70 text-foreground/80 transition-colors hover:border-gold/50 hover:text-gold sm:flex"
            aria-label="Zoom out"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.4))}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border/70 text-foreground/80 transition-colors hover:border-gold/50 hover:text-gold sm:flex"
            aria-label="Zoom in"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={reset}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border/70 text-foreground/80 transition-colors hover:border-gold/50 hover:text-gold sm:flex"
            aria-label="Reset zoom"
          >
            <RotateCcw size={15} />
          </button>
          <button
            ref={closeRef}
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold-light transition-colors hover:bg-gold/20"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div
        className="relative z-10 flex flex-1 items-center justify-center overflow-hidden px-2 sm:px-16"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => setDragging(false)}
        onPointerLeave={() => setDragging(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={closeOnEmptyPress}
        data-cursor={zoom > 1 ? "drag" : undefined}
        data-cursor-label="Drag"
      >
        <AnimatePresence mode="wait">
          <motion.picture
            key={current}
            initial={{ opacity: 0, scale: 0.965 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.015 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="flex max-h-full items-center justify-center"
            style={{
              transform: `scale(${zoom}) translate3d(${offset.x / zoom}px, ${offset.y / zoom}px, 0)`,
              transition: dragging ? "none" : "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
              cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
            }}
          >
            {sources.webp && <source srcSet={sources.webp} type="image/webp" />}
            <img
              src={sources.jpg}
              alt={captions[currentIndex] || "B1touch Artistry portfolio"}
              draggable={false}
              className="max-h-[74vh] w-auto max-w-full object-contain shadow-cinema sm:max-h-[76vh]"
            />
          </motion.picture>
        </AnimatePresence>

        <button
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-[hsl(20_14%_5%_/_0.7)] text-foreground/80 backdrop-blur transition-all duration-500 hover:border-gold/50 hover:text-gold sm:left-4"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-[hsl(20_14%_5%_/_0.7)] text-foreground/80 backdrop-blur transition-all duration-500 hover:border-gold/50 hover:text-gold sm:right-4"
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Bottom rail */}
      <div className="relative z-20 px-4 pb-6 pt-4 sm:px-8" onClick={closeOnEmptyPress}>
        {captions[currentIndex] && (
          <p className="mb-4 text-center font-display text-lg text-foreground/90 sm:text-xl">
            {captions[currentIndex]}
          </p>
        )}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto scrollbar-hide">
          {images.slice(Math.max(0, currentIndex - 4), currentIndex + 5).map((image, i) => {
            const index = Math.max(0, currentIndex - 4) + i;
            const thumb = sourcesFor(image);
            return (
              <button
                key={`${image}-${index}`}
                onClick={() => onNavigate(index)}
                className={`h-12 w-12 shrink-0 overflow-hidden rounded-sm transition-all duration-500 ease-expo ${
                  index === currentIndex ? "ring-1 ring-gold opacity-100" : "opacity-40 hover:opacity-80"
                }`}
                aria-label={`Go to image ${index + 1}`}
              >
                <img src={thumb.webp || thumb.jpg} alt="" className="h-full w-full object-cover" />
              </button>
            );
          })}
        </div>
        {action && <div className="mt-5 flex justify-center">{action}</div>}
      </div>
    </motion.div>
  );
}

export default Lightbox;
