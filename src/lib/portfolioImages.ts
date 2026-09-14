// Portfolio image registry.
//
// Every master JPEG in `src/assets/images` has a pre-optimised WebP twin in
// `src/assets/images-webp` (produced by `npm run webp`). We register both so
// components can serve WebP first with an automatic JPEG fallback.

const jpgModules = import.meta.glob<{ default: string }>("../assets/images/*.jpg", { eager: true });
const webpModules = import.meta.glob<{ default: string }>("../assets/images-webp/*.webp", { eager: true });

const basename = (path: string) =>
  (path.split("/").pop() || "").replace(/\.(jpe?g|webp)$/i, "").toLowerCase();

const webpByBase = new Map<string, string>();
for (const [path, mod] of Object.entries(webpModules)) {
  webpByBase.set(basename(path), mod.default);
}

const webpByJpg = new Map<string, string>();
const jpgEntries: Array<{ name: string; url: string }> = [];

for (const [path, mod] of Object.entries(jpgModules)) {
  const name = basename(path);
  jpgEntries.push({ name, url: mod.default });
  const twin = webpByBase.get(name);
  if (twin) webpByJpg.set(mod.default, twin);
}

export interface PortfolioImage {
  /** Stable identifier (original file name) */
  id: string;
  /** Optimised WebP asset */
  webp?: string;
  /** Original JPEG master — used as a fallback and for downloads */
  jpg: string;
}

const ordered: PortfolioImage[] = jpgEntries
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((entry) => ({ id: entry.name, jpg: entry.url, webp: webpByJpg.get(entry.url) }));

/** Every asset as a { jpg, webp } pair. */
export const portfolioImages: PortfolioImage[] = ordered;

/** Flat list of JPEG URLs — kept for backwards compatibility. */
export const allPortfolioImages: string[] = ordered.map((image) => image.jpg);

/** Resolve the WebP twin of a master JPEG URL, if one exists. */
export function webpFor(src?: string | null): string | undefined {
  if (!src) return undefined;
  return webpByJpg.get(src);
}

/** Resolve a delivery pair for any master URL. */
export function sourcesFor(src: string): { jpg: string; webp?: string } {
  return { jpg: src, webp: webpByJpg.get(src) };
}

/** Deterministic shuffle — a given seed always yields the same order. */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr];
  let s = seed || 1;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Aesthetic curation for the editorial surfaces: portraits and detail shots
 * pulled forward, so the first screens always show the strongest work.
 */
const HERO_IDS = [
  "610787255_18091426823512933_1799299191735210547_n",
  "610756631_18090836801512933_488238048205311311_n",
  "610729136_18090836774512933_3885188726826227617_n",
  "610656376_18090836798512933_78988767149787543_n",
  "610653362_18091426835512933_711436700991932225_n",
  "610616634_18090836810512933_3129438318110635050_n",
  "610569809_18090836819512933_4555267748492343079_n",
  "609633058_18090836783512933_9130986106977850224_n",
  "609413897_18090460985512933_5352821693449015380_n",
  "609182864_18090460994512933_8119033149750020944_n",
  "608762823_18090460178512933_62429884937554233_n",
  "607995778_18090460967512933_722007064675762579_n",
];

function curated(): PortfolioImage[] {
  const byId = new Map(ordered.map((image) => [image.id, image]));
  const featured = HERO_IDS.map((id) => byId.get(id)).filter(Boolean) as PortfolioImage[];
  const featuredIds = new Set(featured.map((image) => image.id));
  const rest = ordered.filter((image) => !featuredIds.has(image.id));
  return [...featured, ...rest];
}

/** Session-stable shuffle so the gallery feels composed, never random per render. */
const SESSION_SEED = 4177;

/** Curated, deterministically shuffled image set. */
export const shuffledImages: string[] = seededShuffle(curated(), SESSION_SEED).map((image) => image.jpg);

/** Curated, deterministically shuffled pairs. */
export const shuffledImageSet: PortfolioImage[] = seededShuffle(curated(), SESSION_SEED);

/** Get N images starting from an offset (wraps). */
export function getImages(count: number, offset = 0): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(shuffledImages[(offset + i) % shuffledImages.length]);
  }
  return result;
}

/** Get N image pairs starting from an offset (wraps). */
export function getImageSet(count: number, offset = 0): PortfolioImage[] {
  const result: PortfolioImage[] = [];
  for (let i = 0; i < count; i++) {
    result.push(shuffledImageSet[(offset + i) % shuffledImageSet.length]);
  }
  return result;
}

/** Single image at an index (wraps). */
export function getImage(index: number): string {
  return shuffledImages[index % shuffledImages.length];
}

/** Backwards-compatible alias. */
export function getImageUrls(count: number, offset = 0): string[] {
  return getImages(count, offset);
}

export function getImageStats() {
  return {
    total: allPortfolioImages.length,
    webpCoverage: `${webpByJpg.size} of ${allPortfolioImages.length} masters have a WebP twin`,
  };
}

if (import.meta.env.DEV) {
  console.log(`Portfolio: ${allPortfolioImages.length} masters · ${webpByJpg.size} WebP twins available`);
}
