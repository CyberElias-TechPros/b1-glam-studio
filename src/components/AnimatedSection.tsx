import { useEffect, useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({ children, className = "", delay = 0 }: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
}: {
  subtitle: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <AnimatedSection className={`mb-12 sm:mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
      <span className="text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary mb-3 block">
        {subtitle}
      </span>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </AnimatedSection>
  );
}

export function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      <div className="h-px w-12 bg-gradient-gold opacity-60" />
      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      <div className="h-px w-12 bg-gradient-gold opacity-60" />
    </div>
  );
}
