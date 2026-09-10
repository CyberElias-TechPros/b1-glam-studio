import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Search, CalendarCheck, Clock, MapPin, Phone, MessageSquare, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { api, Booking } from '@/lib/api';

export default function BookingLookup() {
  const { code: paramCode } = useParams<{ code?: string }>();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(paramCode || searchParams.get('code') || '');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (lookupCode: string) => {
    if (!lookupCode.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await api.bookings.lookup(lookupCode);
      if (res.success && res.data) {
        setBooking(res.data);
      } else {
        setBooking(null);
        setError(res.error || `No booking found for reference "${lookupCode}"`);
      }
    } catch {
      setError('Failed to check booking status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      handleSearch(code);
    }
  }, [code]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(code);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-narrow mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.4em] text-primary mb-3 block">
              Appointment Status
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              Track Your <span className="text-gradient-gold">Glam Booking</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Enter your unique booking reference code (e.g. B1-2026-XXXX) to check your appointment details and confirmation.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Lookup Form */}
      <section className="section-padding bg-background">
        <div className="max-w-2xl mx-auto px-4">
          <AnimatedSection>
            <form onSubmit={handleSubmit} className="p-6 bg-card border border-border rounded-sm shadow-md mb-8">
              <label className="block text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2">
                Booking Reference Code
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. B1-2026-9A8B"
                    className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground uppercase tracking-wider font-mono placeholder:font-sans placeholder:normal-case placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-gold text-primary-foreground text-sm font-sans font-semibold rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Check Status'}
                </button>
              </div>
            </form>
          </AnimatedSection>

          {/* Results */}
          {loading && (
            <div className="py-12 text-center text-muted-foreground">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
              <p className="text-sm font-sans">Checking appointment database...</p>
            </div>
          )}

          {error && !loading && (
            <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-sm text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
              <p className="text-sm font-serif font-semibold text-foreground">{error}</p>
              <p className="text-xs text-muted-foreground">
                Double-check your reference code or reach out to us on WhatsApp if you need help finding your booking.
              </p>
              <a
                href="https://wa.me/2348061651126"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-primary font-semibold hover:underline"
              >
                Chat on WhatsApp Support →
              </a>
            </div>
          )}

          {booking && !loading && (
            <div className="bg-card border border-border rounded-sm p-6 sm:p-8 space-y-6 shadow-lg">
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                <div>
                  <span className="text-xs font-mono font-semibold text-primary block mb-1">
                    {booking.reference_code}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-foreground">
                    {booking.name}
                  </h3>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-sans font-bold uppercase tracking-wider ${
                      booking.status === 'confirmed'
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                        : booking.status === 'completed'
                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        : booking.status === 'cancelled'
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}
                  >
                    {booking.status === 'confirmed' ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                    {booking.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Details List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 bg-secondary/40 rounded-sm">
                  <span className="text-muted-foreground block mb-1">Selected Service</span>
                  <span className="font-semibold text-foreground text-sm">{booking.service}</span>
                </div>
                <div className="p-4 bg-secondary/40 rounded-sm">
                  <span className="text-muted-foreground block mb-1">Appointment Date & Time</span>
                  <span className="font-semibold text-foreground text-sm">
                    {booking.booking_date} @ {booking.booking_time}
                  </span>
                </div>
                <div className="p-4 bg-secondary/40 rounded-sm">
                  <span className="text-muted-foreground block mb-1">Location</span>
                  <span className="font-semibold text-foreground text-sm capitalize">
                    {booking.location_type === 'home' ? 'Home / Location Service' : 'Ajah Studio'}
                  </span>
                </div>
                <div className="p-4 bg-secondary/40 rounded-sm">
                  <span className="text-muted-foreground block mb-1">Estimated Investment</span>
                  <span className="font-semibold text-primary text-sm">
                    ₦{(booking.service_price || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Studio Address Note */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-sm flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs font-sans text-muted-foreground">
                  <strong className="text-foreground block mb-0.5">Studio Location:</strong>
                  Addo Road, Ajah, Lagos, Nigeria. Please arrive 10 minutes prior to your glam session.
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                <a
                  href={`https://wa.me/2348061651126?text=${encodeURIComponent(
                    `Hi B1touch! Checking on my booking ${booking.reference_code} for ${booking.service}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 text-center text-xs font-sans font-semibold bg-[#25D366] text-white rounded-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
                >
                  <Phone size={14} /> Chat with Studio on WhatsApp
                </a>
                <Link
                  to="/booking"
                  className="py-3 px-6 text-center text-xs font-sans font-medium bg-secondary text-foreground hover:bg-secondary/80 rounded-sm"
                >
                  Book Another Look
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
