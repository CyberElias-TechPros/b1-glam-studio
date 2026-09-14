import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MessageSquarePlus, Quote, Star } from "lucide-react";
import Layout from "@/components/Layout";
import { ReviewModal } from "@/components/ReviewModal";
import { api, Testimonial } from "@/lib/api";
import { getImages } from "@/lib/portfolioImages";
import {
  Counter,
  Magnetic,
  Ornament,
  Reveal,
  RevealMedia,
  SectionIndex,
  SplitText,
} from "@/components/motion/Reveal";

const fallbackTestimonials: Testimonial[] = [
  {
    id: "fb-1",
    name: "Adaeze Nwankwo",
    event_type: "Traditional Wedding",
    rating: 5,
    quote:
      "B1touch made me feel like absolute royalty on my wedding day. My skin looked flawless in every single photo — even the close-ups. I cried tears of joy and my makeup didn't budge.",
    is_featured: 1,
    status: "approved",
    created_at: "2026-02-01",
  },
  {
    id: "fb-2",
    name: "Funke Adeyemi",
    event_type: "30th Birthday",
    rating: 5,
    quote:
      "I've never received so many compliments in my life. The makeup lasted through eight hours of dancing, photos and celebration — everyone kept asking who my MUA was.",
    is_featured: 1,
    status: "approved",
    created_at: "2026-02-05",
  },
  {
    id: "fb-3",
    name: "Chidinma Okafor",
    event_type: "Owambe Guest",
    rating: 5,
    quote:
      "Finally, a makeup artist who truly understands dark skin tones. No ashy foundation, no mismatched tones — just pure perfection. I'm a client for life.",
    is_featured: 1,
    status: "approved",
    created_at: "2026-02-10",
  },
  {
    id: "fb-4",
    name: "Blessing Eze",
    event_type: "White Wedding",
    rating: 5,
    quote:
      "From the trial to the big day, the experience was seamless. She listened to exactly what I wanted and delivered beyond my expectations.",
    is_featured: 0,
    status: "approved",
    created_at: "2026-02-12",
  },
  {
    id: "fb-5",
    name: "Yewande Bakare",
    event_type: "Editorial Photoshoot",
    rating: 5,
    quote:
      "Working with B1touch on my portfolio shoot was incredible. She understood the brief perfectly and created looks that were both editorial and wearable. The photographer was impressed.",
    is_featured: 0,
    status: "approved",
    created_at: "2026-02-14",
  },
  {
    id: "fb-6",
    name: "Amara Chukwu",
    event_type: "Bridal Train",
    rating: 5,
    quote:
      "Our entire bridal train of eight ladies looked stunning. Professional, punctual, and she made each of us feel special despite the tight timeline.",
    is_featured: 0,
    status: "approved",
    created_at: "2026-02-16",
  },
  {
    id: "fb-7",
    name: "Ngozi Obi",
    event_type: "Engagement Party",
    rating: 5,
    quote:
      "The way she matched my foundation to my dark chocolate skin — I was amazed. Most artists struggle with my tone; B1touch nailed it first try.",
    is_featured: 0,
    status: "approved",
    created_at: "2026-02-18",
  },
  {
    id: "fb-8",
    name: "Kemi Afolabi",
    event_type: "Content Creation",
    rating: 5,
    quote:
      "As a content creator I need looks that pop on camera. B1touch delivers every single time — fast, skilled and always bringing fresh ideas.",
    is_featured: 0,
    status: "approved",
    created_at: "2026-02-20",
  },
];

