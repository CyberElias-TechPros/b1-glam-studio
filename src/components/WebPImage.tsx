import { useCallback, useState } from "react";
import { webpFor } from "@/lib/portfolioImages";

interface WebPImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  loading?: "lazy" | "eager";
  decoding?: "async" | "auto" | "sync";
  onLoad?: () => void;
  fallbackSrc?: string;
  /** Optional explicit WebP twin (defaults to the registry lookup). */
  webpSrc?: string;
  /** Native sizes hint for responsive art direction. */
  sizes?: string;
}

/**
 * WebPImage
 *
 * Serves the pre-optimised WebP twin of a master JPEG through <picture>, with
 * the JPEG kept as an automatic fallback for non-WebP engines. Assets are
 * decoded during build time, so nothing is re-encoded in the browser — the
 * image simply fades up once the browser has it.
 */
export function WebPImage({
  src,
  alt,
  className = "",
  onClick,
  loading = "lazy",
  decoding = "async",
  onLoad,
  fallbackSrc,
  webpSrc,
  sizes,
}: WebPImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const webp = webpSrc || webpFor(src);
  const fallback = fallbackSrc || src;

  const handleLoad = useCallback(() => {
    setLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setErrored(true);
    setLoaded(true);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={onClick}>
      {!loaded && (
        <div
          className="animate-shimmer absolute inset-0"
          aria-hidden
          style={{ backgroundSize: "200% 100%" }}
        />
      )}

      <picture>
        {webp && !errored && <source srcSet={webp} type="image/webp" sizes={sizes} />}
        <img
          src={fallback}
          alt={alt}
          loading={loading}
          decoding={decoding}
          draggable={false}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={`h-full w-full object-cover transition-[opacity,transform,filter] duration-[900ms] ease-expo ${
            loaded ? "scale-100 opacity-100 blur-0" : "scale-[1.04] opacity-0 blur-md"
          } ${onClick ? "cursor-pointer" : ""}`}
        />
      </picture>
    </div>
  );
}

export default WebPImage;
