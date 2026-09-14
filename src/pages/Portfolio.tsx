import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Instagram, ZoomIn } from "lucide-react";
import Layout from "@/components/Layout";
import Lightbox from "@/components/Lightbox";
import { FluidAd, LazyAd } from "@/components/ads";
import { getImages, shuffledImages, sourcesFor } from "@/lib/portfolioImages";
import {
  Magnetic,
  Reveal,
  RevealMedia,
  SectionIndex,
  SplitText,
} from "@/components/motion/Reveal";

const IMAGES_PER_PAGE = 24;
const CAROUSEL_COUNT = 8;

const CATEGORIES = [
  "All",
  "Bridal",
  "Owambe / Events",
  "Editorial",
  "Dark Skin",
  "Bold / Afrocentric",
  "Soft Glam",
] as const;
type GalleryCategory = (typeof CATEGORIES)[number];

const STUDIO_CATEGORIES: Exclude<GalleryCategory, "All">[] = [
  "Bridal",
  "Owambe / Events",
  "Editorial",
  "Dark Skin",
  "Bold / Afrocentric",
  "Soft Glam",
];

/**
 * Stable, id-derived categorisation. Deriving from the file name (rather than
 * the render index) keeps every look in the same collection no matter how the
 * gallery is filtered or paged.
 */
function categoryFor(id: string): Exclude<GalleryCategory, "All"> {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 100000;
  }
  return STUDIO_CATEGORIES[hash % STUDIO_CATEGORIES.length];
}

const CAPTIONS = [
  "Traditional bridal glam",
  "Owambe queen",
  "Editorial perfection",
  "Melanin magic",
  "Soft glow beauty",
  "Bold afrocentric",
  "Luxury bridal",
  "Dark skin radiance",
];

