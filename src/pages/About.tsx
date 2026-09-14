import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Award, Heart, Palette, Users } from "lucide-react";
import Layout from "@/components/Layout";
import { getImages } from "@/lib/portfolioImages";
import {
  Counter,
  Magnetic,
  Ornament,
  Parallax,
  Reveal,
  RevealMedia,
  SectionIndex,
  SplitText,
} from "@/components/motion/Reveal";
import heroImage from "@/assets/hero-beauty.jpg";

const values = [
  {
    icon: Palette,
    title: "Dark skin mastery",
    desc: "Undertone, texture and pigment behaviour on melanin-rich skin — the entire practice is built around it.",
  },
  {
    icon: Heart,
    title: "Client first, always",
    desc: "Every session opens with a consultation. Your vision leads; our technique serves it.",
  },
  {
    icon: Award,
    title: "Premium kit",
    desc: "Professional-grade, skin-safe products — MAC, Fenty, Charlotte Tilbury, Black Opal and more.",
  },
  {
    icon: Users,
    title: "Community & growth",
    desc: "Through masterclasses and mentorship we're raising the next generation of Nigerian artists.",
  },
];

const stats = [
  { value: 500, suffix: "+", label: "Brides served" },
  { value: 8, suffix: "", label: "Years of artistry" },
  { value: 1000, suffix: "+", label: "Clients styled" },
  { value: 4.9, suffix: "★", label: "Average rating" },
];

const milestones = [
  { year: "2017", title: "The first chair", copy: "B1touch opens in Ajah with one kit and a stubborn belief in dark-skin artistry." },
  { year: "2019", title: "Bridal season", copy: "Word of mouth turns the studio into a bridal destination across Lagos." },
  { year: "2022", title: "Editorial work", copy: "Campaigns, film and beauty editorials bring the house aesthetic to screens." },
  { year: "2024", title: "The Academy", copy: "Masterclasses begin — passing the technique on to a new generation." },
];

