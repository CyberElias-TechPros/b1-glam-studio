import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Camera,
  Check,
  Clapperboard,
  Crown,
  GraduationCap,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import Layout from "@/components/Layout";
import { FluidAd, LazyAd } from "@/components/ads";
import { getImages, sourcesFor } from "@/lib/portfolioImages";
import {
  Magnetic,
  Ornament,
  Reveal,
  SectionIndex,
  SplitText,
} from "@/components/motion/Reveal";

const services = [
  {
    icon: Crown,
    title: "Bridal Makeup",
    price: "From ₦225,000",
    deposit: "₦75,000 deposit",
    description:
      "Your wedding-day look, designed to hold from first look to last dance. Includes a full trial session.",
    features: [
      "Pre-wedding consultation",
      "Trial session included",
      "Long-wear HD finish",
      "Touch-up kit provided",
      "Lash application included",
    ],
    popular: true,
  },
  {
    icon: Sparkles,
    title: "Owambe / Event Glam",
    price: "From ₦100,000",
    deposit: "₦40,000 deposit",
    description: "Head-turning looks for Lagos parties, aso-ebi celebrations and special occasions.",
    features: [
      "Full face glam",
      "Lash application",
      "Setting spray finish",
      "2-hour session",
      "Group discounts (5+)",
    ],
    popular: false,
  },
  {
    icon: Camera,
    title: "Editorial & Photoshoot",
    price: "From ₦150,000",
    deposit: "₦60,000 deposit",
    description: "Camera-ready perfection for professional shoots, campaigns and content creation.",
    features: [
      "Colour consultation",
      "HD / 4K camera ready",
      "Half-day or full-day rates",
      "On-location available",
      "Multiple look changes",
    ],
    popular: false,
  },
  {
    icon: PartyPopper,
    title: "Birthday Glam",
    price: "From ₦125,000",
    deposit: "₦50,000 deposit",
    description: "Make it unforgettable with a custom look built around you, your outfit and your venue.",
    features: [
      "Custom birthday look",
      "Celebrant package",
      "Guest group rates",
      "Themed looks available",
      "Photo-ready finish",
    ],
    popular: false,
  },
  {
    icon: Clapperboard,
    title: "Film & TV Makeup",
    price: "From ₦250,000",
    deposit: "₦100,000 deposit",
    description: "Professional on-set artistry for Nollywood productions, series and television appearances.",
    features: [
      "Continuity expertise",
      "HD studio lighting ready",
      "Full-day on-set",
      "Quick change capability",
      "Special effects available",
    ],
    popular: false,
  },
  {
    icon: GraduationCap,
    title: "Makeup Masterclass",
    price: "From ₦400,000",
    deposit: "₦150,000 deposit",
    description: "Learn the craft hands-on at our Ajah studio — one-to-one or in small groups.",
    features: [
      "1-on-1 or group options",
      "Hands-on practice",
      "Product knowledge",
      "Certificate issued",
      "Starter kit guidance",
    ],
    popular: false,
  },
];

const addons = [
  { name: "Gele Tying", price: "₦25,000" },
  { name: "Skincare Prep Treatment", price: "₦40,000" },
  { name: "Extra Lash Sets", price: "₦15,000" },
  { name: "Home / Location Service", price: "₦50,000+" },
  { name: "Bridal Train (per person)", price: "₦75,000" },
  { name: "Touch-up Artist on Standby", price: "₦100,000" },
];

