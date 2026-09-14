import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Phone,
  Instagram,
  Facebook,
  MapPin,
  Clock,
  Mail,
  ArrowUpRight,
  ArrowUp,
} from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { AutoResponsiveAd, LazyAd } from "./ads";
import { Magnetic, Ornament } from "./motion/Reveal";
import { NewsletterForm } from "./NewsletterForm";
import { useSmoothScroll } from "./motion/SmoothScroll";
import b1Logo from "@/assets/logos/b1_brown_logo.png";

const EASE = [0.16, 1, 0.3, 1] as const;

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/blog", label: "Journal" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
];

const WHATSAPP = "https://wa.me/2348061651126";

const tickerItems = [
  "Now booking the 2026 bridal season",
  "Studio sessions in Ajah, Lagos",
  "Dark skin specialists since 2017",
  "Bridal trials available",
];

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

/* ────────────────────────────────────────────────────────────
   NAVBAR
   ──────────────────────────────────────────────────────────── */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  const { stop, start } = useSmoothScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 40);
    setHidden(latest > 520 && latest > previous && !isOpen);
  });

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      stop();
      document.body.style.overflow = "hidden";
    } else {
      start();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, stop, start]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="fixed inset-x-0 top-0 z-[900]"
      >
        {/* Announcement strip — a slow editorial crawl, never a wrapped line */}
        <div
          className={`overflow-hidden border-b border-gold/10 bg-[hsl(20_14%_3%_/_0.92)] backdrop-blur-md transition-all duration-700 ease-expo ${
            scrolled ? "max-h-0 opacity-0" : "max-h-9 opacity-100"
          }`}
        >
          <div className="shell flex h-9 items-center gap-4 text-[0.625rem] uppercase tracking-[0.28em] text-muted-foreground sm:gap-6">
            <span className="hidden shrink-0 lg:inline">Addo Road · Ajah · Lagos</span>
            <span className="h-3 w-px shrink-0 bg-gold/20" aria-hidden />
            <div className="marquee-mask min-w-0 flex-1 overflow-hidden">
              <div className="marquee-track marquee-track-slow">
                {[...tickerItems, ...tickerItems].map((item, i) => (
                  <span key={`${item}-${i}`} className="flex shrink-0 items-center">
                    <span className="whitespace-nowrap text-gold/80">{item}</span>
                    <span className="mx-4 text-gold/40 sm:mx-6" aria-hidden>
                      ✦
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <span className="h-3 w-px shrink-0 bg-gold/20" aria-hidden />
            <a
              href="tel:+2348061651126"
              className="hidden shrink-0 tabular-nums transition-colors hover:text-gold sm:inline"
            >
              +234 806 165 1126
            </a>
          </div>
        </div>

        {/* Main bar */}
        <div
          className={`relative border-b transition-all duration-700 ease-expo ${
            scrolled
              ? "border-gold/15 bg-[hsl(20_14%_4%_/_0.82)] backdrop-blur-xl shadow-[0_20px_60px_-40px_rgba(0,0,0,0.95)]"
              : "border-transparent bg-transparent"
          }`}
        >
          <div className="shell flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
            {/* Wordmark */}
            <Link to="/" className="group flex items-center gap-3" aria-label="B1touch Artistry home">
              <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-gold/25 bg-[hsl(20_14%_5%)] transition-colors duration-500 group-hover:border-gold/60">
                <img src={b1Logo} alt="" className="h-7 w-7 object-contain" />
                <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_120%,hsl(40_62%_62%_/_0.35),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-[1.35rem] tracking-[0.01em] text-foreground">
                  B1touch
                </span>
                <span className="eyebrow-muted mt-1 text-[0.5rem]">Artistry · Lagos</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
              {navLinks.map((link) => {
                const active = isActive(location.pathname, link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    aria-current={active ? "page" : undefined}
                    className={`link-draw font-sans text-[0.6875rem] uppercase tracking-[0.22em] transition-colors duration-500 ${
                      active ? "text-gold-light" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-all duration-500 hover:border-gold/50 hover:text-gold xl:flex"
                aria-label="Chat on WhatsApp"
              >
                <Phone size={15} />
              </a>

              <Magnetic strength={0.18} className="hidden sm:inline-flex">
                <Link to="/booking" className="btn btn-gold btn-sm shine">
                  Book a session
                  <ArrowUpRight size={13} />
                </Link>
              </Magnetic>

              {/* Mobile toggle */}
              <button
                onClick={() => setIsOpen((v) => !v)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 text-foreground transition-colors duration-500 hover:border-gold/60 lg:hidden"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-[899] flex flex-col justify-between overflow-y-auto bg-[hsl(20_14%_3.5%_/_0.985)] backdrop-blur-2xl lg:hidden"
          >
            <div className="grain pointer-events-none absolute inset-0" />
            <div className="relative px-6 pb-10 pt-28">
              <nav className="flex flex-col" aria-label="Mobile">
                {navLinks.map((link, i) => {
                  const active = isActive(location.pathname, link.to);
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, y: 26 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.7, ease: EASE }}
                      className="border-b border-border/60"
                    >
                      <Link
                        to={link.to}
                        className={`flex items-baseline gap-4 py-4 ${
                          active ? "text-gold-light" : "text-foreground"
                        }`}
                      >
                        <span className="numeral text-[0.6875rem] text-gold/60">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-[2rem] leading-none">{link.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44, duration: 0.7, ease: EASE }}
                className="mt-9 space-y-4"
              >
                <Link to="/booking" className="btn btn-gold w-full">
                  Book a session
                  <ArrowUpRight size={14} />
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm w-full">
                    WhatsApp
                  </a>
                  <Link to="/booking/lookup" className="btn btn-ghost btn-sm w-full">
                    Track booking
                  </Link>
                </div>

                <div className="space-y-2 pt-4 font-sans text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <MapPin size={13} className="text-gold" /> Addo Road, Ajah, Lagos
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={13} className="text-gold" /> Mon – Sat · 9AM – 7PM
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={13} className="text-gold" /> info@b1touchartistry.com
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <a
                    href="https://instagram.com/b1touchartistry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground"
                    aria-label="Instagram"
                  >
                    <Instagram size={15} />
                  </a>
                  <a
                    href="https://facebook.com/b1touchartistry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground"
                    aria-label="Facebook"
                  >
                    <Facebook size={15} />
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ────────────────────────────────────────────────────────────
   FOOTER
   ──────────────────────────────────────────────────────────── */
export function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border/70 bg-[hsl(20_14%_3%)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle,hsl(40_62%_62%_/_0.09),transparent_70%)] blur-2xl" />

      {/* Newsletter */}
      <div className="shell relative border-b border-border/60 py-14 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <Ornament className="mb-6 max-w-xs" />
            <h2 className="display-md">
              Beauty notes, <span className="display-italic text-gradient-gold">monthly</span>
            </h2>
            <p className="lede mt-3 max-w-md text-sm">
              Seasonal edits, bridal timelines and studio openings — no noise, only the good stuff.
            </p>
          </div>
          <div className="lg:justify-self-end">
            <NewsletterForm source="footer" className="max-w-md" />
            <p className="mt-3 font-sans text-[0.6875rem] text-muted-foreground">
              Unsubscribe anytime. We keep your details private.
            </p>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="shell grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img src={b1Logo} alt="" className="h-9 w-9 object-contain" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl">B1touch</span>
              <span className="eyebrow-muted mt-1 text-[0.5rem]">Artistry</span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-muted-foreground">
            Where dark skin meets its perfect canvas. Luxury artistry, engineered for melanin-rich skin.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://instagram.com/b1touchartistry"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-500 hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold"
              aria-label="Instagram"
            >
              <Instagram size={15} />
            </a>
            <a
              href="https://facebook.com/b1touchartistry"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-500 hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold"
              aria-label="Facebook"
            >
              <Facebook size={15} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="eyebrow mb-5">Explore</h3>
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="link-draw font-sans text-sm text-muted-foreground transition-colors hover:text-gold-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-5">Studio</h3>
          <ul className="space-y-3 font-sans text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin size={14} className="mt-0.5 shrink-0 text-gold" />
              Addo Road, Ajah, Lagos, Nigeria
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={14} className="mt-0.5 shrink-0 text-gold" />
              <span>
                Mon – Sat · 9:00 – 19:00
                <br />
                Sunday · by appointment
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={14} className="shrink-0 text-gold" />
              <a href="tel:+2348061651126" className="transition-colors hover:text-gold-light">
                +234 806 165 1126
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={14} className="shrink-0 text-gold" />
              <a href="mailto:info@b1touchartistry.com" className="transition-colors hover:text-gold-light">
                info@b1touchartistry.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-5">Sessions</h3>
          <ul className="space-y-3">
            {["Bridal", "Owambe & Events", "Editorial", "Masterclass"].map((item) => (
              <li key={item}>
                <Link
                  to="/services"
                  className="link-draw font-sans text-sm text-muted-foreground transition-colors hover:text-gold-light"
                >
                  {item}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                to="/booking/lookup"
                className="font-sans text-sm text-gold-light underline decoration-gold/40 underline-offset-4 transition-colors hover:decoration-gold"
              >
                Track your booking
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Wordmark band */}
      <div className="relative select-none overflow-hidden border-t border-border/60">
        <div className="marquee-mask">
          <div className="marquee-track marquee-track-slow py-6">
            {Array.from({ length: 2 }).map((_, block) => (
              <span key={block} className="flex shrink-0 items-center">
                {Array.from({ length: 3 }).map((__, i) => (
                  <span
                    key={i}
                    className="whitespace-nowrap px-6 font-display text-[2.5rem] uppercase tracking-[0.14em] text-foreground/[0.06] sm:text-[4rem]"
                  >
                    B1touch Artistry ✦ Lagos
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="shell flex flex-col items-center justify-between gap-4 border-t border-border/60 py-7 sm:flex-row">
        <p className="font-sans text-[0.6875rem] tracking-[0.12em] text-muted-foreground">
          © {year} B1touch Artistry. All rights reserved.
        </p>
        <div className="flex items-center gap-5 font-sans text-[0.6875rem] tracking-[0.12em] text-muted-foreground">
          <span className="hidden sm:inline">Where dark skin meets its perfect canvas.</span>
          <Link to="/admin" className="link-draw transition-colors hover:text-gold-light">
            Staff portal
          </Link>
          <button
            onClick={() => scrollTo(0, { immediate: false })}
            className="flex items-center gap-1.5 transition-colors hover:text-gold-light"
          >
            Back to top <ArrowUp size={12} />
          </button>
        </div>
      </div>

      <div className="shell border-t border-border/40 py-5 text-center">
        <p className="font-sans text-[0.625rem] tracking-[0.16em] text-muted-foreground/70">
          Crafted by{" "}
          <a
            href="https://cybereliasacademy.com.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/80 transition-colors hover:text-gold"
          >
            Cyber Elias Academy
          </a>
        </p>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────
   FLOATING ACTIONS
   ──────────────────────────────────────────────────────────── */
export function FloatingActions() {
  const { scrollTo } = useSmoothScroll();
  const [showTop, setShowTop] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => setShowTop(latest > 900));

  return (
    <div className="fixed bottom-5 right-4 z-[880] flex flex-col items-end gap-3 sm:bottom-7 sm:right-6">
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="top"
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.9 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={() => scrollTo(0)}
            className="flex h-11 w-11 items-center justify-center rounded-full glass-strong text-gold-light transition-colors duration-500 hover:border-gold/60"
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href="https://instagram.com/b1touchartistry"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.7, ease: EASE }}
        className="group flex h-11 items-center gap-0 overflow-hidden rounded-full glass-strong px-3 text-muted-foreground transition-all duration-700 ease-expo hover:gap-2 hover:px-4 hover:text-gold-light"
        aria-label="Follow B1touch Artistry on Instagram"
      >
        <Instagram size={16} />
        <span className="max-w-0 overflow-hidden whitespace-nowrap font-sans text-[0.6875rem] uppercase tracking-[0.18em] transition-all duration-700 ease-expo group-hover:max-w-[8rem]">
          Follow
        </span>
      </motion.a>

      <Magnetic strength={0.2}>
        <a
          href={`${WHATSAPP}?text=${encodeURIComponent("Hi B1touch, I'd like to book a makeup session.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_18px_45px_-18px_rgba(37,211,102,0.75)] transition-transform duration-500 ease-expo hover:scale-105"
          aria-label="Chat with the studio on WhatsApp"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/25 [animation-duration:2.8s]" />
          <svg viewBox="0 0 24 24" fill="currentColor" className="relative h-7 w-7 text-[hsl(20_14%_4%)]">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </Magnetic>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   ADS
   ──────────────────────────────────────────────────────────── */
export function HeaderAd() {
  return (
    <div className="border-b border-border/60 bg-secondary/40">
      <div className="shell py-2">
        <LazyAd>
          <AutoResponsiveAd className="min-h-[90px]" />
        </LazyAd>
      </div>
    </div>
  );
}

export function FooterAd() {
  return (
    <div className="border-t border-border/60 bg-secondary/30">
      <div className="shell py-4">
        <LazyAd>
          <AutoResponsiveAd className="min-h-[90px]" />
        </LazyAd>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   LAYOUT
   ──────────────────────────────────────────────────────────── */
interface LayoutProps {
  children: React.ReactNode;
  showHeaderAd?: boolean;
  showFooterAd?: boolean;
}

export default function Layout({ children, showHeaderAd = false, showFooterAd = false }: LayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[1000] focus:rounded-sm focus:bg-gold focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-widest focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Navbar />
      {showHeaderAd && <HeaderAd />}
      <main id="main" className="flex-1">
        {children}
      </main>
      {showFooterAd && <FooterAd />}
      <Footer />
      <FloatingActions />
    </div>
  );
}
