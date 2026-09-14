import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import Layout from "@/components/Layout";
import { api, Booking } from "@/lib/api";
import { Magnetic, Ornament, Reveal, SectionIndex, SplitText } from "@/components/motion/Reveal";

const STATUS_STYLES: Record<
  Booking["status"],
  { label: string; className: string; copy: string }
> = {
  pending: {
    label: "Pending review",
    className: "border-gold/40 bg-gold/[0.08] text-gold-light",
    copy: "Your request is with the studio. We confirm every booking personally, usually within a few hours.",
  },
  confirmed: {
    label: "Confirmed",
    className: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    copy: "You're locked in. Arrive ten minutes early with a clean, moisturised face.",
  },
  completed: {
    label: "Completed",
    className: "border-sky-400/40 bg-sky-400/10 text-sky-300",
    copy: "This session has been completed. We'd love to hear how it held up — leave a review.",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-rose-400/40 bg-rose-400/10 text-rose-300",
    copy: "This booking was cancelled. Message the studio to find a new date.",
  },
  rescheduled: {
    label: "Rescheduled",
    className: "border-violet-400/40 bg-violet-400/10 text-violet-300",
    copy: "This booking has been moved. Check the date and time below, or message us to adjust.",
  },
};

export default function BookingLookup() {
  const { code: paramCode } = useParams<{ code?: string }>();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(paramCode || searchParams.get("code") || "");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (lookupCode: string) => {
    const value = lookupCode.trim();
    if (!value) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await api.bookings.lookup(value);
      if (res.success && res.data) {
        setBooking(res.data);
      } else {
        setBooking(null);
        setError(res.error || `We couldn't find a booking for “${value}”.`);
      }
    } catch (err) {
      setBooking(null);
      setError(err instanceof Error ? err.message : "Could not reach the booking service. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = paramCode || searchParams.get("code");
    if (initial) {
      setCode(initial.toUpperCase());
      void handleSearch(initial);
    }
  }, [paramCode, searchParams, handleSearch]);

  const status = booking ? STATUS_STYLES[booking.status] ?? STATUS_STYLES.pending : null;

  return (
    <Layout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden pb-12 pt-36 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_75%_0%,hsl(40_62%_62%_/_0.12),transparent_60%)]" />
        <div className="shell-tight">
          <Reveal variant="fade">
            <SectionIndex index="01" label="Booking tracker" className="mb-8" />
          </Reveal>
          <SplitText
            as="h1"
            text="Where is my glam appointment?"
            highlightFrom={3}
            className="display-lg max-w-[20ch]"
            delay={0.15}
          />
          <Reveal variant="up" delay={0.5}>
            <p className="lede mt-7 max-w-xl">
              Enter the reference code from your confirmation (for example{" "}
              <span className="text-foreground">B1-2026-9A8B</span>) to see your appointment details.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SEARCH */}
      <section className="pb-24">
        <div className="shell-tight">
          <Reveal variant="up" delay={0.1}>
            <form onSubmit={(event) => { event.preventDefault(); void handleSearch(code); }} className="panel rounded-sm p-6 sm:p-8">
              <label className="field-label" htmlFor="lookup-code">
                Booking reference
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold/70" />
                  <input
                    id="lookup-code"
                    className="field pl-11 font-mono uppercase tracking-[0.14em]"
                    value={code}
                    onChange={(event) => setCode(event.target.value.toUpperCase())}
                    placeholder="B1-2026-9A8B"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                <button type="submit" disabled={loading} className="btn btn-gold sm:min-w-[10rem]">
                  {loading ? <Loader2 size={15} className="animate-spin" /> : "Check status"}
                </button>
              </div>
              <p className="mt-4 font-sans text-xs text-muted-foreground">
                Lost your code? Message the studio on{" "}
                <a
                  href="https://wa.me/2348061651126"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-light underline decoration-gold/40 underline-offset-4"
                >
                  WhatsApp
                </a>{" "}
                and we'll retrieve it for you.
              </p>
            </form>
          </Reveal>

          {/* RESULT */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="panel flex flex-col items-center gap-4 rounded-sm py-16"
                >
                  <Loader2 className="h-7 w-7 animate-spin text-gold" />
                  <p className="eyebrow-muted">Checking the appointment book…</p>
                </motion.div>
              )}

              {!loading && error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="panel rounded-sm p-8 text-center"
                >
                  <AlertCircle className="mx-auto h-8 w-8 text-rose-300" />
                  <h2 className="mt-5 font-display text-2xl">{error}</h2>
                  <p className="mx-auto mt-3 max-w-md font-sans text-sm text-muted-foreground">
                    Double-check the code, or reach out and we'll find your booking manually.
                  </p>
                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <a
                      href="https://wa.me/2348061651126"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      <Phone size={13} /> WhatsApp support
                    </a>
                    <Link to="/booking" className="btn btn-ghost btn-sm">
                      Make a new booking
                    </Link>
                  </div>
                </motion.div>
              )}

              {!loading && booking && status && (
                <motion.div
                  key="booking"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="panel rounded-sm p-7 sm:p-9"
                >
                  <div className="flex flex-col gap-6 border-b border-border/70 pb-7 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="numeral text-sm text-gold-light">{booking.reference_code}</span>
                      <h2 className="mt-3 font-display text-3xl">{booking.name}</h2>
                      <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                        {status.copy}
                      </p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full border px-4 py-2 font-sans text-[0.625rem] uppercase tracking-[0.18em] ${status.className}`}
                    >
                      {booking.status === "confirmed" || booking.status === "completed" ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <Clock size={13} />
                      )}
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-7 grid gap-px overflow-hidden rounded-sm border border-border/70 bg-border/40 sm:grid-cols-2">
                    {[
                      { label: "Service", value: booking.service },
                      {
                        label: "Date & time",
                        value: `${booking.booking_date} · ${booking.booking_time}`,
                      },
                      {
                        label: "Location",
                        value:
                          booking.location_type === "studio"
                            ? "Ajah studio · Addo Road"
                            : booking.location_type === "home"
                              ? "Home / venue service"
                              : "On location",
                      },
                      {
                        label: "Estimated investment",
                        value: `₦${(booking.service_price || 0).toLocaleString()}`,
                        accent: true,
                      },
                    ].map((item) => (
                      <div key={item.label} className="bg-[hsl(22_13%_6%)] p-5">
                        <span className="eyebrow-muted">{item.label}</span>
                        <div
                          className={`mt-2 font-sans text-sm ${
                            item.accent ? "font-display text-lg text-gradient-gold" : "text-foreground"
                          }`}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {booking.address && (
                    <p className="mt-5 flex items-start gap-2.5 font-sans text-xs text-muted-foreground">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-gold" />
                      {booking.address}
                    </p>
                  )}

                  <div className="mt-7 flex items-start gap-3 rounded-sm border border-gold/25 bg-gold/[0.05] p-5">
                    <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div className="font-sans text-xs leading-relaxed text-muted-foreground">
                      <strong className="block text-foreground">Studio directions</strong>
                      Addo Road, Ajah, Lagos. Arrive ten minutes before your slot; street parking is
                      available. Bring reference photos for your look.
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Magnetic strength={0.16} className="flex-1">
                      <a
                        href={`https://wa.me/2348061651126?text=${encodeURIComponent(
                          `Hi B1touch! I'd like to follow up on booking ${booking.reference_code} (${booking.service}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-gold w-full"
                      >
                        <Phone size={14} />
                        Chat with the studio
                      </a>
                    </Magnetic>
                    <Link to="/booking" className="btn btn-outline flex-1">
                      Book another look
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              )}

              {!loading && !booking && !error && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-sm border border-dashed border-border/80 px-6 py-14 text-center"
                >
                  <Ornament className="mx-auto mb-6 max-w-[8rem]" />
                  <p className="eyebrow-muted">
                    {searched ? "Nothing to show yet" : "Your results will appear here"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </Layout>
  );
}
