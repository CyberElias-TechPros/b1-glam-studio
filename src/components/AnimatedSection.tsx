import { useEffect, useRef, ReactNode } from "react";
import { motion, useInView, useScroll, useTransform, Variants, Transition } from "framer-motion";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale" | "parallax";
  parallaxOffset?: number;
}

export function AnimatedSection({ 
  children, 
  className = "", 
  delay = 0,
  animation = "fade-up",
  parallaxOffset = 50,
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [parallaxOffset, -parallaxOffset]);

  const getAnimationVariants = (): Variants => {
    switch (animation) {
      case "fade-in":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      case "slide-left":
        return {
          hidden: { opacity: 0, x: 100 },
          visible: { opacity: 1, x: 0 },
        };
      case "slide-right":
        return {
          hidden: { opacity: 0, x: -100 },
          visible: { opacity: 1, x: 0 },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 },
        };
      case "parallax":
        return {
          hidden: { opacity: 0, y: parallaxOffset },
          visible: { opacity: 1, y: 0 },
        };
      case "fade-up":
      default:
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        };
    }
  };

  const transition: Transition = {
    duration: animation === "parallax" ? 0.8 : 0.7,
    delay,
    ease: [0.4, 0, 0.2, 1],
  };

  return (
    <motion.div
      ref={ref}
      variants={getAnimationVariants()}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={transition}
      style={animation === "parallax" ? { y } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function StaggerContainer({ 
  children, 
  className = "", 
  delay = 0,
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale";
}

export function StaggerItem({ 
  children, 
  className = "",
  animation = "fade-up",
}: StaggerItemProps) {
  const getAnimationVariants = (): Variants => {
    switch (animation) {
      case "fade-in":
        return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
      case "slide-left":
        return { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } };
      case "slide-right":
        return { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } };
      case "scale":
        return { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };
      case "fade-up":
      default:
        return { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
    }
  };

  return (
    <motion.div
      variants={getAnimationVariants()}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  offset?: number;
}

export function ParallaxImage({ src, alt, className = "", offset = 30 }: ParallaxImageProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

interface ParallaxCardProps {
  children: ReactNode;
  className?: string;
  offset?: number;
}

export function ParallaxCard({ children, className = "", offset = 20 }: ParallaxCardProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.div
      ref={ref}
      style={{ y, scale }}
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
