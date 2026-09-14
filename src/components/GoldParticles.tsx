import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface GoldParticlesProps {
  count?: number;
  className?: string;
  interactive?: boolean;
}

function Particle({ particle, isVisible }: { particle: Particle; isVisible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={isVisible ? {
        opacity: [particle.opacity * 0.3, particle.opacity, particle.opacity * 0.3],
        scale: [1, 1.2, 1],
        y: [particle.y, particle.y - 30, particle.y],
      } : {}}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute rounded-full bg-gradient-gold"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size,
        boxShadow: `0 0 ${particle.size * 2}px rgba(212, 168, 85, 0.4)`,
      }}
    />
  );
}

export function GoldParticles({ count = 15, className = "", interactive = true }: GoldParticlesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 10 + 6,
          duration: Math.random() * 4 + 3,
          delay: Math.random() * 2,
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
      setParticles(newParticles);
    }
  }, [isInView, count]);

  return (
    <div ref={ref} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <Particle key={particle.id} particle={particle} isVisible={isVisible} />
      ))}
    </div>
  );
}

// Decorative shapes for backgrounds
interface DecorativeShapeProps {
  type: "circle" | "line" | "diamond";
  position: string;
  size?: string;
  opacity?: number;
}

export function DecorativeShape({ type, position, size = "100px", opacity = 0.1 }: DecorativeShapeProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const getShape = () => {
    switch (type) {
      case "circle":
        return <div className="rounded-full border border-primary" style={{ width: size, height: size }} />;
      case "line":
        return <div className="h-px w-full bg-gradient-gold" style={{ opacity }} />;
      case "diamond":
        return (
          <div 
            className="border border-primary"
            style={{ 
              width: size, 
              height: size,
              transform: "rotate(45deg)",
              opacity,
            }} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`absolute ${position}`}
    >
      {getShape()}
    </motion.div>
  );
}

// Floating decorative element that follows scroll
export function FloatingGoldElement({ 
  children, 
  offsetY = 50,
  duration = 6,
}: { 
  children: React.ReactNode;
  offsetY?: number;
  duration?: number;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -offsetY, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}


export default GoldParticles;
