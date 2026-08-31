import { useState, useEffect, useRef, useCallback } from 'react';
import { getWebPUrl, supportsWebP } from '@/lib/webpConverter';

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
  const [, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const convertImage = async () => {
      setIsConverting(true);
      
      try {
        const supported = await supportsWebP();
        
        if (!supported) {
          if (isMounted) {
            setCurrentSrc(fallbackSrc || src);
          }
          return;
        }

        const webpUrl = await getWebPUrl(src);
        
        if (isMounted) {
          if (objectUrlRef.current && objectUrlRef.current.startsWith('blob:')) {
            URL.revokeObjectURL(objectUrlRef.current);
          }
          
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
      console.warn('WebP failed to load, falling back to JPEG:', src);
      setCurrentSrc(fallbackSrc || src);
      setHasError(true);
    } else {
      console.warn('Image failed to load:', src);
      setHasError(true);
    }
  }, [currentSrc, src, fallbackSrc]);

  const showSkeleton = !isLoaded || isConverting || currentSrc === null;

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={onClick}>
      {showSkeleton && (
        <div 
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-secondary via-muted to-secondary bg-[length:200%_100%] animate-shimmer"
          aria-hidden="true"
        />
      )}
      
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

export default WebPImage;
