// Dynamically import all images from src/assets/images/
const imageModules = import.meta.glob<{ default: string }>(
  '../assets/images/*.jpg',
  { eager: true }
);

// Extract all image URLs into an array
export const allPortfolioImages: string[] = Object.values(imageModules).map(
  (mod) => mod.default
);

// Seeded shuffle for consistent random order per session
function seededShuffle(arr: string[], seed: number): string[] {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Session seed so order stays consistent during one visit
const SESSION_SEED = Math.floor(Math.random() * 10000);

export const shuffledImages = seededShuffle(allPortfolioImages, SESSION_SEED);

// Get N images starting from offset (wraps around)
export function getImages(count: number, offset = 0): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(shuffledImages[(offset + i) % shuffledImages.length]);
  }
  return result;
}

// Get a single image at index
export function getImage(index: number): string {
  return shuffledImages[index % shuffledImages.length];
}
