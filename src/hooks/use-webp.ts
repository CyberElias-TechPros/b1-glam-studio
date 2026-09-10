import { useState, useEffect } from 'react';
import { supportsWebP, preloadAndConvertImages } from '@/lib/webpConverter';

/**
 * Hook to check WebP support
 */
export function useWebPSupport(): boolean | null {
  const [supports, setSupports] = useState<boolean | null>(null);

  useEffect(() => {
    supportsWebP().then(setSupports);
  }, []);

  return supports;
}

/**
 * Hook to preload and convert images in the background
 */
export function useWebPPreloader(urls: string[]) {
  const [progress, setProgress] = useState({ loaded: 0, total: urls.length });

  useEffect(() => {
    if (urls.length === 0) return;

    const preload = async () => {
      await preloadAndConvertImages(urls);
      setProgress({ loaded: urls.length, total: urls.length });
    };

    preload();
  }, [urls]);

  return progress;
}

/**
 * Utility to get the best image URL based on WebP support
 */
export function getOptimizedImageUrl(jpegUrl: string, supportsWebP: boolean): string {
  if (!supportsWebP) return jpegUrl;
  return jpegUrl;
}
