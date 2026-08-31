import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, User, Phone, Instagram, MapPin, MessageSquare, Check, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const serviceOptions = [
  { name: "Bridal Makeup", price: 225000, label: "Bridal Makeup (From ₦225,000)" },
  { name: "Owambe / Event Glam", price: 100000, label: "Owambe / Event Glam (From ₦100,000)" },
  { name: "Editorial & Photoshoot", price: 150000, label: "Editorial & Photoshoot (From ₦150,000)" },
  { name: "Birthday Glam", price: 125000, label: "Birthday Glam (From ₦125,000)" },
  { name: "Film & TV Makeup", price: 250000, label: "Film & TV Makeup (From ₦250,000)" },
  { name: "Makeup Masterclass", price: 400000, label: "Makeup Masterclass (From ₦400,000)" },
];

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

const prepTips = [
  "Arrive with a clean, moisturised face",
  "Avoid heavy skincare products on the day",
  "Bring reference photos of your desired look",
  "Wear a button-down shirt to avoid smudging",
  "Stay hydrated for glowing skin",
  "Let us know about any skin allergies in advance",
];

export default function Booking() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    instagram: "",
    service: "Bridal Makeup",
    time: "10:00 AM",
    location: "studio",
    eventType: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    referenceCode: string;
    whatsappUrl: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate dynamic price
  const selectedServiceObj = serviceOptions.find((s) => s.name === formData.service);
  const basePrice = selectedServiceObj ? selectedServiceObj.price : 100000;
  const locationFee = formData.location === "home" ? 50000 : 0;
  const estimatedTotal = basePrice + locationFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.service || !date) {
      toast({
        title: "Please fill in required fields",
        description: "Full name, phone number, service, and preferred date are required.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const res = await api.bookings.create({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        instagram: formData.instagram,
        service: formData.service,
        bookingDate: formattedDate,
        bookingTime: formData.time,
        locationType: formData.location as 'studio' | 'home' | 'venue',
        eventType: formData.eventType,
        address: formData.address,
        notes: formData.notes,
      });

      if (res.success && res.data) {
        setSubmittedData({
          referenceCode: res.data.referenceCode,
          whatsappUrl: res.data.whatsappUrl,
        });
        toast({
          title: "Booking Request Received! 🎉",
          description: `Reference code: ${res.data.referenceCode}. We'll confirm your session shortly.`,
        });
      } else {
        toast({
          title: "Booking error",
          description: res.error || "Failed to submit booking.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Submission failed",
        description: "Could not submit booking request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedData) {
    return (
      <Layout>
        <section className="min-h-screen flex items-center justify-center bg-background pt-24 pb-16">
          <div className="text-center max-w-lg mx-auto px-4">
            <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Check className="w-10 h-10 text-primary-foreground" />
            </div>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary block mb-2">
              Booking Ref: {submittedData.referenceCode}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Booking Request Confirmed!
            </h1>
            <p className="text-muted-foreground mb-8 text-sm sm:text-base leading-relaxed">
              Thank you, <strong className="text-foreground">{formData.name}</strong>! Your request for{" "}
              <strong className="text-foreground">{formData.service}</strong> on{" "}
              <strong className="text-foreground">{date && format(date, "MMMM do, yyyy")} ({formData.time})</strong> has been registered in our system.
            </p>

            <div className="p-4 bg-card border border-border rounded-sm text-left mb-8 space-y-2 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference Code:</span>
                <span className="font-mono font-bold text-primary">{submittedData.referenceCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Investment:</span>
                <span className="font-semibold text-foreground">₦{estimatedTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="capitalize text-foreground">{formData.location === 'home' ? 'Home / Location Service' : 'Addo Road Studio, Ajah'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={submittedData.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-sans font-semibold bg-[#25D366] text-white rounded-sm hover:opacity-90 transition-opacity shadow-md"
              >
                Confirm on WhatsApp Now
              </a>
              <Link
                to={`/booking/lookup?code=${submittedData.referenceCode}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-sans text-primary border border-primary/40 rounded-sm hover:bg-primary/10 transition-colors"
              >
                Track Booking Status
              </Link>
              <Link
                to="/"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors pt-2"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.4em] text-primary mb-4 block">
              Book a Session
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              Let's Create Your <span className="text-gradient-gold">Perfect Look</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Reserve your appointment with Lagos' premier dark skin makeup artist. Instant confirmation via WhatsApp.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 sm:p-8 border border-border rounded-sm shadow-sm">
                  {/* Personal Details */}
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-4 text-foreground">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 block">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-9 pr-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                            placeholder="Your full name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 block">
                          Phone / WhatsApp *
                        </label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="tel"
                            required
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-9 pr-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                            placeholder="+234 806 165 1126"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 block">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                          placeholder="you@email.com"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 block">
                          Instagram Handle
                        </label>
                        <div className="relative">
                          <Instagram size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                            className="w-full pl-9 pr-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                            placeholder="@yourusername"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service & Date */}
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-4 text-foreground">Service & Schedule</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 block">
                          Service Selection *
                        </label>
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
                        >
                          {serviceOptions.map((s) => (
                            <option key={s.name} value={s.name}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 block">
                          Preferred Date *
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                "w-full px-4 py-3 bg-secondary border border-border rounded-sm text-sm text-left flex items-center gap-2 focus:outline-none focus:border-primary transition-colors",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon size={14} />
                              {date ? format(date, "PPP") : "Select a date"}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              disabled={(d) => d < new Date()}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 block">
                          Preferred Time Slot
                        </label>
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
                        >
                          {timeSlots.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 block">
                          Location Type
                        </label>
                        <select
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
                        >
                          <option value="studio">Studio (Addo Road, Ajah)</option>
                          <option value="home">Home / Location Service (+₦50,000)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Home Location Address */}
                  {formData.location === "home" && (
                    <div>
                      <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 block">
                        Full Location / House Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        placeholder="e.g. Lekki Phase 1, Victoria Island, Ikeja..."
                      />
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 block">
                      Special Requests / Skin Allergies
                    </label>
                    <div className="relative">
                      <MessageSquare size={14} className="absolute left-3 top-3 text-muted-foreground" />
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full pl-9 pr-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                        placeholder="Any skin sensitivities, allergies, or special glam requirements?"
                      />
                    </div>
                  </div>

                  {/* Price Estimate Summary */}
                  <div className="p-4 bg-secondary/60 border border-border rounded-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground block font-sans">Estimated Investment</span>
                      <span className="text-xl font-serif font-bold text-gradient-gold">
                        ₦{estimatedTotal.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-sans text-right">
                      {formData.location === 'home' ? 'Includes ₦50,000 location fee' : 'Ajah Studio Session'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 text-sm font-sans font-semibold tracking-wide bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all rounded-sm shadow-md disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Submitting Appointment Request...
                      </>
                    ) : (
                      <>
                        Submit Booking Request
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    Prefer immediate booking? Chat directly via{" "}
                    <a href="https://wa.me/2348061651126" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                      WhatsApp
                    </a>{" "}
                    or call{" "}
                    <a href="tel:+2348061651126" className="text-primary hover:underline font-medium">
                      +234 806 165 1126
                    </a>
                  </p>
                </form>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Lookup helper */}
              <AnimatedSection delay={0.1}>
                <div className="p-6 bg-card border border-primary/30 rounded-sm">
                  <h3 className="text-sm font-serif font-bold text-foreground mb-2 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-primary" /> Already have a booking?
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Look up your appointment reference code to view status and studio location.
                  </p>
                  <Link
                    to="/booking/lookup"
                    className="inline-block w-full text-center py-2 text-xs font-sans font-semibold border border-primary/40 text-primary hover:bg-primary/10 rounded-sm transition-colors"
                  >
                    Track Booking Status →
                  </Link>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="p-6 bg-card border border-border rounded-sm">
                  <h3 className="text-lg font-serif font-semibold mb-4">Session Prep Guide</h3>
                  <ul className="space-y-3">
                    {prepTips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check size={14} className="text-primary mt-0.5 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="p-6 bg-card border border-border rounded-sm">
                  <h3 className="text-lg font-serif font-semibold mb-3">Studio Location</h3>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                    Addo Road, Ajah, Lagos, Nigeria
                  </div>
                  <div className="aspect-video rounded-sm overflow-hidden bg-muted">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7!2d3.5!3d6.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjQnMDAuMCJOIDPCsDMwJzAwLjAiRQ!5e0!3m2!1sen!2sng!4v1!5m2!1sen!2sng"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="B1touch Artistry Location"
                    />
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
