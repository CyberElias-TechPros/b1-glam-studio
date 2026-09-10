import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ChevronLeft, ChevronRight, Instagram, 
  Sparkles, ZoomIn, Heart, ZoomOut
} from "lucide-react";
import Layout from "@/components/Layout";
import { AnimatedSection, SectionHeading } from "@/components/AnimatedSection";
import { GoldParticles } from "@/components/GoldParticles";
import { shuffledImages, getImages } from "@/lib/portfolioImages";
import { FluidAd, LazyAd } from "@/components/ads";
import { WebPImage } from "@/components/WebPImage";

const IMAGES_PER_PAGE = 24;
const CAROUSEL_COUNT = 8;

const CATEGORIES = ["All", "Bridal", "Owambe / Events", "Editorial", "Dark Skin", "Bold / Afrocentric", "Soft Glam"] as const;
type GalleryCategory = (typeof CATEGORIES)[number];

function getCategoryForIndex(index: number): GalleryCategory {
  const cats: GalleryCategory[] = ["Bridal", "Owambe / Events", "Editorial", "Dark Skin", "Bold / Afrocentric", "Soft Glam"];
  return cats[(index * 7 + 3) % cats.length];
}

// ─── Featured Carousel ────────────────────────────────────
function FeaturedCarousel() {
  const [current, setCurrent] = useState(0);
  const featuredImages = useMemo(() => getImages(CAROUSEL_COUNT, 0), []);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % CAROUSEL_COUNT), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + CAROUSEL_COUNT) % CAROUSEL_COUNT), []);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, 4000);
    return () => clearInterval(intervalRef.current);
  }, [paused, next]);

  const manual = (fn: () => void) => { setPaused(true); fn(); setTimeout(() => setPaused(false), 8000); };

  const captions = ["Traditional Bridal Glam", "Owambe Queen", "Editorial Perfection", "Melanin Magic", "Soft Glow Beauty", "Bold Afrocentric", "Luxury Bridal", "Dark Skin Radiance"];

  return (
    <div className="relative w-full overflow-hidden rounded-sm group bg-secondary" style={{ height: 600 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current} 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full"
        >
          <WebPImage 
            src={featuredImages[current]}
            alt={captions[current]}
            loading="eager"
            className="w-full h-full object-contain object-center"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-6 left-6 z-10">
        <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-primary mb-1 block">Featured Look</span>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">{captions[current]}</h3>
      </div>
      <button onClick={() => manual(prev)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"><ChevronLeft className="w-5 h-5" /></button>
      <button onClick={() => manual(next)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"><ChevronRight className="w-5 h-5" /></button>
      <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
        {featuredImages.map((_, i) => (
          <button key={i} onClick={() => manual(() => setCurrent(i))}
            className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-primary" : "w-1.5 bg-white/50 hover:bg-white/70"}`} />
        ))}
      </div>
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────
function Lightbox({ images, currentIndex, onClose, onNavigate }: { images: string[]; currentIndex: number; onClose: () => void; onNavigate: (i: number) => void }) {
  const [liked, setLiked] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom when image changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((currentIndex + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.5, 3));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.5, 1));
      if (e.key === "0") { setZoom(1); setPosition({ x: 0, y: 0 }); }
    };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [currentIndex, images.length, onClose, onNavigate]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1) return;
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (zoom > 1) return;
    const deltaX = e.changedTouches[0].clientX - dragStart.current.x;
    const threshold = 50;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      } else {
        onNavigate((currentIndex + 1) % images.length);
      }
    }
  };

  // Mouse drag for zoomed images
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleZoom = () => {
    if (zoom === 1) {
      setZoom(2);
    } else {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-50 flex items-center justify-center"
      ref={containerRef}
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
      
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <span className="text-sm text-white/70 font-sans">{currentIndex + 1} / {images.length}</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setLiked(!liked)} 
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart className={`w-5 h-5 transition-colors ${liked ? "text-red-500 fill-red-500" : "text-white"}`} />
          </button>
          <button 
            onClick={toggleZoom}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label={zoom > 1 ? "Zoom out" : "Zoom in"}
          >
            {zoom > 1 ? <ZoomOut className="w-5 h-5 text-white" /> : <ZoomIn className="w-5 h-5 text-white" />}
          </button>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Main image */}
      <div 
        className="relative z-10 flex items-center justify-center w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentIndex} 
            src={images[currentIndex]} 
            alt="" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-sm transition-transform duration-200"
            draggable={false}
          />
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <button 
        onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)} 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/25 transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button 
        onClick={() => onNavigate((currentIndex + 1) % images.length)} 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/25 transition-colors"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-sans font-semibold uppercase tracking-widest text-primary">{getCategoryForIndex(currentIndex)}</span>
          <Link to="/booking" onClick={onClose} className="px-5 py-2 text-xs font-sans font-semibold uppercase tracking-wider bg-gradient-gold text-primary-foreground rounded-sm hover:opacity-90 transition-opacity">Book This Look</Link>
        </div>
        
        {/* Thumbnail strip */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 justify-center scrollbar-hide">
          {images.slice(Math.max(0, currentIndex - 4), Math.min(images.length, currentIndex + 5)).map((img, i) => {
            const ri = Math.max(0, currentIndex - 4) + i;
            return (
              <button 
                key={ri} 
                onClick={() => onNavigate(ri)} 
                className={`flex-shrink-0 w-14 h-14 rounded-sm overflow-hidden transition-all duration-200 ${ri === currentIndex ? "ring-2 ring-primary scale-110" : "opacity-50 hover:opacity-80"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>

        {/* Zoom indicator */}
        {zoom > 1 && (
          <div className="text-center mt-2">
            <span className="text-xs text-white/50">{Math.round(zoom * 100)}% • Press 0 to reset</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function Portfolio() {
  const [category, setCategory] = useState<GalleryCategory>("All");
  const [count, setCount] = useState(IMAGES_PER_PAGE);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const all = useMemo(() => shuffledImages.map((img, i) => ({ img, cat: getCategoryForIndex(i), i })), []);
  const filtered = useMemo(() => category === "All" ? all : all.filter((x) => x.cat === category), [category, all]);
  const visible = filtered.slice(0, count);

  useEffect(() => setCount(IMAGES_PER_PAGE), [category]);

  // Get image URLs for lightbox
  const lbImages = useMemo(() => filtered.map((x) => x.img), [filtered]);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-secondary relative overflow-hidden">
        <GoldParticles count={20} className="opacity-50" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.4em] text-primary mb-4 block">Portfolio</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4">The <span className="text-gradient-gold">B1touch</span> Gallery</h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">Over {shuffledImages.length} transformations showcasing the art of flawless beauty.</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Carousel */}
      <section className="py-10 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading subtitle="Featured" title="Spotlight Looks" description="Our most stunning transformations, hand-picked for you" />
          <FeaturedCarousel />
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 bg-background border-b border-border sticky top-20 z-30 backdrop-blur-md bg-background/95">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 text-[10px] sm:text-xs font-sans font-medium uppercase tracking-wider rounded-sm transition-all ${category === c ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground hover:text-primary border border-border hover:border-primary/40"}`}>
                {c}{c !== "All" && <span className="ml-1 text-[9px] opacity-70">({all.filter((x) => x.cat === c).length})</span>}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">Showing {Math.min(count, filtered.length)} of {filtered.length} looks</p>
        </div>
      </section>

      {/* Gallery Grid — using explicit height, no aspect-ratio tricks */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {visible.map((item, idx) => (
              <div key={item.i} className="contents">
                <div onClick={() => setLightbox(idx)}
                  className="group relative overflow-hidden rounded-sm cursor-pointer bg-secondary h-[280px] sm:h-[320px] lg:h-[360px]">
                  <WebPImage 
                    src={item.img}
                    alt={`B1touch look ${item.i + 1}`}
                    loading="lazy"
                    className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-widest text-primary">{item.cat}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <ZoomIn className="w-4 h-4 text-white/80" />
                      <span className="text-xs text-white/80">View</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-transparent group-hover:border-primary/40 rounded-sm transition-colors duration-300 pointer-events-none" />
                </div>
                {/* Insert fluid ad after every 8 images (2 rows) */}
                {(idx + 1) % 8 === 0 && idx !== visible.length - 1 && (
                  <div key={`ad-${idx}`} className="col-span-2 sm:col-span-3 lg:col-span-4 py-4">
                    <LazyAd>
                      <FluidAd className="min-h-[100px]" />
                    </LazyAd>
                  </div>
                )}
              </div>
            ))}
          </div>

          {count < filtered.length && (
            <div className="text-center mt-10">
              <button onClick={() => setCount((c) => c + IMAGES_PER_PAGE)}
                className="inline-flex items-center gap-2 px-8 py-3 text-sm font-sans font-semibold uppercase tracking-wider border-2 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all rounded-sm">
                <Sparkles className="w-4 h-4" />Load More ({filtered.length - count} remaining)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary relative overflow-hidden">
        <GoldParticles count={12} className="opacity-30" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-4">Love What You See?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Book a session with B1touch Artistry and let us create your perfect look.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking" className="inline-flex items-center gap-2 px-8 py-4 text-sm font-sans font-semibold tracking-wide bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all rounded-sm">Book Your Session</Link>
              <a href="https://instagram.com/b1touch_artistry" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 text-sm font-sans font-medium border border-primary/40 text-primary hover:bg-primary/10 transition-all rounded-sm">
                <Instagram className="w-5 h-5" />Follow @b1touch_artistry
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && <Lightbox images={lbImages} currentIndex={lightbox} onClose={() => setLightbox(null)} onNavigate={setLightbox} />}
      </AnimatePresence>
    </Layout>
  );
}
