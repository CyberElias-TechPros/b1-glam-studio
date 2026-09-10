import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AutorelaxedAdProps {
  className?: string;
  adSlot?: string;
  adClient?: string;
}

/**
 * Autorelaxed Ad component for Google AdSense
 * Best for content feeds and blog listings
 * Shows related content recommendations in a native format
 * 
 * Ad Slot: 9573250952
 */
export function AutorelaxedAd({ 
  className = "",
  adSlot = "9573250952",
  adClient = "ca-pub-9117572925263537"
}: AutorelaxedAdProps) {
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
        data-ad-format="autorelaxed"
        data-ad-client={adClient}
        data-ad-slot={adSlot}
      />
    </motion.div>
  );
}

export default AutorelaxedAd;
