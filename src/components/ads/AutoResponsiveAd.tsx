import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AutoResponsiveAdProps {
  className?: string;
  adSlot?: string;
  adClient?: string;
}

/**
 * Auto Responsive Ad component for Google AdSense
 * Best for header/footer placements - automatically adapts to container width
 * 
 * Ad Slot: 7966964742 (De-Tax)
 */
export function AutoResponsiveAd({ 
  className = "",
  adSlot = "7966964742",
  adClient = "ca-pub-9117572925263537"
}: AutoResponsiveAdProps) {
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
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </motion.div>
  );
}

export default AutoResponsiveAd;
