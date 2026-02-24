import { useState, useEffect, useRef, useCallback } from 'react';
import { getWebPUrl, supportsWebP, preloadAndConvertImages } from '@/lib/webpConverter';

interface WebPImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'auto' | 'sync';
  onLoad?: () => void;
  fallbackSrc?: string;
}

/**
 * WebPImage Component
 * 
 * Automatically serves WebP images with JPEG fallback for browsers that don't support WebP.
 * Converts images on-the-fly using Canvas API and caches in IndexedDB.
 * Works even when the site is hosted (no server required).
 * 
 * @example
 * <WebPImage 
 *   src="/images/photo.jpg" 
 *   alt="Portfolio image"
 *   className="w-full h-full object-cover"
 *   loading="lazy"
 * />
 */
export function WebPImage({
  src,
  alt,
  className = '',
  onClick,
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  fallbackSrc,
}: WebPImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Convert image to WebP on mount
  useEffect(() => {
    let isMounted = true;

    const convertImage = async () => {
      setIsConverting(true);
      
      try {
        // Check if browser supports WebP
        const supported = await supportsWebP();
        
        if (!supported) {
          // Browser doesn't support WebP, use original
          if (isMounted) {
            setCurrentSrc(fallbackSrc || src);
          }
          return;
        }

        // Try to get WebP version (from cache or convert)
        const webpUrl = await getWebPUrl(src);
        
        if (isMounted) {
          // Revoke previous object URL if it was created
          if (objectUrlRef.current && objectUrlRef.current.startsWith('blob:')) {
            URL.revokeObjectURL(objectUrlRef.current);
          }
          
          // If we got a blob URL, save it for cleanup
          if (webpUrl.startsWith('blob:')) {
            objectUrlRef.current = webpUrl;
          }
          
          setCurrentSrc(webpUrl);
        }
      } catch (error) {
        console.warn('WebP conversion failed, using original:', error);
        if (isMounted) {
          setCurrentSrc(fallbackSrc || src);
        }
      } finally {
        if (isMounted) {
          setIsConverting(false);
        }
      }
    };

    convertImage();

    return () => {
      isMounted = false;
      // Cleanup object URL on unmount
      if (objectUrlRef.current && objectUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, [src, fallbackSrc]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (currentSrc !== src && currentSrc !== fallbackSrc) {
      // WebP failed, try original JPEG
      console.warn('WebP failed to load, falling back to JPEG:', src);
      setCurrentSrc(fallbackSrc || src);
      setHasError(true);
    } else {
      console.warn('Image failed to load:', src);
      setHasError(true);
    }
  }, [currentSrc, src, fallbackSrc]);

  // Show skeleton while converting or loading
  const showSkeleton = !isLoaded || isConverting || currentSrc === null;

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={onClick}>
      {/* Skeleton/Placeholder */}
      {showSkeleton && (
        <div 
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-secondary via-muted to-secondary bg-[length:200%_100%] animate-shimmer"
          aria-hidden="true"
        />
      )}
      
      {/* Main Image */}
      {currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full object-cover
            transition-all duration-500 ease-out
            ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
            ${onClick ? 'cursor-pointer' : ''}
          `}
        />
      )}
    </div>
  );
}

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
 * This is for compatibility with existing code
 */
export function getOptimizedImageUrl(jpegUrl: string, supportsWebP: boolean): string {
  if (!supportsWebP) return jpegUrl;
  // For synchronous use, just return the JPEG URL
  // The WebPImage component will handle conversion
  return jpegUrl;
}

export default WebPImage;
