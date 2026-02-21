import { Link } from "react-router-dom";
import { Check, ArrowRight, Crown, Sparkles, Camera, PartyPopper, GraduationCap, Clapperboard } from "lucide-react";
import Layout from "@/components/Layout";
import { AnimatedSection, SectionHeading, GoldDivider } from "@/components/AnimatedSection";

const services = [
  {
    icon: Crown,
    title: "Bridal Makeup",
    price: "From ₦45,000",
    description: "Your perfect wedding look, designed to last from ceremony to reception. Includes a trial session.",
    features: ["Pre-wedding consultation", "Trial session included", "Long-lasting HD finish", "Touch-up kit provided", "Lash application included"],
    popular: true,
  },
  {
    icon: Sparkles,
    title: "Owambe / Event Glam",
    price: "From ₦20,000",
    description: "Head-turning looks for Lagos parties, aso-ebi celebrations, and special occasions.",
    features: ["Full face glam", "Lash application", "Setting spray finish", "2-hour session", "Group discounts (5+)"],
    popular: false,
  },
  {
    icon: Camera,
    title: "Editorial & Photoshoot",
    price: "From ₦30,000",
    description: "Camera-ready perfection for professional shoots, campaigns, and content creation.",
    features: ["Colour consultation", "HD/4K camera ready", "Half-day or full-day rates", "On-location available", "Multiple look changes"],
    popular: false,
  },
  {
    icon: PartyPopper,
    title: "Birthday Glam",
    price: "From ₦25,000",
    description: "Make your birthday unforgettable with a custom glam look that celebrates you.",
    features: ["Custom birthday look", "Celebrant package", "Guest group rates", "Themed looks available", "Photo-ready finish"],
    popular: false,
  },
  {
    icon: Clapperboard,
    title: "Film & TV Makeup",
    price: "From ₦50,000",
    description: "Professional on-set makeup for Nollywood productions and television appearances.",
    features: ["Continuity expertise", "HD studio lighting ready", "Full-day on-set", "Quick change capability", "Special effects available"],
    popular: false,
  },
  {
    icon: GraduationCap,
    title: "Makeup Masterclass",
    price: "From ₦80,000",
    description: "Learn the art of professional makeup with hands-on training at our Ajah studio.",
    features: ["1-on-1 or group options", "Hands-on practice", "Product knowledge", "Certificate issued", "Starter kit guidance"],
    popular: false,
  },
];

const addons = [
  { name: "Gele Tying", price: "₦5,000" },
  { name: "Skincare Prep Treatment", price: "₦8,000" },
  { name: "Extra Lash Sets", price: "₦3,000" },
  { name: "Home/Location Service", price: "₦10,000+" },
  { name: "Bridal Train (per person)", price: "₦15,000" },
  { name: "Touch-up Artist on Standby", price: "₦20,000" },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <AnimatedSection key={service.title} delay={i * 0.1}>
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
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section-padding bg-secondary">
        <div className="container-narrow mx-auto">
          <SectionHeading
            subtitle="Extras"
            title="Add-On Services"
            description="Enhance your session with these additional services."
          />
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-sm border border-border overflow-hidden">
              {addons.map((addon, i) => (
                <AnimatedSection key={addon.name} delay={i * 0.05}>
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