function ServiceRow({
  service,
  index,
  image,
}: {
  service: (typeof services)[number];
  index: number;
  image: string;
}) {
  const [hovered, setHovered] = useState(false);
  const sources = sourcesFor(image);

  return (
    <Reveal variant="up" delay={index * 0.06}>
      <article
        className="group relative border-b border-border/70"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Hover art — desktop only, floats into the right column */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 z-0 hidden h-56 w-72 -translate-y-1/2 overflow-hidden rounded-sm xl:block"
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.94, rotate: hovered ? 0 : -2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <picture>
            {sources.webp && <source srcSet={sources.webp} type="image/webp" />}
            <img src={sources.jpg} alt="" className="h-full w-full object-cover" />
          </picture>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,hsl(20_14%_4%_/_0.7))]" />
        </motion.div>

        <div className="relative z-10 grid gap-6 py-10 lg:grid-cols-[3rem_1.1fr_1.4fr_auto] lg:items-start lg:gap-10">
          <span className="numeral text-sm text-gold/70">
            {String(index + 1).padStart(2, "0")}
          </span>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <service.icon className="h-5 w-5 text-gold" />
              <h3 className="font-display text-2xl transition-colors duration-500 group-hover:text-gold-light sm:text-3xl">
                {service.title}
              </h3>
              {service.popular && (
                <span className="rounded-sm border border-gold/40 px-2.5 py-1 font-sans text-[0.5625rem] uppercase tracking-[0.2em] text-gold-light">
                  Most booked
                </span>
              )}
            </div>
            <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
              {service.description}
            </p>
            <div className="mt-6 flex flex-wrap items-baseline gap-4">
              <span className="font-display text-xl text-gradient-gold">{service.price}</span>
              <span className="eyebrow-muted">{service.deposit}</span>
            </div>
          </div>

          <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:max-w-sm">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 font-sans text-[0.8125rem] text-muted-foreground">
                <Check size={14} className="mt-0.5 shrink-0 text-gold" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="lg:pt-1">
            <Link to="/booking" className="btn btn-outline btn-sm shine">
              Book this
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Services() {
  const images = useMemo(() => getImages(6, 130), []);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden pb-16 pt-36 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(65%_60%_at_80%_0%,hsl(40_62%_62%_/_0.13),transparent_60%)]" />
        <div className="shell">
          <Reveal variant="fade">
            <SectionIndex index="01" label="Services & pricing" className="mb-8" />
          </Reveal>
          <SplitText
            as="h1"
            text="Invest in your best look"
            highlightFrom={2}
            className="display-lg max-w-[18ch]"
            delay={0.15}
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <Reveal variant="up" delay={0.5}>
              <p className="lede max-w-xl">
                Transparent pricing for premium artistry. Every service opens with a consultation so the
                look is tailored before the first brush moves.
              </p>
            </Reveal>
            <Reveal variant="up" delay={0.6} className="lg:justify-self-end">
              <div className="flex flex-wrap gap-4">
                <Magnetic strength={0.2}>
                  <Link to="/booking" className="btn btn-gold shine">
                    Reserve a date
                    <ArrowUpRight size={14} />
                  </Link>
                </Magnetic>
                <a
                  href="https://wa.me/2348061651126?text=Hi%20B1touch%2C%20I%20need%20help%20choosing%20a%20service."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  Ask a question
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SERVICE MENU */}
      <section className="pb-8 pt-6">
        <div className="shell">
          <div className="border-t border-border/70">
            {services.map((service, i) => (
              <div key={service.title}>
                <ServiceRow service={service} index={i} image={images[i]} />
                {(i + 1) % 3 === 0 && i !== services.length - 1 && (
                  <div className="py-8">
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

      {/* ADD-ONS */}
      <section className="section-y border-y border-border/60 bg-[hsl(22_13%_5%)]">
        <div className="shell grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionIndex index="02" label="Enhancements" className="mb-7" />
            <SplitText as="h2" text="Add-ons" className="display-lg max-w-[12ch]" />
            <Reveal variant="up" delay={0.2}>
              <p className="mt-6 max-w-sm font-sans text-sm leading-[1.9] text-muted-foreground">
                Layer these onto any session. Combine three or more and we'll adjust the total at
                checkout — just mention it when you book.
              </p>
            </Reveal>
            <Reveal variant="fade" delay={0.3} className="mt-8">
              <Ornament className="max-w-xs" />
            </Reveal>
          </div>

          <div>
            <ul className="divide-y divide-border/70 border-y border-border/70">
              {addons.map((addon, i) => (
                <Reveal key={addon.name} variant="up" delay={i * 0.05}>
                  <li className="group flex items-center justify-between gap-6 py-5 transition-colors duration-500">
                    <span className="font-sans text-[0.9375rem] text-foreground/90 transition-colors duration-500 group-hover:text-gold-light">
                      {addon.name}
                    </span>
                    <span className="font-display text-lg text-gradient-gold">{addon.price}</span>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal variant="up" delay={0.2} className="mt-9">
              <div className="panel flex flex-col gap-4 rounded-sm p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-xl">Group & bridal train pricing</h3>
                  <p className="mt-2 max-w-md font-sans text-sm text-muted-foreground">
                    Five or more faces? We'll build a custom schedule and rate for your party.
                  </p>
                </div>
                <a
                  href="https://wa.me/2348061651126?text=Hi%20B1touch%2C%20I%27d%20like%20a%20group%20quote."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold btn-sm shrink-0"
                >
                  Get a quote
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center sm:py-28">
        <div className="shell">
          <SplitText as="h2" text="Not sure which service fits?" className="display-md mx-auto max-w-[22ch]" />
          <Reveal variant="up" delay={0.25}>
            <p className="lede mx-auto mt-6 max-w-lg text-center">
              Send us your date, venue and outfit. We'll recommend the right package and hold your slot.
            </p>
          </Reveal>
          <Reveal variant="up" delay={0.35} className="mt-10 flex flex-wrap justify-center gap-4">
            <Magnetic strength={0.2}>
              <Link to="/booking" className="btn btn-gold shine">
                Start a booking
                <ArrowUpRight size={14} />
              </Link>
            </Magnetic>
            <Link to="/contact" className="btn btn-outline">
              Contact the studio
            </Link>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
