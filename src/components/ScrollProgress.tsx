import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * A one-pixel thread of gold that measures how far the story has been read.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const glowLeft = useTransform(scaleX, (value) => `${value * 100}%`);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[999] h-[2px]">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-gold-dark via-gold to-gold-light"
        style={{ scaleX }}
      />
      <motion.div
        className="absolute top-0 h-[2px] w-14 -translate-x-1/2 bg-gold-light/80 blur-[6px]"
        style={{ left: glowLeft }}
      />
    </div>
  );
}

export default ScrollProgress;
