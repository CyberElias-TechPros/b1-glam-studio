import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, User, Phone, Instagram, MapPin, MessageSquare, Check } from "lucide-react";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import { AnimatedSection, SectionHeading } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

const serviceOptions = [
  "Bridal Makeup",
  "Owambe / Event Glam",
  "Editorial & Photoshoot",
  "Birthday Glam",
  "Film & TV Makeup",
  "Makeup Masterclass",
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
    instagram: "",
    service: "",
    time: "",
    location: "studio",
    eventType: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.service || !date) {
      toast({
        title: "Please fill in all required fields",
        description: "Name, phone, service, and date are required.",
        variant: "destructive",
      });
      return;
    }
    setSubmitted(true);
    toast({
      title: "Booking Request Sent! 🎉",
      description: "We'll confirm your appointment via WhatsApp within 24 hours.",
    });
  };

  if (submitted) {
    return (
      <Layout>
        <section className="min-h-screen flex items-center justify-center bg-background pt-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-4">Booking Request Sent!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you, {formData.name}! We'll confirm your {formData.service} appointment 
              for {date && format(date, "MMMM do, yyyy")} via WhatsApp within 24 hours.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/2348061651126"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-sans font-semibold bg-gradient-gold text-primary-foreground rounded-sm"
              >
                Chat on WhatsApp
              </a>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-sans text-primary border border-primary/40 rounded-sm hover:bg-primary/10 transition-colors"
              >
                Back to Home
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
            <p className="text-muted-foreground max-w-xl mx-auto">
              Fill out the form below to request a booking. We'll confirm via WhatsApp within 24 hours.
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Details */}
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-4">Personal Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 block">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-9 pr-4 py-3 bg-card border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
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
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-9 pr-4 py-3 bg-card border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                            placeholder="+234..."
                          />
                        </div>
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
                            className="w-full pl-9 pr-4 py-3 bg-card border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                            placeholder="@yourusername"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 block">
                          Event Type
                        </label>
                        <input
                          type="text"
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-card border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                          placeholder="e.g. Wedding, Birthday, Photoshoot"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Service & Date */}
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-4">Service & Schedule</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 block">
                          Service *
                        </label>
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-card border border-border rounded-sm text-sm text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
                        >
                          <option value="">Select a service</option>
                          {serviceOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
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
                                "w-full px-4 py-3 bg-card border border-border rounded-sm text-sm text-left flex items-center gap-2 focus:outline-none focus:border-primary transition-colors",
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
                          Preferred Time
                        </label>
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-card border border-border rounded-sm text-sm text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
                        >
                          <option value="">Select a time</option>
                          {timeSlots.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 block">
                          Location
                        </label>
                        <select
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-card border border-border rounded-sm text-sm text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
                        >
                          <option value="studio">Studio (Addo Road, Ajah)</option>
                          <option value="home">Home / Location Service (+₦10,000)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2 block">
                      Additional Notes
                    </label>
                    <div className="relative">
                      <MessageSquare size={14} className="absolute left-3 top-3 text-muted-foreground" />
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full pl-9 pr-4 py-3 bg-card border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                        placeholder="Any special requests, allergies, or reference photos?"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 text-sm font-sans font-semibold tracking-wide bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all rounded-sm"
                  >
                    Submit Booking Request
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    Prefer to chat? Book directly via{" "}
                    <a href="https://wa.me/2348061651126" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      WhatsApp
                    </a>{" "}
                    or call{" "}
                    <a href="tel:+2348061651126" className="text-primary hover:underline">
                      +234 806 165 1126
                    </a>
                  </p>
                </form>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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

              <AnimatedSection delay={0.4}>
                <div className="p-6 bg-gradient-gold rounded-sm text-center">
                  <h3 className="text-lg font-serif font-semibold text-primary-foreground mb-2">Quick Book</h3>
                  <p className="text-sm text-primary-foreground/80 mb-4">
                    For fastest response, WhatsApp us directly.
                  </p>
                  <a
                    href="https://wa.me/2348061651126?text=Hi%20B1touch%2C%20I'd%20like%20to%20book%20a%20session."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full py-3 text-sm font-sans font-semibold bg-primary-foreground text-primary rounded-sm hover:opacity-90 transition-opacity"
                  >
                    WhatsApp Us Now
                  </a>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
