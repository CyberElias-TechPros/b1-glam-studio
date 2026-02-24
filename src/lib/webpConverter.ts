/**
 * Client-Side WebP Converter
 * 
 * Converts JPEG images to WebP format in the browser using Canvas API.
 * Caches converted images in IndexedDB for persistence.
 * Works even when the site is hosted (no server required).
 */

const DB_NAME = 'b1touch-webp-cache';
const DB_VERSION = 1;
const STORE_NAME = 'images';
const CACHE_EXPIRY_DAYS = 30;

interface CachedImage {
  url: string;
  webpBlob: Blob;
  timestamp: number;
  originalSize: number;
  webpSize: number;
}

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB for caching WebP images
 */
async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'url' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

/**
 * Get cached WebP image from IndexedDB
 */
async function getCachedImage(url: string): Promise<Blob | null> {
  try {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(url);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const cached = request.result as CachedImage | undefined;
        if (cached) {
          // Check if cache is expired
          const daysSinceCache = (Date.now() - cached.timestamp) / (1000 * 60 * 60 * 24);
          if (daysSinceCache > CACHE_EXPIRY_DAYS) {
            // Delete expired cache
            deleteCachedImage(url);
            resolve(null);
            return;
          }
          resolve(cached.webpBlob);
        } else {
          resolve(null);
        }
      };
    });
  } catch (error) {
    console.warn('Failed to get cached image:', error);
    return null;
  }
}

/**
 * Cache WebP image in IndexedDB
 */
async function cacheImage(url: string, webpBlob: Blob, originalSize: number): Promise<void> {
  try {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const cachedImage: CachedImage = {
        url,
        webpBlob,
        timestamp: Date.now(),
        originalSize,
        webpSize: webpBlob.size,
      };

      const request = store.put(cachedImage);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.warn('Failed to cache image:', error);
  }
}

/**
 * Delete cached image
 */
async function deleteCachedImage(url: string): Promise<void> {
  try {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(url);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.warn('Failed to delete cached image:', error);
  }
}

/**
 * Convert image to WebP using Canvas API
 */
async function convertToWebP(imageUrl: string, quality = 0.8): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Cache the result
              fetch(imageUrl)
                .then(res => res.blob())
                .then(originalBlob => {
                  cacheImage(imageUrl, blob, originalBlob.size);
                })
                .catch(() => {
                  // Still cache even if we can't get original size
                  cacheImage(imageUrl, blob, 0);
                });
              resolve(blob);
            } else {
              resolve(null);
            }
          },
          'image/webp',
          quality
        );
      } catch (error) {
        console.warn('Failed to convert image to WebP:', error);
        resolve(null);
      }
    };

    img.onerror = () => {
      console.warn('Failed to load image for conversion:', imageUrl);
      resolve(null);
    };

    img.src = imageUrl;
  });
}

/**
 * Get WebP version of an image (with caching)
 * Returns the WebP blob URL or falls back to original
 */
export async function getWebPUrl(jpegUrl: string): Promise<string> {
  // Check if browser supports WebP
  if (!await supportsWebP()) {
    return jpegUrl;
  }

  // Check cache first
  const cached = await getCachedImage(jpegUrl);
  if (cached) {
    return URL.createObjectURL(cached);
  }

  // Convert to WebP
  const webpBlob = await convertToWebP(jpegUrl);
  if (webpBlob) {
    return URL.createObjectURL(webpBlob);
  }

  // Fallback to original
  return jpegUrl;
}

/**
 * Check if browser supports WebP
 */
let webpSupported: boolean | null = null;

export async function supportsWebP(): Promise<boolean> {
  if (webpSupported !== null) return webpSupported;

  // Check sessionStorage cache
  const cached = sessionStorage.getItem('webp-support');
  if (cached !== null) {
    webpSupported = cached === 'true';
    return webpSupported;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      webpSupported = img.width > 0 && img.height > 0;
      sessionStorage.setItem('webp-support', String(webpSupported));
      resolve(webpSupported);
    };
    img.onerror = () => {
      webpSupported = false;
      sessionStorage.setItem('webp-support', 'false');
      resolve(false);
    };
    img.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  });
}

/**
 * Preload and convert images in the background
 */
export async function preloadAndConvertImages(urls: string[]): Promise<void> {
  const supported = await supportsWebP();
  if (!supported) return;

  // Process in batches to avoid overwhelming the browser
  const batchSize = 5;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (url) => {
        const cached = await getCachedImage(url);
        if (!cached) {
          await convertToWebP(url);
        }
      })
    );
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  count: number;
  totalSize: number;
  savedSize: number;
}> {
  try {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const images = request.result as CachedImage[];
        const totalSize = images.reduce((sum, img) => sum + img.webpSize, 0);
        const savedSize = images.reduce(
          (sum, img) => sum + (img.originalSize - img.webpSize),
          0
        );
        resolve({
          count: images.length,
          totalSize,
          savedSize: Math.max(0, savedSize),
        });
      };
    });
  } catch (error) {
    console.warn('Failed to get cache stats:', error);
    return { count: 0, totalSize: 0, savedSize: 0 };
  }
}

/**
 * Clear the entire cache
 */
export async function clearCache(): Promise<void> {
  try {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
}

/**
 * React hook for WebP conversion
 */
export function useWebPConverter() {
  return {
    getWebPUrl,
    supportsWebP,
    preloadAndConvertImages,
    getCacheStats,
    clearCache,
  };
}