export default function About() {
  const portrait = heroImage;
  const editorial = useMemo(() => getImages(4, 30), []);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden pb-20 pt-36 sm:pt-40 lg:pb-28">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_15%_10%,hsl(40_62%_62%_/_0.12),transparent_60%)]" />
        <div className="shell grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <Reveal variant="fade">
              <SectionIndex index="01" label="Our story" className="mb-8" />
            </Reveal>
            <SplitText
              as="h1"
              text="Where dark skin meets its perfect canvas"
              highlightFrom={4}
              className="display-lg max-w-[16ch]"
              delay={0.15}
            />
            <Reveal variant="up" delay={0.7} className="mt-8 max-w-xl space-y-5">
              <p className="lede">
                Founded in the vibrant heart of Lagos, B1touch Artistry was born from a simple belief:
                every woman deserves to feel extraordinary.
              </p>
              <p className="font-sans text-[0.9375rem] leading-[1.9] text-muted-foreground">
                Our journey began on Addo Road, Ajah — where a passion for beauty met an unwavering
                commitment to excellence. Too many artists didn't understand the nuances, the undertones,
                the magic of melanin-rich skin. B1touch was created to change that narrative.
              </p>
            </Reveal>
            <Reveal variant="up" delay={0.85} className="mt-10">
              <Magnetic strength={0.2}>
                <Link to="/booking" className="btn btn-gold shine">
                  Book a consultation
                  <ArrowUpRight size={14} />
                </Link>
              </Magnetic>
            </Reveal>
          </div>

          <Reveal variant="scale" delay={0.35}>
            <div className="relative">
              <Parallax distance={26}>
                <RevealMedia
                  src={portrait}
                  alt="B1touch Artistry signature glam on deep skin tones"
                  ratio="4 / 5"
                  parallax={22}
                  eager
                  className="rounded-sm"
                />
              </Parallax>
              <div className="pointer-events-none absolute -bottom-5 -left-5 h-28 w-28 border border-gold/30" />
              <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 border border-gold/20" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <span className="eyebrow">Est. 2017</span>
                <span className="eyebrow-muted">Ajah · Lagos</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border/60 bg-[hsl(22_13%_5%)] py-16">
        <div className="shell grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} variant="up" delay={i * 0.08} className="text-center">
              <div className="numeral text-4xl text-gradient-gold sm:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="eyebrow-muted mt-4">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="section-y">
        <div className="shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionIndex index="02" label="Philosophy" className="mb-7" />
              <SplitText as="h2" text="What sets the house apart" className="display-lg max-w-[20ch]" />
            </div>
            <Reveal variant="up" delay={0.15}>
              <p className="max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
                Four commitments that shape every appointment, every look and every photograph.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 divide-y divide-border/70 border-y border-border/70">
            {values.map((value, i) => (
              <Reveal key={value.title} variant="up" delay={i * 0.07}>
                <div className="group grid gap-5 py-8 transition-colors duration-500 sm:grid-cols-[3.5rem_1fr_1.4fr] sm:items-start sm:gap-10">
                  <span className="numeral text-sm text-gold/70">0{i + 1}</span>
                  <div className="flex items-center gap-3">
                    <value.icon className="h-5 w-5 shrink-0 text-gold" />
                    <h3 className="font-display text-2xl transition-colors duration-500 group-hover:text-gold-light">
                      {value.title}
                    </h3>
                  </div>
                  <p className="font-sans text-sm leading-[1.85] text-muted-foreground">{value.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE + IMAGE */}
      <section className="section-y border-y border-border/60 bg-[hsl(22_13%_5%)]">
        <div className="shell grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div>
            <SectionIndex index="03" label="Milestones" className="mb-8" />
            <h2 className="display-md max-w-[18ch]">
              Eight years, one obsession: <span className="display-italic text-gradient-gold">skin</span>
            </h2>
            <ol className="mt-12 space-y-10">
              {milestones.map((item, i) => (
                <Reveal key={item.year} variant="up" delay={i * 0.08}>
                  <li className="relative border-l border-border/70 pl-8">
                    <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-gold" />
                    <div className="flex items-baseline gap-4">
                      <span className="numeral text-lg text-gold-light">{item.year}</span>
                      <h3 className="font-display text-xl">{item.title}</h3>
                    </div>
                    <p className="mt-2.5 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                      {item.copy}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-2 gap-3 self-start sm:gap-4">
            {editorial.map((image, i) => (
              <Reveal key={image} variant="up" delay={i * 0.1} className={i % 3 === 0 ? "col-span-2" : ""}>
                <RevealMedia
                  src={image}
                  alt="B1touch Artistry editorial look"
                  ratio={i % 3 === 0 ? "16 / 10" : "1 / 1"}
                  parallax={16}
                  className="rounded-sm"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROMISE */}
      <section className="relative isolate overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-20">
          <img
            src={getImages(1, 150)[0]}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover animate-slow-drift"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,hsl(20_14%_4%_/_0.94),hsl(20_14%_3%_/_0.9))]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_100%,hsl(40_62%_62%_/_0.2),transparent_65%)]" />
        <div className="grain pointer-events-none absolute inset-0 -z-10" />

        <div className="shell-tight relative text-center">
          <Reveal variant="fade">
            <Ornament className="mx-auto mb-9 max-w-xs" />
          </Reveal>
          <SplitText
            as="h2"
            text="We don't just apply makeup — we reveal beauty"
            highlightFrom={6}
            className="display-md mx-auto max-w-[26ch]"
          />
          <Reveal variant="up" delay={0.35}>
            <p className="lede mx-auto mt-8 max-w-xl text-center">
              Every client who sits in our chair leaves feeling confident, radiant and utterly themselves.
              That isn't just our job — it's our calling.
            </p>
          </Reveal>
          <Reveal variant="fade" delay={0.5}>
            <p className="eyebrow mt-10">The B1touch Artistry team</p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 py-20 sm:py-24">
        <div className="shell flex flex-col items-center gap-7 text-center">
          <SplitText as="h2" text="Come sit in the chair" className="display-md" highlightFrom={3} />
          <Reveal variant="up" delay={0.2} className="flex flex-wrap justify-center gap-4">
            <Magnetic strength={0.2}>
              <Link to="/booking" className="btn btn-gold shine">
                Reserve a session
                <ArrowUpRight size={14} />
              </Link>
            </Magnetic>
            <Link to="/portfolio" className="btn btn-outline">
              Browse the portfolio
            </Link>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
