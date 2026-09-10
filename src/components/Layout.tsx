import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Instagram, Facebook, MapPin, Clock, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingInstagramBadge } from "./InstagramFeed";
import { AutoResponsiveAd, LazyAd } from "./ads";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/blog", label: "Blog" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-serif font-bold tracking-wide text-gradient-gold">
              B1touch
            </span>
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary transition-colors">
              Artistry
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-sans tracking-wide transition-colors duration-300 hover:text-primary ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/booking"
              className="px-6 py-2.5 text-sm font-sans font-medium tracking-wide bg-gradient-gold text-primary-foreground hover:opacity-90 transition-opacity rounded-sm"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background/98 backdrop-blur-md border-b border-border overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block text-lg font-serif transition-colors ${
                    location.pathname === link.to
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/booking"
                className="block w-full text-center px-6 py-3 text-sm font-sans font-medium tracking-wide bg-gradient-gold text-primary-foreground rounded-sm mt-4"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container-narrow mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-serif font-bold text-gradient-gold">B1touch</span>
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-muted-foreground ml-2">Artistry</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Lagos' premier destination for luxury makeup artistry, specializing in flawless looks for dark skin tones.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-sans font-semibold uppercase tracking-wider text-primary mb-4">Quick Links</h4>
            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/booking" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Book a Session
              </Link>
              <Link to="/booking/lookup" className="block text-sm text-primary font-medium hover:underline">
                Track Booking Status
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-sans font-semibold uppercase tracking-wider text-primary mb-4">Contact</h4>
            <div className="space-y-3">
              <a href="tel:+2348061651126" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone size={14} />
                +234 806 165 1126
              </a>
              <a href="https://wa.me/2348061651126" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone size={14} />
                WhatsApp
              </a>
              <a href="mailto:info@b1touchartistry.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail size={14} />
                info@b1touchartistry.com
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                Addo Road, Ajah, Lagos, Nigeria
              </div>
            </div>
          </div>

          {/* Hours & Social */}
          <div>
            <h4 className="text-sm font-sans font-semibold uppercase tracking-wider text-primary mb-4">Studio Hours</h4>
            <div className="space-y-2 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Clock size={14} />
                Mon – Sat: 9AM – 7PM
              </div>
              <div className="pl-[22px]">Sunday: By Appointment</div>
            </div>
            <h4 className="text-sm font-sans font-semibold uppercase tracking-wider text-primary mb-3">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/b1touchartistry"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com/b1touchartistry"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} B1touch Artistry. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Where Dark Skin Meets Its Perfect Canvas.</span>
            <span>·</span>
            <Link to="/admin" className="hover:text-primary transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>

        {/* Credit */}
        <div className="mt-6 pt-4 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            Made by{" "}
            <a
              href="https://cybereliasacademy.com.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors duration-300 font-medium"
            >
              Cyber Elias Academy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/2348061651126?text=Hi%20B1touch%2C%20I'd%20like%20to%20book%20a%20makeup%20session."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-primary-foreground">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  showHeaderAd?: boolean;
  showFooterAd?: boolean;
}

export function HeaderAd() {
  return (
    <div className="bg-secondary/50 border-b border-border">
      <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <LazyAd>
          <AutoResponsiveAd className="min-h-[90px]" />
        </LazyAd>
      </div>
    </div>
  );
}

export function FooterAd() {
  return (
    <div className="bg-secondary/30 border-t border-border">
      <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <LazyAd>
          <AutoResponsiveAd className="min-h-[90px]" />
        </LazyAd>
      </div>
    </div>
  );
}

export default function Layout({ children, showHeaderAd = false, showFooterAd = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {showHeaderAd && <HeaderAd />}
      <main className="flex-1">{children}</main>
      {showFooterAd && <FooterAd />}
      <Footer />
      <WhatsAppButton />
      <FloatingInstagramBadge />
    </div>
  );
}
