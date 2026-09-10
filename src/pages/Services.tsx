import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Check, ArrowRight, Crown, Sparkles, Camera, PartyPopper, GraduationCap, Clapperboard } from "lucide-react";
import Layout from "@/components/Layout";
import { AnimatedSection, SectionHeading, GoldDivider, StaggerContainer, StaggerItem, ParallaxCard } from "@/components/AnimatedSection";
import { GoldParticles } from "@/components/GoldParticles";
import { FluidAd, LazyAd } from "@/components/ads";

const services = [
  {
    icon: Crown,
    title: "Bridal Makeup",
    price: "From ₦225,000",
    description: "Your perfect wedding look, designed to last from ceremony to reception. Includes a trial session.",
    features: ["Pre-wedding consultation", "Trial session included", "Long-lasting HD finish", "Touch-up kit provided", "Lash application included"],
    popular: true,
  },
  {
    icon: Sparkles,
    title: "Owambe / Event Glam",
    price: "From ₦100,000",
    description: "Head-turning looks for Lagos parties, aso-ebi celebrations, and special occasions.",
    features: ["Full face glam", "Lash application", "Setting spray finish", "2-hour session", "Group discounts (5+)"],
    popular: false,
  },
  {
    icon: Camera,
    title: "Editorial & Photoshoot",
    price: "From ₦150,000",
    description: "Camera-ready perfection for professional shoots, campaigns, and content creation.",
    features: ["Colour consultation", "HD/4K camera ready", "Half-day or full-day rates", "On-location available", "Multiple look changes"],
    popular: false,
  },
  {
    icon: PartyPopper,
    title: "Birthday Glam",
    price: "From ₦125,000",
    description: "Make your birthday unforgettable with a custom glam look that celebrates you.",
    features: ["Custom birthday look", "Celebrant package", "Guest group rates", "Themed looks available", "Photo-ready finish"],
    popular: false,
  },
  {
    icon: Clapperboard,
    title: "Film & TV Makeup",
    price: "From ₦250,000",
    description: "Professional on-set makeup for Nollywood productions and television appearances.",
    features: ["Continuity expertise", "HD studio lighting ready", "Full-day on-set", "Quick change capability", "Special effects available"],
    popular: false,
  },
  {
    icon: GraduationCap,
    title: "Makeup Masterclass",
    price: "From ₦400,000",
    description: "Learn the art of professional makeup with hands-on training at our Ajah studio.",
    features: ["1-on-1 or group options", "Hands-on practice", "Product knowledge", "Certificate issued", "Starter kit guidance"],
    popular: false,
  },
];

const addons = [
  { name: "Gele Tying", price: "₦25,000" },
  { name: "Skincare Prep Treatment", price: "₦40,000" },
  { name: "Extra Lash Sets", price: "₦15,000" },
  { name: "Home/Location Service", price: "₦50,000+" },
  { name: "Bridal Train (per person)", price: "₦75,000" },
  { name: "Touch-up Artist on Standby", price: "₦100,000" },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div
        className={`relative p-8 rounded-sm border h-full flex flex-col transition-all duration-300 hover:border-primary/40 ${
          service.popular
            ? "bg-card border-primary/30 gold-glow"
            : "bg-card border-border"
        }`}
      >
        {service.popular && (
          <div className="absolute -top-3 left-8 px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-wider bg-gradient-gold text-primary-foreground rounded-sm">
            Most Popular
          </div>
        )}
        <service.icon className="w-7 h-7 text-primary mb-4" />
        <h3 className="text-xl font-serif font-semibold mb-1">{service.title}</h3>
        <div className="text-lg font-sans font-bold text-primary mb-3">{service.price}</div>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
        <ul className="space-y-2 mb-8 flex-1">
          {service.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check size={14} className="text-primary mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <Link
          to="/booking"
          className={`block text-center py-3 text-sm font-sans font-semibold tracking-wide rounded-sm transition-all ${
            service.popular
              ? "bg-gradient-gold text-primary-foreground hover:opacity-90"
              : "border border-primary/40 text-primary hover:bg-primary/10"
          }`}
        >
          Book This Service
        </Link>
      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary relative overflow-hidden">
        <GoldParticles count={15} className="opacity-50" />
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection>
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.4em] text-primary mb-4 block">
              Services & Pricing
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              Invest in Your <span className="text-gradient-gold">Best Look</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Transparent pricing for premium artistry. Every service includes a consultation 
              to ensure your look is perfectly tailored.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div key={service.title} className="contents">
                <ServiceCard service={service} index={i} />
                {/* Insert fluid ad after every 3 services */}
                {(i + 1) % 3 === 0 && i !== services.length - 1 && (
                  <div key={`ad-${i}`} className="md:col-span-2 lg:col-span-3 my-4">
                    <LazyAd>
                      <FluidAd className="min-h-[120px]" />
                    </LazyAd>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section-padding bg-secondary relative overflow-hidden">
        <GoldParticles count={10} className="opacity-30" />
        <div className="container-narrow mx-auto relative z-10">
          <SectionHeading
            subtitle="Extras"
            title="Add-On Services"
            description="Enhance your session with these additional services."
          />
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-sm border border-border overflow-hidden">
              {addons.map((addon, i) => (
                <AnimatedSection key={addon.name} delay={i * 0.05} animation="slide-left">
                  <div className={`flex items-center justify-between p-4 ${i !== addons.length - 1 ? "border-b border-border" : ""}`}>
                    <span className="text-sm text-foreground">{addon.name}</span>
                    <span className="text-sm font-semibold text-primary">{addon.price}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container-narrow mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-serif font-bold mb-4">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Send us a message on WhatsApp and we'll help you choose the perfect package.
            </p>
            <a
              href="https://wa.me/2348061651126?text=Hi%20B1touch%2C%20I%20need%20help%20choosing%20a%20service."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-sans font-semibold tracking-wide bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all rounded-sm"
            >
              Chat With Us <ArrowRight size={16} />
            </a>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
