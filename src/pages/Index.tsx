import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Camera,
  Crown,
  Quote,
  Sparkles,
  Star,
  ZoomIn,
} from "lucide-react";
import Layout from "@/components/Layout";
import Lightbox from "@/components/Lightbox";
import { InstagramFeed } from "@/components/InstagramFeed";
import { getImages, sourcesFor } from "@/lib/portfolioImages";
import {
  Counter,
  EASE,
  Magnetic,
  Marquee,
  Ornament,
  Parallax,
  Reveal,
  RevealMedia,
  ScrollCue,
  SectionIndex,
  SplitText,
  TiltCard,
} from "@/components/motion/Reveal";
import heroImage from "@/assets/hero-beauty.jpg";

const services = [
  {
    icon: Crown,
    index: "01",
    title: "Bridal",
    subtitle: "Traditional & white wedding",
    desc: "A look engineered for the longest day of your life — humidity-proof, camera-proof, tear-proof.",
    from: "₦225,000",
  },
  {
    icon: Sparkles,
    index: "02",
    title: "Owambe & Events",
    subtitle: "Parties, aso-ebi, celebrations",
    desc: "Sculpted, luminous and impossible to ignore. Built to survive the dancing.",
    from: "₦100,000",
  },
  {
    icon: Camera,
    index: "03",
    title: "Editorial",
    subtitle: "Campaigns, film & content",
    desc: "Colour-true finishes for HD, 4K and studio lighting — continuity handled.",
    from: "₦150,000",
  },
];

const process = [
  {
    step: "I.",
    title: "Consultation",
    copy: "We study your skin, your undertone and your occasion — in the studio or over WhatsApp — before a single brush moves.",
  },
  {
    step: "II.",
    title: "Prep & Prime",
    copy: "Skin is prepped with a barrier-first routine so the finish reads as skin, never as product.",
  },
  {
    step: "III.",
    title: "The Build",
    copy: "Pigment laid in thin, deliberate layers matched to your undertone. Depth without heaviness.",
  },
  {
    step: "IV.",
    title: "Lock & Leave",
    copy: "Set, photographed in studio light, and finished with a touch-up kit and a maintenance plan.",
  },
];

const testimonials = [
  {
    name: "Adaeze N.",
    event: "Bride · Lekki",
    quote: "B1touch made me feel like royalty on my wedding day. My skin looked flawless in every single photo — even at 11pm.",
  },
  {
    name: "Funke A.",
    event: "Birthday Glam",
    quote: "I have never received so many compliments. The makeup survived dancing, tears and Lagos heat.",
  },
  {
    name: "Chidinma O.",
    event: "Owambe",
    quote: "Finally, an artist who truly understands dark skin tones. The match was seamless — pure perfection.",
  },
];

const stats = [
  { value: 500, suffix: "+", label: "Brides served" },
  { value: 8, suffix: " yrs", label: "Behind the brush" },
  { value: 1000, suffix: "+", label: "Clients styled" },
  { value: 4.9, suffix: "★", label: "Average rating", decimals: true },
];

