import { useState, useEffect, useRef } from 'react';

interface LazyAdProps {
  children: React.ReactNode;
  className?: string;
  placeholder?: React.ReactNode;
}

export function LazyAd({ children, className = "", placeholder }: LazyAdProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {isVisible
        ? children
        : placeholder || (
            <div className="ad-container h-[90px]">
              <div className="absolute inset-0 animate-pulse bg-[linear-gradient(90deg,transparent,hsl(40_62%_62%_/_0.06),transparent)] bg-[length:200%_100%] animate-shimmer" />
            </div>
          )}
    </div>
  );
}