function FeaturedCarousel() {
  const featured = useMemo(() => getImages(CAROUSEL_COUNT, 0), []);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((delta: number) => {
    setCurrent((c) => (c + delta + CAROUSEL_COUNT) % CAROUSEL_COUNT);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => go(1), 4600);
    return () => window.clearInterval(timer);
  }, [go, paused]);

  const manual = (delta: number) => {
    setPaused(true);
    go(delta);
    window.setTimeout(() => setPaused(false), 9000);
  };

  return (
    <div
      className="group relative overflow-hidden rounded-sm bg-secondary"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      data-cursor="drag"
      data-cursor-label="Featured"
    >
      <div className="relative h-[62vh] min-h-[26rem] w-full sm:h-[74vh]">
        <AnimatePresence initial={false}>
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <picture>
              {sourcesFor(featured[current]).webp && (
                <source srcSet={sourcesFor(featured[current]).webp} type="image/webp" />
              )}
              <img
                src={sourcesFor(featured[current]).jpg}
                alt={CAPTIONS[current % CAPTIONS.length]}
                className="h-full w-full object-cover"
                loading={current === 0 ? "eager" : "lazy"}
              />
            </picture>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(20_14%_4%_/_0.35)_0%,transparent_35%,hsl(20_14%_3%_/_0.9)_100%)]" />
          </motion.div>
        </AnimatePresence>

        {/* Caption */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={`caption-${current}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="eyebrow">Featured look</span>
              <h3 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
                {CAPTIONS[current % CAPTIONS.length]}
              </h3>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-3">
            <button
              onClick={() => manual(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-[hsl(20_14%_4%_/_0.55)] text-foreground/80 backdrop-blur transition-all duration-500 hover:border-gold/60 hover:text-gold"
              aria-label="Previous featured look"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => manual(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-[hsl(20_14%_4%_/_0.55)] text-foreground/80 backdrop-blur transition-all duration-500 hover:border-gold/60 hover:text-gold"
              aria-label="Next featured look"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Progress rail */}
        <div className="absolute inset-x-6 bottom-0 z-10 flex gap-1.5 pb-5 sm:inset-x-9">
          {Array.from({ length: CAROUSEL_COUNT }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="group/rail h-[3px] flex-1 overflow-hidden rounded-full bg-foreground/20"
              aria-label={`Show featured look ${i + 1}`}
            >
              <span
                className={`block h-full origin-left bg-gradient-gold transition-transform duration-700 ease-expo ${
                  i === current ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [category, setCategory] = useState<GalleryCategory>("All");
  const [count, setCount] = useState(IMAGES_PER_PAGE);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const all = useMemo(
    () => shuffledImages.map((image, index) => ({ image, cat: categoryFor(image.split("/").pop() || String(index)), id: `${image}-${index}` })),
    []
  );

  const filtered = useMemo(
    () => (category === "All" ? all : all.filter((item) => item.cat === category)),
    [all, category]
  );

  const visible = filtered.slice(0, count);
  const lightboxImages = useMemo(() => filtered.map((item) => item.image), [filtered]);

  useEffect(() => {
    setCount(IMAGES_PER_PAGE);
  }, [category]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of all) map.set(item.cat, (map.get(item.cat) || 0) + 1);
    return map;
  }, [all]);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden pb-14 pt-36 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_20%_0%,hsl(344_34%_24%_/_0.4),transparent_60%)]" />
        <div className="shell">
          <Reveal variant="fade">
            <SectionIndex index="01" label="Portfolio" className="mb-8" />
          </Reveal>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <SplitText
              as="h1"
              text="The gallery"
              highlightFrom={1}
              className="display-xl"
              delay={0.15}
            />
            <Reveal variant="up" delay={0.5}>
              <p className="lede max-w-lg">
                {shuffledImages.length}+ looks from the studio and on location across Lagos. Filter by
                collection, open any frame full-screen, and zoom into the detail.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="pb-8">
        <div className="shell">
          <Reveal variant="fade" delay={0.2}>
            <FeaturedCarousel />
          </Reveal>
        </div>
      </section>

      {/* FILTERS */}
      <section className="sticky top-[4.5rem] z-[800] border-y border-border/60 bg-[hsl(20_14%_4%_/_0.86)] py-4 backdrop-blur-xl lg:top-20">
        <div className="shell flex flex-col gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((item) => {
              const active = category === item;
              const total = item === "All" ? all.length : counts.get(item) || 0;
              return (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full border px-4 py-2 font-sans text-[0.625rem] uppercase tracking-[0.18em] transition-all duration-500 ease-expo ${
                    active
                      ? "border-transparent bg-gradient-gold text-primary-foreground"
                      : "border-border/80 text-muted-foreground hover:border-gold/40 hover:text-gold-light"
                  }`}
                >
                  {item}
                  <span className="ml-2 opacity-60">{total}</span>
                </button>
              );
            })}
          </div>
          <p className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
            Showing {Math.min(count, filtered.length)} of {filtered.length} looks
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="py-10 sm:py-14">
        <div className="shell">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {visible.map((item, i) => (
              <Reveal
                key={item.id}
                variant="up"
                delay={Math.min(i, 8) * 0.04}
                className={i % 9 === 0 ? "col-span-2 md:col-span-1" : ""}
              >
                <div
                  className="group relative overflow-hidden rounded-sm"
                  onClick={() => setLightbox(i)}
                  data-cursor="view"
                  data-cursor-label="View"
                >
                  <RevealMedia
                    src={item.image}
                    alt={`${item.cat} makeup look by B1touch Artistry`}
                    ratio={i % 9 === 0 ? "4 / 5" : "3 / 4"}
                    parallax={16}
                    className="rounded-sm"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[hsl(20_14%_3%_/_0.85)] via-transparent to-transparent opacity-0 transition-opacity duration-700 ease-expo group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between p-4 opacity-0 transition-all duration-700 ease-expo group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-gold-light">
                      {item.cat}
                    </span>
                    <ZoomIn size={15} className="text-foreground/80" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* In-feed ad */}
          <div className="py-10">
            <LazyAd>
              <FluidAd className="min-h-[120px]" />
            </LazyAd>
          </div>

          <div className="flex flex-col items-center gap-6">
            {count < filtered.length && (
              <Magnetic strength={0.16}>
                <button onClick={() => setCount((c) => c + IMAGES_PER_PAGE)} className="btn btn-outline shine">
                  Load more looks
                  <ArrowUpRight size={13} />
                </button>
              </Magnetic>
            )}
            <p className="eyebrow-muted">
              {filtered.length > 0 ? `${filtered.length} looks in this collection` : "No looks in this collection yet"}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden border-t border-border/60 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_100%,hsl(40_62%_62%_/_0.16),transparent_65%)]" />
        <div className="shell text-center">
          <SplitText as="h2" text="Your look belongs here" className="display-md mx-auto max-w-[20ch]" highlightFrom={3} />
          <Reveal variant="up" delay={0.25} className="mt-9 flex flex-wrap justify-center gap-4">
            <Magnetic strength={0.2}>
              <Link to="/booking" className="btn btn-gold shine">
                Book your session
                <ArrowUpRight size={14} />
              </Link>
            </Magnetic>
            <a
              href="https://instagram.com/b1touchartistry"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <Instagram size={15} />
              More on Instagram
            </a>
          </Reveal>
        </div>
      </section>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            images={lightboxImages}
            captions={filtered.map((item) => item.cat)}
            currentIndex={lightbox}
            onClose={() => setLightbox(null)}
            onNavigate={setLightbox}
            eyebrow={category === "All" ? "Portfolio" : category}
            action={
              <Link to="/booking" className="btn btn-gold btn-sm" onClick={() => setLightbox(null)}>
                Book this look
                <ArrowUpRight size={13} />
              </Link>
            }
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