function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? "fill-gold text-gold" : "text-muted-foreground/40"}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Testimonial[]>(fallbackTestimonials);
  const [modalOpen, setModalOpen] = useState(false);
  const heroImage = useMemo(() => getImages(1, 22)[0], []);

  const loadReviews = async () => {
    try {
      const res = await api.testimonials.getApproved();
      if (res.success && res.data && res.data.length > 0) setReviews(res.data);
    } catch {
      /* keep the curated fallback */
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const featured = reviews.find((review) => review.is_featured) || reviews[0];
  const rest = reviews.filter((review) => review.id !== featured?.id);
  const average = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <Layout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden pb-16 pt-36 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_15%_0%,hsl(40_62%_62%_/_0.13),transparent_60%)]" />
        <div className="shell grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <Reveal variant="fade">
              <SectionIndex index="01" label="Testimonials" className="mb-8" />
            </Reveal>
            <SplitText
              as="h1"
              text="Words from our queens"
              highlightFrom={3}
              className="display-lg max-w-[16ch]"
              delay={0.15}
            />
            <Reveal variant="up" delay={0.55}>
              <p className="lede mt-7 max-w-xl">
                Brides, celebrants, creatives and bridal trains across Lagos — in their own words.
              </p>
            </Reveal>
            <Reveal variant="up" delay={0.65} className="mt-9">
              <Magnetic strength={0.2}>
                <button onClick={() => setModalOpen(true)} className="btn btn-gold shine">
                  <MessageSquarePlus size={15} />
                  Share your review
                </button>
              </Magnetic>
            </Reveal>
          </div>

          <Reveal variant="scale" delay={0.35}>
            <div className="panel rounded-sm p-7">
              <div className="flex items-end justify-between">
                <div>
                  <div className="numeral text-5xl text-gradient-gold">
                    <Counter value={Number(average)} />
                  </div>
                  <p className="eyebrow-muted mt-3">Average client rating</p>
                </div>
                <StarRating rating={5} size={15} />
              </div>
              <div className="mt-7 grid grid-cols-2 gap-5 border-t border-border/70 pt-6">
                <div>
                  <div className="numeral text-2xl text-foreground">
                    <Counter value={reviews.length} suffix="+" />
                  </div>
                  <p className="eyebrow-muted mt-2">Verified reviews</p>
                </div>
                <div>
                  <div className="numeral text-2xl text-foreground">
                    <Counter value={1000} suffix="+" />
                  </div>
                  <p className="eyebrow-muted mt-2">Clients styled</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURED QUOTE */}
      {featured && (
        <section className="border-y border-border/60 bg-[hsl(22_13%_5%)] py-20 sm:py-24">
          <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
            <Reveal variant="scale">
              <RevealMedia
                src={heroImage}
                alt="B1touch Artistry client look"
                ratio="4 / 5"
                parallax={22}
                className="rounded-sm lg:max-w-sm"
              />
            </Reveal>
            <Reveal variant="up" delay={0.15}>
              <Quote className="h-9 w-9 text-gold/40" />
              <blockquote className="mt-7 font-display text-[1.6rem] leading-[1.5] text-foreground/92 sm:text-[2rem]">
                {featured.quote}
              </blockquote>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <StarRating rating={featured.rating} size={15} />
                <div>
                  <div className="font-display text-lg">{featured.name}</div>
                  <div className="eyebrow-muted mt-1">{featured.event_type}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* GRID */}
      <section className="section-y">
        <div className="shell">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="display-md max-w-[18ch]">
              Every review, <span className="display-italic text-gradient-gold">unfiltered</span>
            </h2>
            <Reveal variant="up" delay={0.15}>
              <button
                onClick={() => setModalOpen(true)}
                className="link-draw inline-flex items-center gap-2 font-sans text-sm uppercase tracking-[0.2em] text-gold-light"
              >
                Add yours <ArrowUpRight size={14} />
              </button>
            </Reveal>
          </div>

          <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
            {rest.map((review, i) => (
              <Reveal key={review.id} variant="up" delay={Math.min(i, 6) * 0.06} className="break-inside-avoid">
                <figure className="panel rounded-sm p-7">
                  <StarRating rating={review.rating} />
                  <blockquote className="mt-5 font-sans text-sm leading-[1.9] text-muted-foreground">
                    {review.quote}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-border/70 pt-4">
                    <span className="font-display text-lg">{review.name}</span>
                    <span className="eyebrow-muted mt-1.5 block">{review.event_type}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-border/60 py-20 text-center sm:py-24">
        <div className="shell">
          <Reveal variant="fade">
            <Ornament className="mx-auto mb-9 max-w-xs" />
          </Reveal>
          <SplitText as="h2" text="Ready to write your own?" className="display-md mx-auto max-w-[22ch]" highlightFrom={3} />
          <Reveal variant="up" delay={0.25} className="mt-9 flex flex-wrap justify-center gap-4">
            <Magnetic strength={0.2}>
              <Link to="/booking" className="btn btn-gold shine">
                Book your session
                <ArrowUpRight size={14} />
              </Link>
            </Magnetic>
            <Link to="/portfolio" className="btn btn-outline">
              See the work
            </Link>
          </Reveal>
        </div>
      </section>

      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          void loadReviews();
        }}
      />
    </Layout>
  );
}