function Hero({ onOpenGallery }: { onOpenGallery: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "16%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-8%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-24 pt-36 sm:pb-28"
    >
      {/* Cinematic backdrop */}
      <motion.div className="absolute inset-0 -z-20" style={{ y: imageY }}>
        <img
          src={heroImage}
          alt="Close-up of flawless luxury glam on deep skin tones"
          {...{ fetchpriority: "high" }}
          decoding="async"
          className="h-[116%] w-full object-cover object-[62%_28%] animate-slow-drift"
        />
      </motion.div>

      {/* Grading layers */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,hsl(20_14%_3.5%_/_0.96)_0%,hsl(20_14%_3.5%_/_0.78)_38%,hsl(20_14%_4%_/_0.22)_70%,hsl(20_14%_4%_/_0.55)_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(0deg,hsl(20_14%_4%)_2%,transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_85%_10%,hsl(40_62%_62%_/_0.22),transparent_58%)]" />
      <div className="grain pointer-events-none absolute inset-0 -z-10" />

      <motion.div className="shell relative" style={{ y: contentY, opacity: fade }}>
        <div className="grid items-end gap-12 lg:grid-cols-[1.35fr_0.65fr]">
          <div>
            <Reveal variant="fade" delay={0.35} duration={1.2}>
              <div className="mb-7 flex flex-wrap items-center gap-4">
                <span className="eyebrow">Lagos · Est. 2017</span>
                <span className="hidden h-px w-16 bg-gold/40 sm:block" />
                <span className="eyebrow-muted">Addo Road · Ajah</span>
              </div>
            </Reveal>

            <SplitText
              as="h1"
              text="Flawless artistry for every shade"
              highlightFrom={3}
              className="display-xl max-w-[15ch] text-foreground"
              delay={0.5}
              stagger={0.075}
            />

            <Reveal variant="up" delay={1.05} className="mt-8 max-w-xl">
              <p className="lede">
                Lagos' premier makeup studio for melanin-rich skin — bridal, owambe and editorial looks
                composed with the discipline of couture and the warmth of home.
              </p>
            </Reveal>

            <Reveal variant="up" delay={1.2} className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.22}>
                <Link to="/booking" className="btn btn-gold shine">
                  Book your session
                  <ArrowUpRight size={14} />
                </Link>
              </Magnetic>
              <button onClick={onOpenGallery} className="btn btn-outline" data-cursor="view" data-cursor-label="View">
                See the work
              </button>
            </Reveal>

            <Reveal variant="fade" delay={1.5} className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-border/60 pt-7">
              {[
                { value: "500+", label: "Brides served" },
                { value: "4.9★", label: "Client rating" },
                { value: "8 yrs", label: "In the industry" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="numeral text-2xl text-gradient-gold sm:text-3xl">{item.value}</div>
                  <div className="eyebrow-muted mt-2">{item.label}</div>
                </div>
              ))}
            </Reveal>
          </div>

          {/* Floating portrait card */}
          <Reveal variant="scale" delay={1.35} className="hidden lg:block">
            <Parallax distance={34}>
              <div className="relative ml-auto w-full max-w-[19rem]">
                <div className="panel spotlight overflow-hidden rounded-sm p-2 animate-float-soft">
                  <RevealMedia
                    src={getImages(1, 40)[0]}
                    alt="Signature B1touch bridal look"
                    ratio="4 / 5"
                    parallax={12}
                    className="rounded-sm"
                  />
                  <div className="flex items-center justify-between px-2 pb-1 pt-3">
                    <span className="eyebrow-muted">Signature look</span>
                    <span className="numeral text-[0.6875rem] text-gold/70">№ 041</span>
                  </div>
                </div>
                <div className="pointer-events-none absolute -bottom-5 -left-5 h-24 w-24 border border-gold/25" />
              </div>
            </Parallax>
          </Reveal>
        </div>
      </motion.div>

      {/* Bottom rail */}
      <div className="shell relative mt-16 flex items-end justify-between gap-8">
        <div className="hidden lg:block">
          <ScrollCue label="Scroll to explore" />
        </div>
        <div className="flex items-center gap-5">
          <span className="eyebrow-muted hidden sm:inline">Studio WhatsApp</span>
          <a
            href="https://wa.me/2348061651126"
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw font-sans text-sm text-foreground/85 transition-colors hover:text-gold-light"
          >
            +234 806 165 1126
          </a>
        </div>
      </div>

      {/* Rotated edge label */}
      <span className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rotate-90 font-sans text-[0.625rem] uppercase tracking-[0.5em] text-muted-foreground/60 xl:block">
        B1touch Artistry
      </span>
    </section>
  );
}

