import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxHeroProps {
  children: ReactNode;
  backgroundImage?: string;
  className?: string;
  overlayClassName?: string;
}

export function ParallaxHero({ 
  children, 
  backgroundImage,
  className = "",
  overlayClassName = "",
}: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section 
      ref={ref} 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
    >
      {backgroundImage && (
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y, scale }}
        >
          <img
            src={backgroundImage}
            alt="Elegant beauty background with gold accents"
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40 ${overlayClassName}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </motion.div>
      )}
      
      <motion.div 
        className="relative z-10"
        style={{ opacity }}
      >
        {children}
      </motion.div>
    </section>
  );
}

interface ParallaxBackgroundProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxBackground({ 
  children, 
  className = "",
  speed = 0.5,
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }} className="absolute inset-0">
        {children}
      </motion.div>
    </div>
  );
}

export default ParallaxHero;
