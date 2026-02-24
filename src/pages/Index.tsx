import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import { ArrowRight, Star, Sparkles, Crown, Camera, Heart, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import Layout from "@/components/Layout";
import { AnimatedSection, SectionHeading, ParallaxCard, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { ParallaxHero } from "@/components/ParallaxHero";
import { GoldParticles } from "@/components/GoldParticles";
import { InstagramFeed } from "@/components/InstagramFeed";
import { getImages } from "@/lib/portfolioImages";
import { WebPImage } from "@/components/WebPImage";
import heroImage from "@/assets/hero-beauty.jpg";

const services = [
  { icon: Crown, title: "Bridal Glam", desc: "Timeless elegance for your perfect day. Traditional & white wedding looks." },
  { icon: Sparkles, title: "Event & Owambe", desc: "Head-turning glam for every occasion. Aso-ebi, birthdays & parties." },
  { icon: Camera, title: "Editorial & Studio", desc: "Camera-ready perfection for photoshoots, campaigns & content creation." },
];

const portfolioImagesData = getImages(6, 100);
const portfolioItems = [
  { category: "Bridal", gradient: "from-amber-900/60 via-yellow-800/40 to-yellow-700/20", image: portfolioImagesData[0] },
  { category: "Event Glam", gradient: "from-amber-800/60 via-orange-700/40 to-yellow-600/20", image: portfolioImagesData[1] },
  { category: "Editorial", gradient: "from-yellow-900/60 via-amber-800/40 to-orange-700/20", image: portfolioImagesData[2] },
  { category: "Dark Skin", gradient: "from-amber-700/60 via-yellow-600/40 to-orange-500/20", image: portfolioImagesData[3] },
  { category: "Bold Look", gradient: "from-yellow-800/60 via-amber-700/40 to-orange-600/20", image: portfolioImagesData[4] },
  { category: "Soft Glam", gradient: "from-amber-600/60 via-yellow-500/40 to-orange-400/20", image: portfolioImagesData[5] },
];

const testimonials = [
  { name: "Adaeze N.", event: "Bride", quote: "B1touch made me feel like royalty on my wedding day. My skin looked absolutely flawless in every photo!" },
  { name: "Funke A.", event: "Birthday Glam", quote: "I've never received so many compliments! The makeup lasted all night through the dancing and photos." },
  { name: "Chidinma O.", event: "Owambe", quote: "Finally, a makeup artist who truly understands dark skin tones. Pure perfection every single time." },
];

// ─── Lightbox Component ─────────────────────────────────────────────
function Lightbox({ images, currentIndex, onClose, onNavigate }: { images: string[]; currentIndex: number; onClose: () => void; onNavigate: (i: number) => void }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

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
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
      
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <span className="text-sm text-white/70 font-sans">{currentIndex + 1} / {images.length}</span>
        <div className="flex gap-2">
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
          <span className="text-xs font-sans font-semibold uppercase tracking-widest text-primary">{portfolioItems[currentIndex]?.category || "Portfolio"}</span>
          <Link to="/portfolio" onClick={onClose} className="px-5 py-2 text-xs font-sans font-semibold uppercase tracking-wider bg-gradient-gold text-primary-foreground rounded-sm hover:opacity-90 transition-opacity">View Full Portfolio</Link>
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

export default function Index() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Lightbox state
  const [lightbox, setLightbox] = useState<number | null>(null);
  const lightboxImages = useMemo(() => portfolioItems.map((item) => item.image), []);

  return (
    <Layout>
      {/* Hero Section with Parallax */}
      <ParallaxHero backgroundImage={heroImage}>
        <div className="relative z-10 container-narrow mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.4em] text-primary mb-6">
                Premium Makeup Artistry · Lagos
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold leading-[1.1] mb-6"
            >
              Flawless Artistry
              <br />
              <span className="text-gradient-gold">for Every Shade</span>
              <br />
              of Beauty
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed"
            >
              Lagos' premier destination for luxury makeup & dark skin expertise.
              Located in the heart of Ajah.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-sans font-semibold tracking-wide bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all rounded-sm gold-glow"
              >
                Book Your Session
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-sans font-semibold tracking-wide border border-primary/40 text-primary hover:bg-primary/10 transition-all rounded-sm"
              >
                View Portfolio
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-primary to-transparent"
          />
        </motion.div>
      </ParallaxHero>

      {/* Services Preview with Parallax Cards */}
      <section className="section-padding bg-background relative">
        <GoldParticles count={10} className="opacity-50" />
        <div className="container-narrow mx-auto">
          <SectionHeading
            subtitle="What We Do"
            title="Artistry for Every Occasion"
            description="From bridal elegance to bold editorial looks, we craft flawless beauty tailored to your unique skin and style."
          />
          <StaggerContainer delay={0.2} staggerDelay={0.15}>
            {services.map((service, i) => (
              <StaggerItem key={service.title}>
                <ParallaxCard offset={15} className="h-full">
                  <div className="group p-8 rounded-sm bg-card border border-border hover:border-primary/40 transition-all duration-500 h-full">
                    <service.icon className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-serif font-semibold mb-3">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                  </div>
                </ParallaxCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <AnimatedSection delay={0.4}>
            <div className="text-center mt-10">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-sans text-primary hover:text-gold-light transition-colors"
              >
                View All Services & Pricing <ArrowRight size={14} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="section-padding bg-secondary">
        <div className="container-narrow mx-auto">
          <SectionHeading
            subtitle="Our Work"
            title="The B1touch Gallery"
            description="Every face tells a story. See how we bring out the best in every shade of beauty."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {portfolioItems.map((item, i) => (
              <AnimatedSection key={item.category} delay={i * 0.1} animation="fade-up">
                <div 
                  onClick={() => setLightbox(i)}
                  className="group block relative overflow-hidden rounded-sm aspect-[3/4] cursor-pointer"
                >
                  <WebPImage 
                    src={item.image}
                    alt={item.category}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} group-hover:opacity-40 transition-opacity`} />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-sm font-serif text-foreground">{item.category}</span>
                  </div>
                  <div className="absolute inset-0 border border-transparent group-hover:border-primary/30 rounded-sm transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection delay={0.5}>
            <div className="text-center mt-10">
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 text-sm font-sans text-primary hover:text-gold-light transition-colors"
              >
                View Full Portfolio <ArrowRight size={14} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <SectionHeading
            subtitle="Client Love"
            title="Words from Our Queens"
          />
          <StaggerContainer delay={0.2} staggerDelay={0.15}>
            {testimonials.map((t, i) => (
              <StaggerItem key={t.name}>
                <ParallaxCard offset={10}>
                  <div className="p-8 rounded-sm bg-card border border-border h-full flex flex-col">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={14} className="fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic flex-1">"{t.quote}"</p>
                    <div className="mt-6 pt-4 border-t border-border">
                      <p className="font-serif font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-primary">{t.event}</p>
                    </div>
                  </div>
                </ParallaxCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* CTA Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-gold opacity-90" />
        <GoldParticles count={20} className="opacity-30" />
        <div className="relative z-10 container-narrow mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <AnimatedSection>
            <Heart className="w-8 h-8 text-primary-foreground/60 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary-foreground mb-4">
              Ready to Glow?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
              Book your session today and let us create the perfect look for your special moment.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-sans font-semibold tracking-wide bg-primary-foreground text-primary hover:opacity-90 transition-all rounded-sm"
              >
                Book Now <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/2348061651126"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-sans font-semibold tracking-wide border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 transition-all rounded-sm"
              >
                WhatsApp Us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox 
            images={lightboxImages} 
            currentIndex={lightbox} 
            onClose={() => setLightbox(null)} 
            onNavigate={setLightbox} 
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
