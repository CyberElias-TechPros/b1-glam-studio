import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { webpFor } from "@/lib/portfolioImages";

export const EASE = [0.16, 1, 0.3, 1] as const;

type RevealVariant = "up" | "fade" | "mask" | "scale" | "blur" | "left" | "right";

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

const variants: Record<RevealVariant, { hidden: CSSProperties; visible: CSSProperties }> = {
  up: { hidden: { opacity: 0, y: 42 }, visible: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  mask: { hidden: { opacity: 0, y: "108%" }, visible: { opacity: 1, y: "0%" } },
  scale: { hidden: { opacity: 0, scale: 0.94 }, visible: { opacity: 1, scale: 1 } },
  blur: { hidden: { opacity: 0, filter: "blur(14px)", y: 26 }, visible: { opacity: 1, filter: "blur(0px)", y: 0 } },
  left: { hidden: { opacity: 0, x: 64 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -64 }, visible: { opacity: 1, x: 0 } },
};

/** Scroll-triggered entrance with the house easing. */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration = 1,
  className = "",
  once = true,
  amount = 0.25,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });
  const v = variants[variant];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={v.hidden}
      animate={inView ? v.visible : v.hidden}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

interface SplitTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
  duration?: number;
  once?: boolean;
  highlightFrom?: number;
}

/**
 * Word-by-word masked reveal. Screen readers hear the sentence intact while
 * the eye gets the type set one beat at a time.
 */
export function SplitText({
  text,
  className = "",
  as = "h2",
  delay = 0,
  stagger = 0.055,
  duration = 1.1,
  once = true,
  highlightFrom,
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: 0.3 });
  const words = text.split(" ");
  const Tag = motion[as] as typeof motion.h2;

  return (
    <div ref={ref} className="w-full">
      <Tag className={className} aria-label={text}>
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom" aria-hidden>
            <motion.span
              className={`inline-block ${highlightFrom !== undefined && i >= highlightFrom ? "text-gradient-gold display-italic" : ""}`}
              initial={{ y: "115%", opacity: 0 }}
              animate={inView ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
              transition={{ duration, delay: delay + i * stagger, ease: EASE }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </Tag>
    </div>
  );
}

/** Vertical parallax on scroll. */
export function Parallax({
  children,
  distance = 60,
  className = "",
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.4 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

interface RevealMediaProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** vertical parallax travel in px */
  parallax?: number;
  eager?: boolean;
  ratio?: string;
  cursor?: string;
  onClick?: () => void;
  grade?: boolean;
  drift?: boolean;
}

/**
 * The signature image treatment: clip-path curtain reveal, slow parallax,
 * cinematic warm grade and optional idle drift for hero-scale media.
 */
export function RevealMedia({
  src,
  alt,
  className = "",
  imgClassName = "",
  parallax = 40,
  eager = false,
  ratio,
  cursor,
  onClick,
  grade = true,
  drift = false,
}: RevealMediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);
  const webpSrc = useMemo(() => webpFor(src), [src]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      data-cursor={cursor}
      className={`group relative overflow-hidden ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <motion.div
        className="absolute inset-[-8%]"
        style={{ y }}
        initial={false}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <picture>
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <motion.img
            src={src}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            initial={{ scale: 1.22, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 1.22, opacity: 0 }}
            transition={{ duration: 1.6, ease: EASE }}
            className={`h-full w-full object-cover ${drift ? "animate-slow-drift" : ""} ${imgClassName}`}
          />
        </picture>
      </motion.div>

      {grade && <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,hsl(20_14%_4%_/_0.15)_0%,transparent_35%,hsl(20_14%_4%_/_0.55)_100%)]" />}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_80%_0%,hsl(40_62%_62%_/_0.1),transparent_60%)] opacity-0 transition-opacity duration-700 ease-expo group-hover:opacity-100" />

      {/* Curtain reveal */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[hsl(20_14%_4%)]"
        initial={{ y: "0%" }}
        animate={inView ? { y: "-101%" } : { y: "0%" }}
        transition={{ duration: 1.25, ease: EASE }}
      />
    </div>
  );
}

/** Subtle magnetic pull toward the pointer — used on primary CTAs. */
export function Magnetic({
  children,
  strength = 0.28,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.35 });

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-flex ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}

/** 3D tilt + pointer-tracked spotlight. */
export function TiltCard({
  children,
  className = "",
  intensity = 7,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.transform = `perspective(1100px) rotateY(${(px - 0.5) * intensity * 2}deg) rotateX(${(0.5 - py) * intensity * 2}deg) translateY(-4px)`;
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1100px) rotateY(0deg) rotateX(0deg) translateY(0)";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`spotlight panel lift ${className}`}
      style={{ transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {children}
    </div>
  );
}

/** Infinite horizontal ticker. */
export function Marquee({
  items,
  className = "",
  itemClassName = "",
  slow = false,
  reverse = false,
  separator = "✦",
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
  slow?: boolean;
  reverse?: boolean;
  separator?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-mask overflow-hidden ${className}`}>
      <div
        className={`marquee-track ${slow ? "marquee-track-slow" : ""} ${reverse ? "marquee-reverse" : ""}`}
      >
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className={`flex shrink-0 items-center ${itemClassName}`}>
            <span className="whitespace-nowrap">{item}</span>
            <span className="mx-6 text-gold/50 sm:mx-9" aria-hidden>
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Counts up to a value the first time it enters the viewport. */
export function Counter({
  value,
  suffix = "",
  prefix = "",
  duration = 1900,
  className = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);
  const isDecimal = !Number.isInteger(value);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {isDecimal ? display.toFixed(1) : Math.round(display).toLocaleString()}
      {suffix}
    </span>
  );
}

/** Animated scroll affordance. */
export function ScrollCue({ label = "Scroll" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="eyebrow-muted text-[0.5625rem]">{label}</span>
      <div className="relative h-14 w-px overflow-hidden bg-gold/20">
        <motion.span
          className="absolute inset-x-0 top-0 h-5 bg-gradient-gold"
          animate={{ y: [-22, 56] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

/** Section ornament: hairline with a gold lozenge. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/60" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
      <span className="h-px w-8 bg-gold/40" />
    </div>
  );
}

/** Editorial section label: 01 — SERVICES */
export function SectionIndex({
  index,
  label,
  className = "",
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="numeral text-xs text-gold/70">{index}</span>
      <span className="h-px w-10 bg-gold/30" />
      <span className="eyebrow">{label}</span>
    </div>
  );
}
