import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { X, Play, ChevronLeft, ChevronRight, Instagram, ExternalLink, Sparkles, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { AnimatedSection, SectionHeading, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { GoldParticles } from "@/components/GoldParticles";
import { portfolioItems, videoContent, categories, videoCategories, type PortfolioItem, type VideoContent, type PortfolioCategory } from "@/data/portfolio";
import { getImage } from "@/lib/portfolioImages";

// Dialog component (simplified version)
function Dialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] max-w-[90vw] overflow-auto">{children}</div>
    </div>
  );
}

// Before/After Slider Component
function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percentage);
  };

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm">
      {/* Before Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-950 to-stone-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-stone-800 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-stone-500" />
            </div>
            <p className="text-stone-400 font-serif text-lg">Before</p>
          </div>
        </div>
      </div>

      {/* After Image (clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-700">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-amber-600/30 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-amber-400" />
              </div>
              <p className="text-amber-200 font-serif text-lg">After</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        ref={containerRef}
        className="absolute inset-0 cursor-ew-resize"
        onMouseDown={() => isDragging.current = true}
        onMouseMove={(e) => isDragging.current && handleMove(e.clientX)}
        onMouseUp={() => isDragging.current = false}
        onMouseLeave={() => isDragging.current = false}
        onTouchStart={() => isDragging.current = true}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={() => isDragging.current = false}
      >
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
            <ChevronLeft className="w-4 h-4 text-amber-700 absolute left-1" />
            <ChevronRight className="w-4 h-4 text-amber-700 absolute right-1" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded text-xs text-white">Before</div>
      <div className="absolute bottom-4 right-4 bg-amber-600/80 px-3 py-1 rounded text-xs text-white">After</div>
    </div>
  );
}

// Portfolio Card Component
function PortfolioCard({ 
  item, 
  onClick,
  index 
}: { 
  item: PortfolioItem; 
  onClick: () => void;
  index: number;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageSrc = getImage(item.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-sm cursor-pointer"
      onClick={onClick}
    >
      {/* Real Image */}
      <div className="absolute inset-0">
        <img
          src={imageSrc}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20`} />
      </div>

      {/* Video indicator */}
      {item.isVideo && (
        <div className="absolute top-3 right-3 z-20">
          <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
        </div>
      )}

      {/* Featured badge */}
      {item.featured && (
        <div className="absolute top-3 left-3 z-20">
          <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider bg-gradient-gold text-primary-foreground rounded-sm">
            Featured
          </span>
        </div>
      )}

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/20">
          <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
        <span className="text-[10px] font-sans font-semibold uppercase tracking-widest text-primary mb-1">
          {item.category}
        </span>
        <h3 className="text-sm font-serif font-semibold text-white mb-1 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-xs text-white/70 line-clamp-2 mb-3">{item.description}</p>
        
        {/* Book This Look CTA */}
        <Link
          to="/booking"
          className="inline-flex items-center justify-center gap-2 w-full py-2 text-xs font-sans font-semibold uppercase tracking-wider bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all rounded-sm"
          onClick={(e) => e.stopPropagation()}
        >
          Book This Look
        </Link>
      </div>

      {/* Border effect */}
      <div className="absolute inset-0 border border-transparent group-hover:border-primary/50 rounded-sm transition-colors duration-300" />
    </motion.div>
  );
}

// Video Thumbnail Card
function VideoThumbnailCard({ 
  video, 
  onClick,
  index 
}: { 
  video: VideoContent; 
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-sm cursor-pointer aspect-video"
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${video.gradient}`} />
      
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="w-6 h-6 text-white fill-white ml-1" />
        </div>
      </div>

      {/* Duration badge */}
      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs font-medium rounded">
        {video.duration}
      </div>

      {/* Category badge */}
      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 text-white text-xs font-medium rounded">
        {video.category}
      </div>

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <h4 className="text-sm font-semibold text-white line-clamp-1">{video.title}</h4>
        <p className="text-xs text-white/70">{video.views} views</p>
      </div>

      {/* Gold accent border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-sm transition-colors duration-300" />
    </motion.div>
  );
}

// Lightbox Modal
function LightboxModal({ 
  item, 
  onClose 
}: { 
  item: PortfolioItem | null; 
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!item) return null;

  return (
    <Dialog open={!!item} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background rounded-sm max-w-4xl w-full overflow-hidden"
      >
        {/* Image/Video Area */}
        <div className={`relative aspect-[4/3] bg-gradient-to-br ${item.gradient}`}>
          <img
            src={getImage(item.id)}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          {item.isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-sans font-semibold uppercase tracking-widest text-primary">
                {item.category}
              </span>
              <h3 className="text-xl font-serif font-bold text-foreground mt-1">{item.title}</h3>
            </div>
            {item.isVideo && item.duration && (
              <span className="px-3 py-1 bg-secondary text-sm text-muted-foreground rounded-sm">
                {item.duration}
              </span>
            )}
          </div>
          
          <p className="text-muted-foreground mb-6">{item.description}</p>

          <div className="flex gap-3">
            <Link
              to="/booking"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 text-sm font-sans font-semibold uppercase tracking-wider bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all rounded-sm"
              onClick={onClose}
            >
              Book This Look
            </Link>
            {item.instagramUrl && (
              <a
                href={`https://instagram.com/b1touchartistry`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 border border-primary/40 text-primary hover:bg-primary/10 transition-all rounded-sm"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
}

// Video Section Modal
function VideoSectionModal({ 
  video, 
  onClose 
}: { 
  video: VideoContent | null; 
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!video) return null;

  return (
    <Dialog open={!!video} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background rounded-sm max-w-4xl w-full overflow-hidden"
      >
        {/* Video placeholder */}
        <div className={`relative aspect-video bg-gradient-to-br ${video.gradient}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-10 h-10 text-white fill-white ml-1" />
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Duration */}
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 text-white text-sm font-medium rounded">
            {video.duration}
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          <span className="text-xs font-sans font-semibold uppercase tracking-widest text-primary">
            {video.category}
          </span>
          <h3 className="text-xl font-serif font-bold text-foreground mt-1">{video.title}</h3>
          <p className="text-muted-foreground mt-2">{video.views} views</p>

          <div className="flex gap-3 mt-6">
            <a
              href={`https://instagram.com/b1touchartistry`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-primary/40 text-primary hover:bg-primary/10 transition-all rounded-sm"
            >
              <Instagram className="w-4 h-4" />
              Watch on Instagram
            </a>
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | "All">("All");
  const [activeVideoCategory, setActiveVideoCategory] = useState<string>("All");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  // Filter portfolio items
  const filteredItems = activeCategory === "All" 
    ? portfolioItems 
    : portfolioItems.filter((item) => item.category === activeCategory);

  // Filter videos
  const filteredVideos = activeVideoCategory === "All"
    ? videoContent
    : videoContent.filter((video) => video.category === activeVideoCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-secondary relative overflow-hidden">
        <GoldParticles count={20} className="opacity-50" />
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection>
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.4em] text-primary mb-4 block">
              Portfolio
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4">
              The <span className="text-gradient-gold">B1touch</span> Gallery
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Every transformation is a work of art. Browse our portfolio to find your inspiration.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-6 bg-background border-b border-border sticky top-20 z-30 backdrop-blur-md bg-background/95">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-sans font-medium uppercase tracking-wider rounded-sm transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-gold text-primary-foreground"
                    : "text-muted-foreground hover:text-primary border border-border hover:border-primary/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Preview */}
      <section className="py-12 bg-background">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold mb-2">Transformation Preview</h2>
              <p className="text-muted-foreground">Drag the slider to see the B1touch magic</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <BeforeAfterSlider />
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                className="text-sm text-primary hover:underline"
              >
                {showBeforeAfter ? 'Hide' : 'Show'} Before/After Slider
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery Grid - Masonry Style */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4"
            >
              {filteredItems.map((item, index) => (
                <div key={item.id} className="break-inside-avoid">
                  <PortfolioCard 
                    item={item} 
                    onClick={() => setSelectedItem(item)}
                    index={index}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No items found in this category.</p>
            </div>
          )}

          {/* Note */}
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground mb-6">
              Want to see more? Follow us on Instagram for daily transformations.
            </p>
            <a
              href="https://instagram.com/b1touchartistry"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-sans font-medium border border-primary/40 text-primary hover:bg-primary/10 transition-all rounded-sm"
            >
              <Instagram className="w-4 h-4" />
              Follow @b1touchartistry
            </a>
          </div>
        </div>
      </section>

      {/* Video Content Section */}
      <section className="section-padding bg-secondary relative overflow-hidden">
        <GoldParticles count={15} className="opacity-30" />
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-10">
              <span className="text-xs font-sans font-semibold uppercase tracking-[0.4em] text-primary mb-2 block">
                Video Content
              </span>
              <h2 className="text-3xl font-serif font-bold mb-4">
                Transformations & <span className="text-gradient-gold">Tutorials</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Watch full transformations, tutorials, and behind-the-scenes content
              </p>
            </div>

            {/* Video Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {videoCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveVideoCategory(cat)}
                  className={`px-4 py-2 text-xs font-sans font-medium uppercase tracking-wider rounded-sm transition-all ${
                    activeVideoCategory === cat
                      ? "bg-gradient-gold text-primary-foreground"
                      : "text-muted-foreground hover:text-primary border border-border hover:border-primary/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Video Grid */}
            <motion.div 
              key={activeVideoCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredVideos.map((video, index) => (
                <VideoThumbnailCard
                  key={video.id}
                  video={video}
                  onClick={() => setSelectedVideo(video)}
                  index={index}
                />
              ))}
            </motion.div>

            {/* Instagram Reels CTA */}
            <div className="text-center mt-10">
              <a
                href="https://instagram.com/b1touchartistry"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-sans font-medium bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white hover:opacity-90 transition-all rounded-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                Watch More Reels
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Book CTA */}
      <section className="py-16 bg-background relative overflow-hidden">
        <GoldParticles count={10} className="opacity-30" />
        <div className="container-narrow mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-4">Love What You See?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Book a session with B1touch Artistry and let us create your perfect look. 
              Specializing in stunning transformations for all skin tones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-sans font-semibold tracking-wide bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all rounded-sm"
              >
                Book Your Session
              </Link>
              <a
                href="https://instagram.com/b1touchartistry"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-sans font-medium border border-primary/40 text-primary hover:bg-primary/10 transition-all rounded-sm"
              >
                <Instagram className="w-5 h-5" />
                View Instagram
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <LightboxModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>

      {/* Video Section Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoSectionModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}
      </AnimatePresence>
    </Layout>
  );
}
