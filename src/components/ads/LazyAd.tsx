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
      {isVisible ? children : placeholder || (
        <div className="bg-secondary/30 rounded-lg animate-pulse h-24" />
      )}
    </div>
  );
}
