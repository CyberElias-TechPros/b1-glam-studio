import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Sparkles, Star, X } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const EASE = [0.16, 1, 0.3, 1] as const;

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EVENT_TYPES = [
  "Traditional Wedding",
  "White Wedding",
  "Owambe / Party Glam",
  "Birthday Glam",
  "Editorial / Shoot",
  "Makeup Masterclass",
];

export function ReviewModal({ isOpen, onClose, onSuccess }: ReviewModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [quote, setQuote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setDone(false);
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !quote.trim()) {
      toast({
        title: "Almost there",
        description: "Please add your name and a few words about your experience.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.testimonials.submit({ name: name.trim(), eventType, rating, quote: quote.trim() });

      if (res.success) {
        setDone(true);
        toast({
          title: "Review received 💖",
          description: "Thank you for sharing your experience with B1touch Artistry.",
        });
        setName("");
        setQuote("");
        setRating(5);
        onSuccess?.();
        window.setTimeout(() => {
          onClose();
        }, 1400);
      } else {
        // Previously failed silently — surface the reason instead.
        toast({
          title: "We couldn't post that",
          description: res.error || "Please try again in a moment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1100] flex items-center justify-center overflow-y-auto p-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label="Share your review"
        >
          <div
            className="absolute inset-0 bg-[hsl(20_14%_3%_/_0.86)] backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 34, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="glass-strong relative w-full max-w-xl rounded-sm p-6 shadow-cinema sm:p-9"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold"
              aria-label="Close review form"
            >
              <X size={16} />
            </button>

            {done ? (
              <div className="flex flex-col items-center py-14 text-center">
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold"
                >
                  <Check className="h-7 w-7 text-primary-foreground" />
                </motion.span>
                <h3 className="mt-6 font-display text-2xl">Thank you</h3>
                <p className="mt-3 max-w-xs font-sans text-sm text-muted-foreground">
                  Your review is with the studio team for a final look before it goes live.
                </p>
              </div>
            ) : (
              <>
                <span className="eyebrow">Client feedback</span>
                <h3 className="mt-3 font-display text-3xl">Share your glam experience</h3>
                <p className="mt-3 font-sans text-sm text-muted-foreground">
                  Two minutes of your time helps the next queen choose with confidence.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  {/* Rating */}
                  <div>
                    <span className="field-label">Your rating *</span>
                    <div className="flex items-center gap-2.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onPointerEnter={() => setHoverRating(star)}
                          onPointerLeave={() => setHoverRating(0)}
                          className="transition-transform duration-300 ease-expo hover:scale-110"
                          aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        >
                          <Star
                            size={26}
                            className={`transition-colors duration-300 ${
                              (hoverRating || rating) >= star
                                ? "fill-gold text-gold"
                                : "text-muted-foreground/35"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 font-sans text-xs text-muted-foreground">
                        {rating} / 5
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="field-label" htmlFor="review-name">
                        Your name *
                      </label>
                      <input
                        id="review-name"
                        className="field"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="e.g. Chioma Adebayo"
                        required
                      />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="review-event">
                        Occasion
                      </label>
                      <select
                        id="review-event"
                        className="field appearance-none"
                        value={eventType}
                        onChange={(event) => setEventType(event.target.value)}
                      >
                        {EVENT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="review-quote">
                      Your experience *
                    </label>
                    <textarea
                      id="review-quote"
                      className="field resize-none"
                      rows={5}
                      required
                      value={quote}
                      onChange={(event) => setQuote(event.target.value)}
                      placeholder="Tell us about the look, how it held up through the day, and the studio experience…"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border/70 pt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Cancel
                    </button>
                    <button type="submit" disabled={submitting} className="btn btn-gold btn-sm shine">
                      {submitting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {submitting ? "Posting" : "Submit review"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ReviewModal;
