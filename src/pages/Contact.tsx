import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Send, Loader2, CheckCircle2 } from "lucide-react";
import Layout from "@/components/Layout";
import { AnimatedSection, SectionHeading } from "@/components/AnimatedSection";
import { InstagramFeed } from "@/components/InstagramFeed";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const faqs = [
  { q: "Do you provide lashes?", a: "Yes! Lash application is included in all our makeup services. We use premium quality lashes that complement your look." },
  { q: "How long does a session take?", a: "A standard glam session takes 1.5–2 hours. Bridal makeup with trial session takes about 2.5–3 hours." },
  { q: "Do you offer home service?", a: "Yes, we offer home/location service across Lagos (Lekki, VI, Ikoyi, Ikeja, Ajah) at an additional fee of ₦50,000+. Perfect for brides and groups." },
  { q: "What products do you use?", a: "We use a combination of premium brands including MAC, Fenty Beauty, Charlotte Tilbury, Black Opal, and other professional-grade products tested for melanin-rich skin." },
  { q: "How far in advance should I book for a wedding?", a: "We recommend booking at least 2–3 months in advance for bridal services, especially during peak wedding season (November – February)." },
  { q: "Do you offer group discounts?", a: "Yes! Groups of 5 or more for events like bridal trains or aso-ebi receive a special group rate. Contact us for custom quotes." },
];

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast({
        title: "Please fill in all required fields",
        description: "Your name and message are required.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.contact.send({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject || 'Website Contact Form',
        message: form.message,
      });

      if (res.success) {
        setSentSuccess(true);
        toast({
          title: "Message Sent! ✨",
          description: "Thank you for reaching out! We'll get back to you within 24 hours.",
        });
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        toast({
          title: "Message failed",
          description: res.error || "Could not send message.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Network error",
        description: "Please try again later or WhatsApp us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.4em] text-primary mb-4 block">
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              Let's <span className="text-gradient-gold">Connect</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Have a question, masterclass inquiry, or custom bridal request? Reach out to our studio.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <AnimatedSection>
                <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Contact Information</h2>
                <div className="space-y-5 font-sans">
                  <a href="https://wa.me/2348061651126" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-sm bg-card border border-border flex items-center justify-center group-hover:border-primary/40 transition-colors shadow-sm">
                      <Phone size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">WhatsApp / Phone</p>
                      <p className="text-sm text-muted-foreground">+234 806 165 1126</p>
                    </div>
                  </a>
                  <a href="mailto:info@b1touchartistry.com" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-sm bg-card border border-border flex items-center justify-center group-hover:border-primary/40 transition-colors shadow-sm">
                      <Mail size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">info@b1touchartistry.com</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-sm bg-card border border-border flex items-center justify-center shadow-sm">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Studio Location</p>
                      <p className="text-sm text-muted-foreground">Addo Road, Ajah, Lagos, Nigeria</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-sm bg-card border border-border flex items-center justify-center shadow-sm">
                      <Clock size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Studio Hours</p>
                      <p className="text-sm text-muted-foreground">Mon – Sat: 9AM – 7PM · Sun: By Appointment</p>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div className="mt-8 font-sans">
                  <p className="text-sm font-semibold text-foreground mb-3">Follow Us</p>
                  <div className="flex gap-3">
                    <a
                      href="https://instagram.com/b1touch_artistry"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground border border-border rounded-sm hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      <Instagram size={16} /> Instagram
                    </a>
                    <a
                      href="https://facebook.com/b1touchartistry"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground border border-border rounded-sm hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      <Facebook size={16} /> Facebook
                    </a>
                  </div>
                </div>
              </AnimatedSection>

              {/* Map */}
              <AnimatedSection delay={0.2}>
                <div className="aspect-video rounded-sm overflow-hidden border border-border shadow-sm">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7!2d3.5!3d6.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjQnMDAuMCJOIDPCsDMwJzAwLjAiRQ!5e0!3m2!1sen!2sng!4v1!5m2!1sen!2sng"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="B1touch Artistry Studio Location"
                  />
                </div>
              </AnimatedSection>
            </div>

            {/* Contact Form */}
            <AnimatedSection delay={0.1}>
              <div className="p-8 bg-card border border-border rounded-sm shadow-md font-sans">
                <h2 className="text-2xl font-serif font-bold mb-2 text-foreground">Send Us a Message</h2>
                <p className="text-sm text-muted-foreground mb-6">We respond promptly to all client inquiries.</p>

                {sentSuccess && (
                  <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-sm flex items-center gap-2 text-xs text-primary font-semibold">
                    <CheckCircle2 size={16} />
                    Message delivered to studio! We will contact you shortly.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="you@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="+234..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Subject / Interest</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g. Bridal Glam Package, Masterclass Registration..."
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="How can we help make your glam vision come to life?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold tracking-wide bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all rounded-sm shadow-md disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-secondary">
        <div className="container-narrow mx-auto">
          <SectionHeading
            subtitle="FAQ"
            title="Common Questions"
            description="Quick answers to help you prepare for your session."
          />
          <div className="max-w-2xl mx-auto space-y-3 font-sans">
            {faqs.map((faq, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div className="border border-border rounded-sm overflow-hidden bg-card">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {faq.q}
                    <span className={`text-primary transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <InstagramFeed />
    </Layout>
  );
}
