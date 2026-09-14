import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarIcon,
  Check,
  Copy,
  Instagram,
  Loader2,
  MapPin,
  MessageSquare,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import Layout from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { getImages } from "@/lib/portfolioImages";
import { Magnetic, Reveal, RevealMedia, SectionIndex, SplitText } from "@/components/motion/Reveal";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

const serviceOptions = [
  { name: "Bridal Makeup", price: 225000, label: "Bridal Makeup (from ₦225,000)" },
  { name: "Owambe / Event Glam", price: 100000, label: "Owambe / Event Glam (from ₦100,000)" },
  { name: "Editorial & Photoshoot", price: 150000, label: "Editorial & Photoshoot (from ₦150,000)" },
  { name: "Birthday Glam", price: 125000, label: "Birthday Glam (from ₦125,000)" },
  { name: "Film & TV Makeup", price: 250000, label: "Film & TV Makeup (from ₦250,000)" },
  { name: "Makeup Masterclass", price: 400000, label: "Makeup Masterclass (from ₦400,000)" },
];

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

const prepTips = [
  "Arrive with a clean, moisturised face",
  "Avoid heavy skincare on the day",
  "Bring reference photos of your desired look",
  "Wear a button-down shirt to avoid smudging",
  "Stay hydrated for glowing skin",
  "Tell us about any skin allergies in advance",
];

const LOCATION_FEE = 50000;

const MAP_EMBED =
  "https://www.google.com/maps?q=Addo%20Road%2C%20Ajah%2C%20Lagos%2C%20Nigeria&output=embed";

