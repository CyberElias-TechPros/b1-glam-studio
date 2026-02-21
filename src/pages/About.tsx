import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Award, Heart, Users, Palette } from "lucide-react";
import Layout from "@/components/Layout";
import { AnimatedSection, SectionHeading, GoldDivider, StaggerContainer, StaggerItem, ParallaxCard } from "@/components/AnimatedSection";
import { GoldParticles } from "@/components/GoldParticles";
import heroImage from "@/assets/hero-beauty.jpg";

const values = [
  { icon: Palette, title: "Dark Skin Mastery", desc: "We specialize in understanding and enhancing the rich, diverse tones of melanin-rich skin." },
  { icon: Heart, title: "Client-First Approach", desc: "Every session is personalized. We listen, consult, and create looks that reflect your vision." },
  { icon: Award, title: "Premium Products", desc: "We use only top-tier, skin-safe products that deliver long-lasting, camera-ready results." },
  { icon: Users, title: "Community & Growth", desc: "Through masterclasses and mentorship, we're growing the next generation of Nigerian MUAs." },
];

const stats = [
  { value: "500+", label: "Brides Served" },
  { value: "8+", label: "Years Experience" },
  { value: "1000+", label: "Happy Clients" },
  { value: "4.9★", label: "Average Rating" },
];

export default function About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <Layout>
      {/* Hero with Parallax */}
      <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-secondary"
          style={{ y }}
        />
        <GoldParticles count={20} className="opacity-50" />
        
        <div className="relative z-10 container-narrow mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-xs font-sans font-semibold uppercase tracking-[0.4em] text-primary mb-4 block">
                Our Story
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold leading-tight mb-6">
                Where Dark Skin Meets Its{" "}
                <span className="text-gradient-gold">Perfect Canvas</span>
              </h1>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in the vibrant heart of Lagos, B1touch Artistry was born from a simple belief: 
                  every woman deserves to feel extraordinary. Our journey began on Addo Road, Ajah, where 
                  passion for beauty met an unwavering commitment to excellence.
                </p>
                <p>
                  As a makeup artist specializing in dark skin tones, our founder recognized the gap in the 
                  industry — too many artists didn't understand the nuances, the undertones, the magic of 
                  melanin-rich skin. B1touch Artistry was created to change that narrative.
                </p>
                <p>
                  Today, we're proud to be Lagos' go-to destination for brides, celebrities, and everyday 
                  queens who want nothing less than perfection. Every stroke of our brush is a celebration 
                  of African beauty.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[3/4] rounded-sm overflow-hidden">
                <img
                  src={heroImage}
                  alt="B1touch Artistry founder"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 border-2 border-primary/30 rounded-sm" />
              <div className="absolute -top-4 -right-4 w-32 h-32 border-2 border-primary/30 rounded-sm" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-background border-y border-border">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer delay={0.1} staggerDelay={0.1}>
            {stats.map((stat, i) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-serif font-bold text-gradient-gold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs font-sans uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <SectionHeading
            subtitle="Our Philosophy"
            title="What Sets Us Apart"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.1} animation="fade-up">
                <ParallaxCard offset={15}>
                  <div className="flex gap-5 p-6 rounded-sm bg-card border border-border hover:border-primary/30 transition-colors h-full">
                    <v.icon className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-serif font-semibold text-lg mb-2">{v.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                </ParallaxCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* Brand Promise */}
      <section className="section-padding bg-secondary relative overflow-hidden">
        <GoldParticles count={15} className="opacity-30" />
        <div className="container-narrow mx-auto text-center max-w-3xl relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
              Our Promise
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed italic">
              "At B1touch Artistry, we don't just apply makeup — we reveal beauty. Every client 
              who sits in our chair leaves feeling confident, radiant, and utterly themselves. 
              That's not just our job; it's our calling."
            </p>
            <GoldDivider />
            <p className="text-sm text-primary font-sans font-semibold uppercase tracking-widest">
              B1touch Artistry Team
            </p>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
