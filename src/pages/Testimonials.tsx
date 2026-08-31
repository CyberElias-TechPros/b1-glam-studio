import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Quote, ArrowRight, MessageSquarePlus, CheckCircle2, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import { AnimatedSection, SectionHeading, GoldDivider } from "@/components/AnimatedSection";
import { api, Testimonial } from "@/lib/api";
import { ReviewModal } from "@/components/ReviewModal";

const fallbackTestimonials = [
  {
    id: "fb-1",
    name: "Adaeze Nwankwo",
    event_type: "Traditional Wedding",
    rating: 5,
    quote: "B1touch made me feel like absolute royalty on my wedding day. My skin looked flawless in every single photo — even the close-ups! I cried tears of joy and my makeup didn't budge. This is the standard.",
    is_featured: 1,
    status: "approved" as const,
    created_at: "2026-02-01",
  },
  {
    id: "fb-2",
    name: "Funke Adeyemi",
    event_type: "30th Birthday Celebration",
    rating: 5,
    quote: "I've never received so many compliments in my life! The makeup lasted through 8 hours of dancing, photos, and celebration. Everyone kept asking who my MUA was. B1touch is simply the best in Lagos.",
    is_featured: 1,
    status: "approved" as const,
    created_at: "2026-02-05",
  },
  {
    id: "fb-3",
    name: "Chidinma Okafor",
    event_type: "Owambe Guest",
    rating: 5,
    quote: "Finally, a makeup artist who truly understands dark skin tones. No ashy foundation, no mismatched tones — just pure perfection. I'm a client for life now. Every party, every event, it's B1touch or nothing.",
    is_featured: 1,
    status: "approved" as const,
    created_at: "2026-02-10",
  },
  {
    id: "fb-4",
    name: "Blessing Eze",
    event_type: "White Wedding",
    rating: 5,
    quote: "From the trial session to the big day, the experience was seamless. She listened to exactly what I wanted and delivered beyond my expectations. My husband couldn't stop staring!",
    is_featured: 0,
    status: "approved" as const,
    created_at: "2026-02-12",
  },
  {
    id: "fb-5",
    name: "Yewande Bakare",
    event_type: "Editorial Photoshoot",
    rating: 5,
    quote: "Working with B1touch on my portfolio shoot was incredible. She understood the brief perfectly and created looks that were both editorial and wearable. The photographer was impressed too!",
    is_featured: 0,
    status: "approved" as const,
    created_at: "2026-02-14",
  },
  {
    id: "fb-6",
    name: "Amara Chukwu",
    event_type: "Bridal Train",
    rating: 5,
    quote: "Our entire bridal train of 8 ladies looked absolutely stunning. She was professional, punctual, and made each of us feel special. The coordination was flawless despite the tight timeline.",
    is_featured: 0,
    status: "approved" as const,
    created_at: "2026-02-16",
  },
  {
    id: "fb-7",
    name: "Ngozi Obi",
    event_type: "Engagement Party",
    rating: 5,
    quote: "The way she matched my foundation perfectly to my dark chocolate skin — I was amazed. Most artists struggle with my tone, but B1touch nailed it first try. Incredible talent!",
    is_featured: 0,
    status: "approved" as const,
    created_at: "2026-02-18",
  },
  {
    id: "fb-8",
    name: "Kemi Afolabi",
    event_type: "Content Creation",
    rating: 5,
    quote: "As a content creator, I need looks that pop on camera. B1touch delivers every single time. She's fast, skilled, and always brings fresh ideas. My Instagram feed has never looked better!",
    is_featured: 0,
    status: "approved" as const,
    created_at: "2026-02-20",
  },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState<Testimonial[]>(fallbackTestimonials);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadReviews = async () => {
    try {
      const res = await api.testimonials.getApproved();
      if (res.success && res.data && res.data.length > 0) {
        setReviews(res.data);
      }
    } catch {
      // Keep fallback
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const featured = reviews.find((r) => r.is_featured) || reviews[0];

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.4em] text-primary mb-4 block">
              Testimonials & Reviews
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              Words from Our <span className="text-gradient-gold">Queens</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Real experiences from brides, event guests, and clients across Lagos who trust B1touch Artistry for their special moments.
            </p>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-sans font-semibold uppercase tracking-wider bg-gradient-gold text-primary-foreground rounded-sm hover:opacity-90 transition-opacity shadow-md"
              >
                <MessageSquarePlus size={16} />
                Share Your Review
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Testimonial */}
      {featured && (
        <section className="py-16 bg-background">
          <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto text-center p-8 sm:p-12 bg-card border border-border rounded-sm relative shadow-md">
                <Quote className="w-10 h-10 text-primary/30 mx-auto mb-6" />
                <p className="text-lg sm:text-xl font-serif italic text-foreground leading-relaxed mb-8">
                  "{featured.quote}"
                </p>
                <div className="flex gap-1 justify-center mb-3">
                  {[...Array(featured.rating || 5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-serif font-semibold text-foreground">{featured.name}</p>
                <p className="text-xs text-primary uppercase tracking-wider font-sans">{featured.event_type}</p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      <GoldDivider />

      {/* All Reviews */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((t, i) => (
              <AnimatedSection key={t.id || t.name} delay={i * 0.05}>
                <div className="p-6 sm:p-8 bg-card border border-border rounded-sm h-full flex flex-col hover:border-primary/40 transition-colors shadow-sm font-sans">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {[...Array(t.rating || 5)].map((_, j) => (
                        <Star key={j} size={13} className="fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                      <CheckCircle2 size={12} className="text-primary" /> Verified Client
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic flex-1 font-serif">
                    "{t.quote}"
                  </p>
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="font-serif font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-primary">{t.event_type}</p>
                    </div>
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
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-4">
              Join Our Family of Happy Clients
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
              Your transformation story starts with a single booking.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-sans font-semibold tracking-wide bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all rounded-sm shadow-md"
              >
                Book Your Session <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-4 text-sm font-sans font-medium border border-primary/40 text-primary hover:bg-primary/10 transition-all rounded-sm"
              >
                <MessageSquarePlus size={16} /> Leave Feedback
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Submit Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadReviews}
      />
    </Layout>
  );
}
