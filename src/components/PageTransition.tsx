import { ReactNode } from "react";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
  location?: string;
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as Transition["ease"],
      when: "beforeChildren",
    } as Transition,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.6, 1] as Transition["ease"],
    } as Transition,
  },
};

const contentVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  enter: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as Transition["ease"],
      delay: 0.1,
    } as Transition,
  },
  exit: { 
    opacity: 0, 
    y: -30,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.6, 1] as Transition["ease"],
    } as Transition,
  },
};

export function PageTransition({ children, location }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <motion.div variants={contentVariants}>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
