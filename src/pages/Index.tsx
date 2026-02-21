import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Sparkles, Crown, Camera, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import { AnimatedSection, SectionHeading, GoldDivider } from "@/components/AnimatedSection";
import heroImage from "@/assets/hero-beauty.jpg";

const services = [
  { icon: Crown, title: "Bridal Glam", desc: "Timeless elegance for your perfect day. Traditional & white wedding looks." },
  { icon: Sparkles, title: "Event & Owambe", desc: "Head-turning glam for every occasion. Aso-ebi, birthdays & parties." },
  { icon: Camera, title: "Editorial & Studio", desc: "Camera-ready perfection for photoshoots, campaigns & content creation." },
];

const portfolioItems = [
  { category: "Bridal", gradient: "from-amber-900/40 to-yellow-900/20" },
  { category: "Event Glam", gradient: "from-rose-900/40 to-amber-900/20" },
  { category: "Editorial", gradient: "from-violet-900/40 to-amber-900/20" },
  { category: "Dark Skin", gradient: "from-orange-900/40 to-yellow-900/20" },
  { category: "Bold Look", gradient: "from-red-900/40 to-amber-900/20" },
  { category: "Soft Glam", gradient: "from-pink-900/40 to-amber-900/20" },
];

const testimonials = [
  { name: "Adaeze N.", event: "Bride", quote: "B1touch made me feel like royalty on my wedding day. My skin looked absolutely flawless in every photo!" },
  { name: "Funke A.", event: "Birthday Glam", quote: "I've never received so many compliments! The makeup lasted all night through the dancing and photos." },
  { name: "Chidinma O.", event: "Owambe", quote: "Finally, a makeup artist who truly understands dark skin tones. Pure perfection every single time." },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="B1touch Artistry - Professional makeup artistry"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>

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
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <SectionHeading
            subtitle="What We Do"
            title="Artistry for Every Occasion"
            description="From bridal elegance to bold editorial looks, we craft flawless beauty tailored to your unique skin and style."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <AnimatedSection key={service.title} delay={i * 0.15}>
                <div className="group p-8 rounded-sm bg-card border border-border hover:border-primary/40 transition-all duration-500 h-full">
                  <service.icon className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-serif font-semibold mb-3">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
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
              <AnimatedSection key={item.category} delay={i * 0.1}>
                <Link to="/portfolio" className="group block relative overflow-hidden rounded-sm aspect-[3/4]">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} group-hover:opacity-60 transition-opacity`} />
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-background/10 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent">
                    <span className="text-sm font-serif text-foreground">{item.category}</span>
                  </div>
                  <div className="absolute inset-0 border border-transparent group-hover:border-primary/30 rounded-sm transition-colors" />
                </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.15}>
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
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-gold opacity-90" />
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
    </Layout>
  );
}
