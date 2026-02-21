import { Link } from "react-router-dom";
import { Star, Quote, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { AnimatedSection, SectionHeading, GoldDivider } from "@/components/AnimatedSection";

const testimonials = [
  {
    name: "Adaeze Nwankwo",
    event: "Traditional Wedding",
    rating: 5,
    quote: "B1touch made me feel like absolute royalty on my wedding day. My skin looked flawless in every single photo — even the close-ups! I cried tears of joy and my makeup didn't budge. This is the standard.",
  },
  {
    name: "Funke Adeyemi",
    event: "30th Birthday Celebration",
    rating: 5,
    quote: "I've never received so many compliments in my life! The makeup lasted through 8 hours of dancing, photos, and celebration. Everyone kept asking who my MUA was. B1touch is simply the best in Lagos.",
  },
  {
    name: "Chidinma Okafor",
    event: "Owambe Guest",
    rating: 5,
    quote: "Finally, a makeup artist who truly understands dark skin tones. No ashy foundation, no mismatched tones — just pure perfection. I'm a client for life now. Every party, every event, it's B1touch or nothing.",
  },
  {
    name: "Blessing Eze",
    event: "White Wedding",
    rating: 5,
    quote: "From the trial session to the big day, the experience was seamless. She listened to exactly what I wanted and delivered beyond my expectations. My husband couldn't stop staring!",
  },
  {
    name: "Yewande Bakare",
    event: "Editorial Photoshoot",
    rating: 5,
    quote: "Working with B1touch on my portfolio shoot was incredible. She understood the brief perfectly and created looks that were both editorial and wearable. The photographer was impressed too!",
  },
  {
    name: "Amara Chukwu",
    event: "Bridal Train",
    rating: 5,
    quote: "Our entire bridal train of 8 ladies looked absolutely stunning. She was professional, punctual, and made each of us feel special. The coordination was flawless despite the tight timeline.",
  },
  {
    name: "Ngozi Obi",
    event: "Engagement Party",
    rating: 5,
    quote: "The way she matched my foundation perfectly to my dark chocolate skin — I was amazed. Most artists struggle with my tone, but B1touch nailed it first try. Incredible talent!",
  },
  {
    name: "Kemi Afolabi",
    event: "Content Creation",
    rating: 5,
    quote: "As a content creator, I need looks that pop on camera. B1touch delivers every single time. She's fast, skilled, and always brings fresh ideas. My Instagram feed has never looked better!",
  },
];

export default function Testimonials() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.4em] text-primary mb-4 block">
              Testimonials
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              Words from Our <span className="text-gradient-gold">Queens</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Don't take our word for it — hear from the hundreds of women who've experienced the B1touch magic.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Testimonial */}
      <section className="py-16 bg-background">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center p-8 sm:p-12 bg-card border border-border rounded-sm relative">
              <Quote className="w-10 h-10 text-primary/30 mx-auto mb-6" />
              <p className="text-lg sm:text-xl font-serif italic text-foreground leading-relaxed mb-8">
                "B1touch Artistry didn't just do my makeup — they gave me confidence I didn't know I had. 
                Walking into my wedding reception, I felt like the most beautiful woman in the world. 
                That feeling is priceless."
              </p>
              <div className="flex gap-1 justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="font-serif font-semibold text-foreground">Adaeze Nwankwo</p>
              <p className="text-xs text-primary uppercase tracking-wider">Traditional Wedding Bride</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <GoldDivider />

      {/* All Reviews */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.08}>
                <div className="p-6 sm:p-8 bg-card border border-border rounded-sm h-full flex flex-col hover:border-primary/30 transition-colors">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={12} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic flex-1">
                    "{t.quote}"
                  </p>
                  <div className="mt-6 pt-4 border-t border-border">
                    <p className="font-serif font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-primary">{t.event}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary">
        <div className="container-narrow mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-serif font-bold mb-4">
              Join Our Family of Happy Clients
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Your transformation story starts with a single booking.
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-sans font-semibold tracking-wide bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all rounded-sm"
            >
              Book Your Session <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