export default function Booking() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    instagram: "",
    service: serviceOptions[0].name,
    time: "10:00 AM",
    location: "studio" as "studio" | "home",
    eventType: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState<{
    referenceCode: string;
    whatsappUrl: string;
  } | null>(null);

  const portrait = useMemo(() => getImages(1, 8)[0], []);
  const { scrollTo } = useSmoothScroll();

  // The form is long; when the request lands, show the confirmation from its
  // opening line rather than leaving the reader parked at the submit button.
  useEffect(() => {
    if (!submitted) return;
    scrollTo(0, { immediate: false });
  }, [submitted, scrollTo]);

  const selectedService = serviceOptions.find((service) => service.name === form.service);
  const basePrice = selectedService?.price ?? 100000;
  const locationFee = form.location === "home" ? LOCATION_FEE : 0;
  const estimatedTotal = basePrice + locationFee;

  const update = (key: keyof typeof form, value: string) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.service || !date) {
      toast({
        title: "A few details are missing",
        description: "We need your name, phone number, service and preferred date to hold the slot.",
        variant: "destructive",
      });
      return;
    }

    if (form.location === "home" && !form.address.trim()) {
      toast({
        title: "Where are we coming to?",
        description: "Please add the address for your home or venue session.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.bookings.create({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        instagram: form.instagram.trim(),
        service: form.service,
        bookingDate: format(date, "yyyy-MM-dd"),
        bookingTime: form.time,
        servicePrice: estimatedTotal,
        locationType: form.location,
        eventType: form.eventType,
        address: form.address,
        notes: form.notes,
      });

      if (res.success && res.data) {
        setSubmitted({
          referenceCode: res.data.referenceCode,
          whatsappUrl: res.data.whatsappUrl,
        });
        toast({
          title: "Booking request received",
          description: `Reference ${res.data.referenceCode} — we'll confirm shortly on WhatsApp.`,
        });
      } else {
        toast({
          title: "We couldn't submit that",
          description: res.error || "Please try again, or book via WhatsApp.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const copyReference = async () => {
    if (!submitted) return;
    try {
      await navigator.clipboard.writeText(submitted.referenceCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      toast({ title: "Copy the code manually", description: submitted.referenceCode });
    }
  };

  /* ───────────── SUCCESS ───────────── */
  if (submitted) {
    return (
      <Layout>
        <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-32 pb-20">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(65%_60%_at_50%_0%,hsl(40_62%_62%_/_0.18),transparent_62%)]" />
          <div className="grain pointer-events-none absolute inset-0 -z-10" />

          <div className="shell-tight relative text-center">
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold shadow-gold"
            >
              <Check className="h-9 w-9 text-primary-foreground" />
            </motion.span>

            <Reveal variant="fade" delay={0.2}>
              <p className="eyebrow mt-9">Reference code</p>
            </Reveal>

            <Reveal variant="up" delay={0.25}>
              <button
                onClick={copyReference}
                className="mx-auto mt-4 flex items-center gap-3 rounded-sm border border-gold/30 bg-gold/[0.06] px-5 py-3 transition-colors duration-500 hover:border-gold/60"
                title="Copy reference code"
              >
                <span className="numeral text-2xl tracking-wide text-gradient-gold sm:text-3xl">
                  {submitted.referenceCode}
                </span>
                <span className="text-muted-foreground transition-colors hover:text-gold">
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </span>
              </button>
            </Reveal>

            <SplitText as="h1" text="Your request is with the studio" className="display-md mx-auto mt-10 max-w-[24ch]" highlightFrom={3} />

            <Reveal variant="up" delay={0.5}>
              <p className="lede mx-auto mt-6 max-w-xl text-center">
                Thank you, <span className="text-foreground">{form.name}</span>. Your request for{" "}
                <span className="text-foreground">{form.service}</span> on{" "}
                <span className="text-foreground">
                  {date ? format(date, "MMMM do, yyyy") : ""} · {form.time}
                </span>{" "}
                has been registered. A stylist confirms every booking personally.
              </p>
            </Reveal>

            <Reveal variant="up" delay={0.6}>
              <div className="mx-auto mt-10 grid max-w-lg gap-px overflow-hidden rounded-sm border border-border/70 bg-border/40 text-left sm:grid-cols-3">
                <div className="bg-[hsl(22_13%_6%)] p-5">
                  <span className="eyebrow-muted">Investment</span>
                  <div className="numeral mt-2 text-lg text-foreground">
                    ₦{estimatedTotal.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[hsl(22_13%_6%)] p-5">
                  <span className="eyebrow-muted">Location</span>
                  <div className="mt-2 font-sans text-sm text-foreground">
                    {form.location === "home" ? "Home / venue" : "Ajah studio"}
                  </div>
                </div>
                <div className="bg-[hsl(22_13%_6%)] p-5">
                  <span className="eyebrow-muted">Next step</span>
                  <div className="mt-2 font-sans text-sm text-foreground">Confirm on WhatsApp</div>
                </div>
              </div>
            </Reveal>

            <Reveal variant="up" delay={0.7} className="mt-10 flex flex-wrap justify-center gap-4">
              <Magnetic strength={0.2}>
                <a
                  href={submitted.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold shine"
                >
                  Confirm on WhatsApp
                  <ArrowUpRight size={14} />
                </a>
              </Magnetic>
              <Link to={`/booking/lookup?code=${submitted.referenceCode}`} className="btn btn-outline">
                Track this booking
              </Link>
            </Reveal>

            <Reveal variant="fade" delay={0.85}>
              <div className="mt-14 flex flex-wrap items-center justify-center gap-6">
                <Link to="/" className="link-draw font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Return home
                </Link>
                <Link to="/portfolio" className="link-draw font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Browse the gallery
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </Layout>
    );
  }

  /* ───────────── FORM ───────────── */
  return (
    <Layout>
      <section className="relative isolate overflow-hidden pb-14 pt-36 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_20%_0%,hsl(40_62%_62%_/_0.13),transparent_60%)]" />
        <div className="shell">
          <Reveal variant="fade">
            <SectionIndex index="01" label="Booking" className="mb-8" />
          </Reveal>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <SplitText
              as="h1"
              text="Reserve your date"
              highlightFrom={1}
              className="display-lg max-w-[14ch]"
              delay={0.15}
            />
            <Reveal variant="up" delay={0.5}>
              <p className="lede max-w-lg">
                Tell us what you're celebrating. We'll confirm availability within a few hours and hold
                your slot with a deposit.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="shell grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          {/* FORM */}
          <Reveal variant="up">
            <form onSubmit={handleSubmit} className="space-y-10" noValidate>
              {/* Personal */}
              <fieldset className="panel rounded-sm p-7 sm:p-9">
                <legend className="eyebrow mb-7 flex items-center gap-3">
                  <span className="numeral text-gold/60">01</span> Your details
                </legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="booking-name">
                      Full name *
                    </label>
                    <div className="relative">
                      <User size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold/70" />
                      <input
                        id="booking-name"
                        name="name"
                        required
                        className="field pl-11"
                        value={form.name}
                        onChange={(event) => update("name", event.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="field-label" htmlFor="booking-phone">
                      Phone / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold/70" />
                      <input
                        id="booking-phone"
                        name="phone"
                        type="tel"
                        required
                        className="field pl-11"
                        value={form.phone}
                        onChange={(event) => update("phone", event.target.value)}
                        placeholder="+234 806 165 1126"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="field-label" htmlFor="booking-email">
                      Email
                    </label>
                    <input
                      id="booking-email"
                      name="email"
                      type="email"
                      className="field"
                      value={form.email}
                      onChange={(event) => update("email", event.target.value)}
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="booking-instagram">
                      Instagram handle
                    </label>
                    <div className="relative">
                      <Instagram size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold/70" />
                      <input
                        id="booking-instagram"
                        name="instagram"
                        className="field pl-11"
                        value={form.instagram}
                        onChange={(event) => update("instagram", event.target.value)}
                        placeholder="@yourusername"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Service & schedule */}
              <fieldset className="panel rounded-sm p-7 sm:p-9">
                <legend className="eyebrow mb-7 flex items-center gap-3">
                  <span className="numeral text-gold/60">02</span> Service & schedule
                </legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="field-label" htmlFor="booking-service">
                      Service *
                    </label>
                    <select
                      id="booking-service"
                      name="service"
                      className="field appearance-none"
                      value={form.service}
                      onChange={(event) => update("service", event.target.value)}
                    >
                      {serviceOptions.map((service) => (
                        <option key={service.name} value={service.name}>
                          {service.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="field-label">Preferred date *</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "field flex items-center gap-3 text-left",
                            !date && "text-muted-foreground/70"
                          )}
                        >
                          <CalendarIcon size={14} className="text-gold/70" />
                          {date ? format(date, "PPP") : "Select a date"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto border-border/80 bg-[hsl(24_12%_8%)] p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                          className="pointer-events-auto p-3"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="booking-time">
                      Time slot
                    </label>
                    <select
                      id="booking-time"
                      name="time"
                      className="field appearance-none"
                      value={form.time}
                      onChange={(event) => update("time", event.target.value)}
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="booking-location">
                      Location
                    </label>
                    <select
                      id="booking-location"
                      name="location"
                      className="field appearance-none"
                      value={form.location}
                      onChange={(event) => update("location", event.target.value)}
                    >
                      <option value="studio">Studio · Addo Road, Ajah</option>
                      <option value="home">Home / venue (+₦50,000)</option>
                    </select>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="booking-event">
                      Occasion
                    </label>
                    <input
                      id="booking-event"
                      name="eventType"
                      className="field"
                      value={form.eventType}
                      onChange={(event) => update("eventType", event.target.value)}
                      placeholder="Wedding, birthday, shoot…"
                    />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {form.location === "home" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-5">
                        <label className="field-label" htmlFor="booking-address">
                          Full address *
                        </label>
                        <div className="relative">
                          <MapPin size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold/70" />
                          <input
                            id="booking-address"
                            name="address"
                            className="field pl-11"
                            value={form.address}
                            onChange={(event) => update("address", event.target.value)}
                            placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </fieldset>

              {/* Notes */}
              <fieldset className="panel rounded-sm p-7 sm:p-9">
                <legend className="eyebrow mb-7 flex items-center gap-3">
                  <span className="numeral text-gold/60">03</span> Anything we should know
                </legend>
                <label className="field-label" htmlFor="booking-notes">
                  Special requests / skin sensitivities
                </label>
                <div className="relative">
                  <MessageSquare size={14} className="pointer-events-none absolute left-4 top-4 text-gold/70" />
                  <textarea
                    id="booking-notes"
                    name="notes"
                    rows={4}
                    className="field resize-none pl-11"
                    value={form.notes}
                    onChange={(event) => update("notes", event.target.value)}
                    placeholder="Allergies, inspiration photos, timings, bridal party details…"
                  />
                </div>

                <div className="mt-8 flex flex-col gap-5 border-t border-border/70 pt-7 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="eyebrow-muted">Estimated investment</span>
                    <div className="numeral mt-2 text-3xl text-gradient-gold">
                      ₦{estimatedTotal.toLocaleString()}
                    </div>
                    <span className="mt-2 block font-sans text-[0.6875rem] text-muted-foreground">
                      {form.location === "home"
                        ? `Includes ₦${LOCATION_FEE.toLocaleString()} location fee · deposit secures the date`
                        : "Ajah studio session · deposit secures the date"}
                    </span>
                  </div>

                  <button type="submit" disabled={submitting} className="btn btn-gold shine sm:min-w-[15rem]">
                    {submitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Sending request
                      </>
                    ) : (
                      <>
                        Request booking
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-5 font-sans text-xs text-muted-foreground">
                  Prefer to talk it through?{" "}
                  <a
                    href="https://wa.me/2348061651126"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-light underline decoration-gold/40 underline-offset-4"
                  >
                    WhatsApp the studio
                  </a>{" "}
                  or call{" "}
                  <a href="tel:+2348061651126" className="text-gold-light underline decoration-gold/40 underline-offset-4">
                    +234 806 165 1126
                  </a>
                  .
                </p>
              </fieldset>
            </form>
          </Reveal>

          {/* SIDEBAR */}
          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Reveal variant="up" delay={0.1}>
              <div className="panel overflow-hidden rounded-sm">
                <RevealMedia
                  src={portrait}
                  alt="B1touch Artistry bridal look"
                  ratio="16 / 11"
                  parallax={14}
                  className="rounded-none"
                />
                <div className="p-6">
                  <h2 className="font-display text-xl">Already booked?</h2>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                    Enter your reference code to see status, timing and studio directions.
                  </p>
                  <Link to="/booking/lookup" className="btn btn-outline btn-sm mt-5 w-full">
                    Track a booking
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal variant="up" delay={0.18}>
              <div className="panel rounded-sm p-6">
                <h2 className="flex items-center gap-2.5 font-display text-xl">
                  <Sparkles size={16} className="text-gold" />
                  Session prep
                </h2>
                <ul className="mt-5 space-y-3">
                  {prepTips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2.5 font-sans text-[0.8125rem] text-muted-foreground">
                      <Check size={14} className="mt-0.5 shrink-0 text-gold" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal variant="up" delay={0.26}>
              <div className="panel overflow-hidden rounded-sm">
                <iframe
                  src={MAP_EMBED}
                  title="B1touch Artistry studio in Ajah, Lagos"
                  width="100%"
                  height="200"
                  loading="lazy"
                  style={{ border: 0 }}
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="p-6">
                  <h2 className="flex items-center gap-2.5 font-display text-lg">
                    <MapPin size={15} className="text-gold" />
                    Addo Road, Ajah
                  </h2>
                  <p className="mt-3 font-sans text-[0.8125rem] leading-relaxed text-muted-foreground">
                    Lagos, Nigeria. Street parking available — please arrive ten minutes before your slot
                    so we can start on time.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
