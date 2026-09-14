import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Facebook,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  Send,
} from "lucide-react";
import Layout from "@/components/Layout";
import { InstagramFeed } from "@/components/InstagramFeed";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Magnetic, Ornament, Reveal, SectionIndex, SplitText } from "@/components/motion/Reveal";

const MAP_EMBED =
  "https://www.google.com/maps?q=Addo%20Road%2C%20Ajah%2C%20Lagos%2C%20Nigeria&output=embed";

const faqs = [
  {
    q: "Do you provide lashes?",
    a: "Yes — lash application is included with every makeup service. We keep a range of premium lash styles and match them to your eye shape.",
  },
  {
    q: "How long does a session take?",
    a: "A standard glam session takes 1.5–2 hours. Bridal makeup including the trial runs about 2.5–3 hours on the day.",
  },
  {
    q: "Do you offer home service?",
    a: "We travel across Lagos — Lekki, VI, Ikoyi, Ikeja and Ajah — for a ₦50,000+ location fee. Ideal for brides and groups.",
  },
  {
    q: "What products do you use?",
    a: "MAC, Fenty Beauty, Charlotte Tilbury, Black Opal and other professional-grade lines formulated and tested for melanin-rich skin.",
  },
  {
    q: "How far ahead should I book for a wedding?",
    a: "Two to three months ahead for bridal, especially in peak season (November – February). We hold dates with a deposit.",
  },
  {
    q: "Do you offer group discounts?",
    a: "Groups of five or more — bridal trains, aso-ebi parties — receive tailored group pricing. Message us for a quote.",
  },
];

