import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Instagram as InstagramIcon, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Link } from "react-router-dom";
import { getImages } from "@/lib/portfolioImages";
import { WebPImage } from "@/components/WebPImage";

// Use real images from portfolio folder, randomized
const feedImages = getImages(9, 50);
const captions = [
  "Flawless finish for melanin skin ✨",
  "Bridal glam done right 👰🏾",
  "Soft glam for the weekend",
  "Bold and beautiful 💋",
  "Glow up season is here ✨",
  "Every shade is beautiful",
  "Editorial vibes 🎬",
  "Natural beauty enhanced",
  "When the glow hits different 💫",
];

const instagramPosts = feedImages.map((img, i) => ({
  id: i + 1,
  image: img,
  likes: 1500 + Math.floor(Math.random() * 3000),
  comments: 50 + Math.floor(Math.random() * 250),
  caption: captions[i],
  type: "image" as const,
}));

// ─── Lightbox Component ─────────────────────────────────────────────
function Lightbox({ 
  images, 
  captions, 
  currentIndex, 
  onClose, 
  onNavigate 
}: { 
  images: string[]; 
  captions: string[];
  currentIndex: number; 
  onClose: () => void; 
  onNavigate: (i: number) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Reset zoom and liked state when image changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setLiked(false);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((currentIndex + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.5, 3));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.5, 1));
      if (e.key === "0") { setZoom(1); setPosition({ x: 0, y: 0 }); }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => { 
      document.removeEventListener("keydown", handleKeyDown); 
      document.body.style.overflow = ""; 
    };
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
            alt={captions[currentIndex]} 
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

      {/* Bottom bar with caption */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <p className="text-center text-white/90 text-sm font-sans mb-3">{captions[currentIndex]}</p>
        
        {/* Thumbnail strip */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 justify-center scrollbar-hide">
          {images.map((img, i) => (
            <button 
              key={i} 
              onClick={() => onNavigate(i)} 
              className={`flex-shrink-0 w-14 h-14 rounded-sm overflow-hidden transition-all duration-200 ${i === currentIndex ? "ring-2 ring-primary scale-110" : "opacity-50 hover:opacity-80"}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
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

function InstagramPost({ post, index, onClick }: { post: typeof instagramPosts[0]; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative aspect-square overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Image with zoom effect */}
      <WebPImage
        src={post.image}
        alt={post.caption}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
      />
      
      {/* Gold gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Engagement overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div className="flex items-center gap-2 text-primary-foreground">
          <Heart className="w-6 h-6 fill-primary-foreground" />
          <span className="text-sm font-semibold">{post.likes.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-primary-foreground">
          <MessageCircle className="w-6 h-6 fill-primary-foreground" />
          <span className="text-sm font-semibold">{post.comments}</span>
        </div>
      </motion.div>
      
      {/* Gold border glow on hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/60 rounded-sm transition-all duration-300 shadow-[0_0_20px_rgba(212,168,85,0.3)] group-hover:shadow-[0_0_30px_rgba(212,168,85,0.5)]" />
    </motion.div>
  );
}

function InstagramHeader() {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary p-1">
          <div className="w-full h-full rounded-full bg-gradient-gold flex items-center justify-center">
            <span className="text-2xl font-serif font-bold text-primary-foreground">B1</span>
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#E1306C] rounded-full flex items-center justify-center border-2 border-background">
          <InstagramIcon size={12} className="text-primary-foreground" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-serif font-bold text-foreground">@b1touch_artistry</h3>
        <p className="text-sm text-muted-foreground">Lagos Makeup Artist</p>
        <div className="flex items-center justify-center gap-1 mt-1">
          <a
            href="https://instagram.com/b1touch_artistry"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-gold-light transition-colors"
          >
            b1touch_artistry
          </a>
          <span className="text-muted-foreground">·</span>
          <a
            href="https://instagram.com/b1touch_artistry"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-gold-light transition-colors"
          >
            Reels
          </a>
        </div>
      </div>
    </div>
  );
}

function FollowButton() {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="text-center mt-8"
    >
      <a
        href="https://instagram.com/b1touch_artistry"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-3 text-sm font-sans font-semibold tracking-wide bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all rounded-sm gold-glow"
      >
        <InstagramIcon size={16} />
        Follow on Instagram
      </a>
    </motion.div>
  );
}

export function InstagramFeed() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const navigateLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  // Get all images and captions for lightbox
  const allImages = useMemo(() => instagramPosts.map(post => post.image), []);
  const allCaptions = instagramPosts.map(post => post.caption);

  return (
    <section className="section-padding bg-secondary">
      <div className="container-narrow mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.4em] text-primary mb-4">
            @b1touch_artistry
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4">
            Follow Our <span className="text-gradient-gold">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get inspired by our latest looks, behind-the-scenes moments, and beauty tips.
          </p>
        </motion.div>

        {/* Instagram Profile Header */}
        <InstagramHeader />

        {/* Instagram Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
          {instagramPosts.map((post, index) => (
            <InstagramPost 
              key={post.id} 
              post={post} 
              index={index} 
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <FollowButton />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-sans font-semibold tracking-wide border-2 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all rounded-sm"
            >
              View Full Portfolio
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox 
            images={allImages}
            captions={allCaptions}
            currentIndex={lightboxIndex} 
            onClose={closeLightbox} 
            onNavigate={navigateLightbox} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// Floating Follow Badge Component
export function FloatingInstagramBadge() {
  return (
    <motion.a
      href="https://instagram.com/b1touch_artistry"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 left-6 z-50 hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all"
    >
      <InstagramIcon size={18} />
      <span className="text-sm font-semibold">Follow</span>
    </motion.a>
  );
}
