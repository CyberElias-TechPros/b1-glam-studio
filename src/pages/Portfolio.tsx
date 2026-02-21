import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { AnimatedSection, SectionHeading } from "@/components/AnimatedSection";

const categories = ["All", "Bridal", "Owambe", "Editorial", "Dark Skin", "Bold", "Soft Glam"];

const portfolioItems = [
  { id: 1, category: "Bridal", title: "Traditional Bridal Glam", desc: "Flawless bridal look with golden highlights", gradient: "from-amber-800/50 to-yellow-900/30" },
  { id: 2, category: "Owambe", title: "Aso-Ebi Queen", desc: "Bold owambe party look with dramatic lashes", gradient: "from-rose-800/50 to-amber-900/30" },
  { id: 3, category: "Editorial", title: "Studio Editorial", desc: "High-fashion editorial for magazine shoot", gradient: "from-violet-800/50 to-amber-900/30" },
  { id: 4, category: "Dark Skin", title: "Melanin Magic", desc: "Celebrating deep skin tones with warm golds", gradient: "from-orange-800/50 to-amber-900/30" },
  { id: 5, category: "Bold", title: "Bold & Beautiful", desc: "Vibrant colours and dramatic contouring", gradient: "from-red-800/50 to-amber-900/30" },
  { id: 6, category: "Soft Glam", title: "Soft Glow", desc: "Natural, dewy finish for everyday elegance", gradient: "from-pink-800/50 to-amber-900/30" },
  { id: 7, category: "Bridal", title: "White Wedding Belle", desc: "Classic white wedding look with soft eyes", gradient: "from-amber-700/50 to-rose-900/30" },
  { id: 8, category: "Dark Skin", title: "Rich Chocolate Glow", desc: "Deep skin radiance with bronze tones", gradient: "from-yellow-800/50 to-orange-900/30" },
  { id: 9, category: "Owambe", title: "Party Ready", desc: "Long-lasting glam for all-night celebrations", gradient: "from-fuchsia-800/50 to-amber-900/30" },
  { id: 10, category: "Editorial", title: "Cover Ready", desc: "Bold editorial look with statement lips", gradient: "from-indigo-800/50 to-amber-900/30" },
  { id: 11, category: "Bold", title: "Afrocentric Bold", desc: "Cultural fusion with contemporary artistry", gradient: "from-emerald-800/50 to-amber-900/30" },
  { id: 12, category: "Soft Glam", title: "Birthday Glow", desc: "Luminous birthday celebration look", gradient: "from-pink-700/50 to-rose-900/30" },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.4em] text-primary mb-4 block">
              Portfolio
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              The <span className="text-gradient-gold">B1touch</span> Gallery
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every transformation is a work of art. Browse our portfolio to find your inspiration.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-background border-b border-border sticky top-20 z-30 backdrop-blur-md bg-background/95">
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

      {/* Gallery Grid */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative overflow-hidden rounded-sm aspect-[3/4] cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
                  <div className="absolute inset-0 bg-background/10 group-hover:bg-background/0 transition-all duration-500" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[10px] uppercase tracking-widest text-primary mb-1">{item.category}</span>
                    <h3 className="text-sm font-serif font-semibold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                  
                  <div className="absolute inset-0 border border-transparent group-hover:border-primary/30 rounded-sm transition-colors duration-300" />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

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
              Follow @b1touchartistry
            </a>
          </div>
        </div>
      </section>

      {/* Book CTA */}
      <section className="py-16 bg-secondary">
        <div className="container-narrow mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-serif font-bold mb-4">Love What You See?</h2>
            <p className="text-muted-foreground mb-6">Book a session and let's create your perfect look.</p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-sans font-semibold tracking-wide bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all rounded-sm"
            >
              Book Your Session
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