const channels = [
  {
    icon: Phone,
    label: "WhatsApp / Phone",
    value: "+234 806 165 1126",
    href: "https://wa.me/2348061651126",
    note: "Fastest response — usually within the hour",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@b1touchartistry.com",
    href: "mailto:info@b1touchartistry.com",
    note: "Best for briefs, invoices and masterclass enquiries",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "Addo Road, Ajah, Lagos",
    href: "https://www.google.com/maps?q=Addo+Road,+Ajah,+Lagos",
    note: "Street parking available · arrive 10 minutes early",
  },
  {
    icon: Clock,
    label: "Studio hours",
    value: "Mon – Sat · 9AM – 7PM",
    href: null,
    note: "Sundays by appointment only",
  },
];

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const update = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim() || !form.message.trim()) {
      toast({
        title: "Please fill in the required fields",
        description: "Your name and message are needed before we can reply.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.contact.send({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim() || "Website contact form",
        message: form.message.trim(),
      });

      if (res.success) {
        setSent(true);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        toast({
          title: "Message sent",
          description: "Thank you — the studio replies within 24 hours.",
        });
      } else {
        toast({
          title: "Message not sent",
          description: res.error || "Please try again, or reach us on WhatsApp.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: error instanceof Error ? error.message : "Please try again or WhatsApp us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden pb-14 pt-36 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_80%_0%,hsl(40_62%_62%_/_0.13),transparent_60%)]" />
        <div className="shell">
          <Reveal variant="fade">
            <SectionIndex index="01" label="Contact" className="mb-8" />
          </Reveal>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <SplitText as="h1" text="Let's talk glam" highlightFrom={2} className="display-lg max-w-[16ch]" delay={0.15} />
            <Reveal variant="up" delay={0.5}>
              <p className="lede max-w-lg">
                Bridal enquiries, masterclass registration, editorial briefs or a simple question — the
                studio answers every message personally.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CHANNELS */}
      <section className="pb-6">
        <div className="shell grid gap-px overflow-hidden rounded-sm border border-border/70 bg-border/40 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel, i) => {
            const Inner = (
              <>
                <channel.icon className="h-5 w-5 text-gold" />
                <span className="eyebrow-muted mt-5 block">{channel.label}</span>
                <span className="mt-2 block font-display text-lg text-foreground">{channel.value}</span>
                <span className="mt-3 block font-sans text-xs leading-relaxed text-muted-foreground">
                  {channel.note}
                </span>
              </>
            );
            return (
              <Reveal key={channel.label} variant="up" delay={i * 0.06}>
                {channel.href ? (
                  <a
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group block h-full bg-[hsl(22_13%_6%)] p-7 transition-colors duration-500 hover:bg-[hsl(24_13%_8%)]"
                  >
                    {Inner}
                  </a>
                ) : (
                  <div className="h-full bg-[hsl(22_13%_6%)] p-7">{Inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FORM + MAP */}
      <section className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal variant="up">
            <div className="panel rounded-sm p-7 sm:p-9">
              <h2 className="display-md">Send a message</h2>
              <p className="mt-3 font-sans text-sm text-muted-foreground">
                Tell us the date, the venue and the look you have in mind.
              </p>

              <AnimatePresence>
                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 flex items-start gap-3 rounded-sm border border-gold/30 bg-gold/[0.07] p-4"
                  >
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-gold" />
                    <p className="font-sans text-sm text-foreground/90">
                      Message delivered to the studio — we'll be in touch shortly.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="contact-name">
                      Name *
                    </label>
                    <input
                      id="contact-name"
                      className="field"
                      required
                      value={form.name}
                      onChange={(event) => update("name", event.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      className="field"
                      value={form.email}
                      onChange={(event) => update("email", event.target.value)}
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="contact-phone">
                      Phone / WhatsApp
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      className="field"
                      value={form.phone}
                      onChange={(event) => update("phone", event.target.value)}
                      placeholder="+234…"
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="contact-subject">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      className="field"
                      value={form.subject}
                      onChange={(event) => update("subject", event.target.value)}
                      placeholder="Bridal package, masterclass…"
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label" htmlFor="contact-message">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    className="field resize-none"
                    rows={5}
                    required
                    value={form.message}
                    onChange={(event) => update("message", event.target.value)}
                    placeholder="How can we help bring your glam vision to life?"
                  />
                </div>

                <button type="submit" disabled={submitting} className="btn btn-gold w-full shine">
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
                  {submitting ? "Sending" : "Send message"}
                </button>
              </form>
            </div>
          </Reveal>

          <div className="space-y-8">
            <Reveal variant="up" delay={0.12}>
              <div className="overflow-hidden rounded-sm border border-border/70">
                <iframe
                  src={MAP_EMBED}
                  title="B1touch Artistry studio location in Ajah, Lagos"
                  width="100%"
                  height="340"
                  loading="lazy"
                  style={{ border: 0 }}
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <a
                  href="https://www.google.com/maps?q=Addo+Road,+Ajah,+Lagos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw inline-flex items-center gap-2 font-sans text-sm uppercase tracking-[0.18em] text-gold-light"
                >
                  Open in maps <ArrowUpRight size={13} />
                </a>
                <span className="font-sans text-xs text-muted-foreground">
                  Street parking · arrive 10 minutes before your slot
                </span>
              </div>
            </Reveal>

            <Reveal variant="up" delay={0.2}>
              <div className="panel rounded-sm p-7">
                <span className="eyebrow">Follow the studio</span>
                <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">
                  New looks, behind-the-scenes and open dates are posted first on Instagram.
                </p>
                <div className="mt-6 flex gap-3">
                  <a
                    href="https://instagram.com/b1touchartistry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Instagram size={14} /> Instagram
                  </a>
                  <a
                    href="https://facebook.com/b1touchartistry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                  >
                    <Facebook size={14} /> Facebook
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-border/60 bg-[hsl(22_13%_5%)] py-20 sm:py-28">
        <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionIndex index="02" label="FAQ" className="mb-7" />
            <SplitText as="h2" text="Questions, answered" className="display-lg max-w-[14ch]" />
            <Reveal variant="up" delay={0.2}>
              <Ornament className="mt-8 max-w-xs" />
              <p className="mt-6 max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
                Still unsure about something? Message the studio — we'd rather answer twice than have you
                guess.
              </p>
            </Reveal>
          </div>

          <div className="divide-y divide-border/70 border-y border-border/70">
            {faqs.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div key={faq.q}>
                  <button
                    onClick={() => setOpenFaq(open ? null : index)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span
                      className={`font-display text-xl transition-colors duration-500 ${
                        open ? "text-gold-light" : "text-foreground hover:text-gold-light"
                      }`}
                    >
                      {faq.q}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold">
                      {open ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-7 font-sans text-sm leading-[1.9] text-muted-foreground">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA + SOCIAL */}
      <section className="py-20 text-center sm:py-24">
        <div className="shell">
          <SplitText as="h2" text="Prefer to book straight away?" className="display-md mx-auto max-w-[22ch]" highlightFrom={3} />
          <Reveal variant="up" delay={0.25} className="mt-9 flex flex-wrap justify-center gap-4">
            <Magnetic strength={0.2}>
              <a href="/booking" className="btn btn-gold shine">
                Reserve a session
                <ArrowUpRight size={14} />
              </a>
            </Magnetic>
            <a href="https://wa.me/2348061651126" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              WhatsApp the studio
            </a>
          </Reveal>
        </div>
      </section>

      <InstagramFeed />
    </Layout>
  );
}
