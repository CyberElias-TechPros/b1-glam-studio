import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FluidAdProps {
  className?: string;
  adSlot?: string;
  adClient?: string;
  adLayoutKey?: string;
}

/**
 * Fluid Ad component for Google AdSense
 * Best for flexible placements between content sections
 * Adapts to available space while maintaining good appearance
 * 
 * Ad Slot: 7138659300
 * Ad Layout Key: -6t+ed+2i-1n-4w
 */
export function FluidAd({ 
  className = "",
  adSlot = "7138659300",
  adClient = "ca-pub-9117572925263537",
  adLayoutKey = "-6t+ed+2i-1n-4w"
}: FluidAdProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Push ad to AdSense after component mounts
    try {
      if (typeof window !== 'undefined') {
        const win = window as Window & { adsbygoogle?: unknown[] };
        const adsbygoogle = win.adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`ad-container ${className}`}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key={adLayoutKey}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
      />
    </motion.div>
  );
}

export default FluidAd;