function TickerBand() {
  return (
    <div className="relative border-y border-gold/25 bg-gradient-gold">
      <Marquee
        items={["Bridal", "Owambe", "Editorial", "Film & TV", "Masterclass", "Dark skin specialists"]}
        itemClassName="font-display text-lg uppercase tracking-[0.24em] text-[hsl(20_14%_5%)] sm:text-2xl"
        className="py-3.5"
        separator="✦"
        slow
      />
    </div>
  );
}

function Manifesto() {
  return (
    <section className="section-y relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,hsl(344_34%_24%_/_0.5),transparent_70%)] blur-2xl" />
      <div className="shell grid gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionIndex index="01" label="The Studio" className="mb-8" />
          <SplitText
            as="h2"
            text="Where dark skin meets its perfect canvas"
            highlightFrom={4}
            className="display-lg"
          />
          <Reveal variant="fade" delay={0.3} className="mt-10 hidden lg:block">
            <RevealMedia
              src={getImages(1, 88)[0]}
              alt="Artist at work inside the Ajah studio"
              ratio="4 / 3"
              parallax={26}
              className="rounded-sm"
            />
            <p className="mt-4 font-sans text-xs leading-relaxed text-muted-foreground">
              The studio on Addo Road — where every session begins with light testing.
            </p>
          </Reveal>
        </div>

        <div className="space-y-8">
          <Reveal variant="up">
            <p className="lede max-w-2xl">
              B1touch Artistry was built on a frustration: too many artists working on melanin-rich skin
              without understanding undertone, texture or how pigment behaves under Lagos light. So we
              built a house that does nothing else.
            </p>
          </Reveal>
          <Reveal variant="up" delay={0.1}>
            <p className="max-w-2xl font-sans text-[0.95rem] leading-[1.9] text-muted-foreground">
              Every look starts with skin — its chemistry, its history, its season. From there we compose:
              a bridal finish that reads as polish from across a hall and as skin from 30 centimetres away;
              an editorial finish calibrated for studio strobes and 4K capture.
            </p>
          </Reveal>

          <Reveal variant="up" delay={0.18}>
            <div className="grid gap-px overflow-hidden rounded-sm border border-border/70 bg-border/40 sm:grid-cols-3">
              {[
                { title: "Undertone-first", copy: "Pigment matched to your chemistry, never to a shade chart." },
                { title: "Longevity", copy: "Engineered for 12+ hour events, humidity and dancing." },
                { title: "Camera-tested", copy: "Every finish photographed in studio light before you leave." },
              ].map((item) => (
                <div key={item.title} className="bg-[hsl(22_13%_6%)] p-6">
                  <h3 className="font-display text-lg">{item.title}</h3>
                  <p className="mt-2.5 font-sans text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal variant="up" delay={0.24}>
            <Link
              to="/about"
              className="link-draw inline-flex items-center gap-2 font-sans text-sm uppercase tracking-[0.2em] text-gold-light"
            >
              Read our story <ArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SignatureServices() {
  const images = useMemo(() => getImages(3, 120), []);

  return (
    <section className="section-y relative border-y border-border/60 bg-[hsl(22_13%_5%)]">
      <div className="shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionIndex index="02" label="Signature services" className="mb-7" />
            <SplitText as="h2" text="Artistry for every occasion" className="display-lg max-w-[22ch]" />
          </div>
          <Reveal variant="up" delay={0.2}>
            <Link
              to="/services"
              className="link-draw inline-flex items-center gap-2 font-sans text-sm uppercase tracking-[0.2em] text-gold-light"
            >
              All services & pricing <ArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} variant="up" delay={i * 0.12}>
              <TiltCard className="group flex h-full flex-col rounded-sm">
                <div className="relative overflow-hidden">
                  <RevealMedia
                    src={images[i]}
                    alt={`${service.title} makeup by B1touch Artistry`}
                    ratio="4 / 5"
                    parallax={18}
                    className="rounded-none"
                  />
                  <span className="absolute left-5 top-5 numeral text-sm text-gold-light/90">
                    {service.index}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-700 ease-expo group-hover:translate-y-0 group-hover:opacity-100">
                    <Link to="/booking" className="btn btn-gold btn-sm w-full">
                      Book {service.title}
                    </Link>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <service.icon className="h-5 w-5 text-gold" />
                  <h3 className="mt-5 font-display text-2xl">{service.title}</h3>
                  <p className="eyebrow-muted mt-2">{service.subtitle}</p>
                  <p className="mt-4 flex-1 font-sans text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {service.desc}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
                    <span className="font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                      From
                    </span>
                    <span className="font-display text-lg text-gradient-gold">{service.from}</span>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryPreview({ onOpen }: { onOpen: (index: number) => void }) {
  const images = useMemo(() => getImages(6, 0), []);
  const labels = ["Bridal", "Editorial", "Owambe", "Dark Skin", "Bold", "Soft Glam"];

  return (
    <section className="section-y relative overflow-hidden">
      <div className="shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionIndex index="03" label="Selected work" className="mb-7" />
            <SplitText as="h2" text="The gallery" className="display-lg" />
          </div>
          <Reveal variant="up" delay={0.15}>
            <p className="max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
              Every face tells a story. Tap any look to open it full-screen, then swipe through the set.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid auto-rows-[minmax(0,1fr)] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {images.map((image, i) => {
            const featured = i === 0 || i === 5;
            return (
              <Reveal
                key={image}
                variant="up"
                delay={i * 0.07}
                className={featured ? "col-span-2 row-span-2" : ""}
              >
                <div
                  className="group relative h-full overflow-hidden rounded-sm"
                  onClick={() => onOpen(i)}
                  data-cursor="view"
                  data-cursor-label="View"
                >
                  <RevealMedia
                    src={image}
                    alt={`${labels[i]} makeup look by B1touch Artistry`}
                    ratio={featured ? "1 / 1" : "3 / 4"}
                    parallax={22}
                    className="h-full rounded-sm"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[hsl(20_14%_3%_/_0.85)] via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-95" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
                    <span className="font-display text-lg text-foreground sm:text-xl">{labels[i]}</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-[hsl(20_14%_4%_/_0.5)] text-gold-light opacity-0 transition-all duration-500 ease-expo group-hover:opacity-100">
                      <ZoomIn size={15} />
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal variant="up" className="mt-12 flex justify-center">
          <Magnetic strength={0.2}>
            <Link to="/portfolio" className="btn btn-outline">
              View full portfolio
              <ArrowUpRight size={14} />
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

function Standard() {
  const image = useMemo(() => getImages(1, 64)[0], []);

  return (
    <section className="section-y relative border-y border-border/60 bg-[hsl(22_13%_5%)]">
      <div className="shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionIndex index="04" label="The method" className="mb-7" />
          <SplitText as="h2" text="Four deliberate moves" className="display-lg max-w-[14ch]" />
          <Reveal variant="fade" delay={0.2} className="mt-10">
            <RevealMedia
              src={image}
              alt="Detail of a B1touch finish under studio light"
              ratio="5 / 6"
              parallax={30}
              className="rounded-sm lg:max-w-md"
            />
          </Reveal>
        </div>

        <ol className="divide-y divide-border/70 border-y border-border/70">
          {process.map((item, i) => (
            <Reveal key={item.step} variant="up" delay={i * 0.08}>
              <li className="group grid gap-4 py-9 sm:grid-cols-[4rem_1fr] sm:gap-8">
                <span className="numeral text-xl text-gold/80 transition-colors duration-500 group-hover:text-gold-light">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-display text-2xl text-foreground">{item.title}</h3>
                  <p className="mt-3 max-w-xl font-sans text-sm leading-[1.85] text-muted-foreground">
                    {item.copy}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function StatsBand() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="shell">
        <Ornament className="mx-auto mb-14 max-w-2xl" />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} variant="up" delay={i * 0.08} className="text-center">
              <div className="numeral text-4xl text-gradient-gold sm:text-5xl">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  duration={1800}
                />
              </div>
              <p className="eyebrow-muted mt-4">{stat.label}</p>
            </Reveal>
          ))}
        </div>
        <Ornament className="mx-auto mt-14 max-w-2xl rotate-180" />
      </div>
    </section>
  );
}

function TestimonialsStrip() {
  return (
    <section className="section-y relative border-y border-border/60 bg-[hsl(22_13%_5%)]">
      <div className="shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionIndex index="05" label="Client love" className="mb-7" />
            <SplitText as="h2" text="Words from our queens" className="display-lg" />
          </div>
          <Reveal variant="up" delay={0.15}>
            <Link
              to="/testimonials"
              className="link-draw inline-flex items-center gap-2 font-sans text-sm uppercase tracking-[0.2em] text-gold-light"
            >
              All reviews <ArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} variant="up" delay={i * 0.1}>
              <figure className="panel group flex h-full flex-col rounded-sm p-7">
                <Quote className="h-7 w-7 text-gold/40" />
                <blockquote className="mt-5 flex-1 font-display text-[1.35rem] leading-[1.5] text-foreground/90">
                  {item.quote}
                </blockquote>
                <div className="mt-6 flex gap-1">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} size={13} className="fill-gold text-gold" />
                  ))}
                </div>
                <figcaption className="mt-5 border-t border-border/70 pt-4">
                  <span className="font-display text-lg">{item.name}</span>
                  <span className="eyebrow-muted mt-1.5 block">{item.event}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Finale() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20">
        <img
          src={getImages(1, 200)[0]}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover object-center animate-slow-drift"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,hsl(20_14%_4%_/_0.92),hsl(20_14%_3%_/_0.86))]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_70%_at_50%_120%,hsl(40_62%_62%_/_0.28),transparent_65%)]" />
      <div className="grain pointer-events-none absolute inset-0 -z-10" />

      <div className="shell relative py-28 text-center sm:py-36">
        <Reveal variant="fade">
          <Ornament className="mx-auto mb-8 max-w-sm" />
        </Reveal>
        <SplitText
          as="h2"
          text="Ready to glow?"
          className="display-xl mx-auto text-center"
          highlightFrom={2}
        />
        <Reveal variant="up" delay={0.25}>
          <p className="lede mx-auto mt-7 max-w-xl text-center">
            Sessions are limited each month so every client gets the studio's full attention.
            Reserve your date and we'll handle the rest.
          </p>
        </Reveal>
        <Reveal variant="up" delay={0.35} className="mt-11 flex flex-wrap justify-center gap-4">
          <Magnetic strength={0.22}>
            <Link to="/booking" className="btn btn-gold shine">
              Reserve your session
              <ArrowUpRight size={14} />
            </Link>
          </Magnetic>
          <a
            href="https://wa.me/2348061651126"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Chat on WhatsApp
          </a>
        </Reveal>
        <Reveal variant="fade" delay={0.5}>
          <p className="eyebrow-muted mt-10">Addo Road · Ajah · Lagos · +234 806 165 1126</p>
        </Reveal>
      </div>
    </section>
  );
}

export default function Index() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const galleryImages = useMemo(() => getImages(6, 0), []);

  return (
    <Layout>
      <Hero onOpenGallery={() => setLightboxIndex(0)} />
      <TickerBand />
      <Manifesto />
      <SignatureServices />
      <GalleryPreview onOpen={setLightboxIndex} />
      <Standard />
      <StatsBand />
      <TestimonialsStrip />
      <InstagramFeed />
      <Finale />

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={galleryImages}
            captions={["Bridal", "Editorial", "Owambe", "Dark Skin", "Bold", "Soft Glam"]}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
            eyebrow="Selected work"
            action={
              <Link to="/portfolio" className="btn btn-gold btn-sm" onClick={() => setLightboxIndex(null)}>
                View full portfolio
                <ArrowUpRight size={13} />
              </Link>
            }
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
