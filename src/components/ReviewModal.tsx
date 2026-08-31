import { useState } from 'react';
import { Star, X, Check, Loader2, Sparkles, Camera } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReviewModal({ isOpen, onClose, onSuccess }: ReviewModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState('Bridal');
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) {
      toast({
        title: 'Please fill in all fields',
        description: 'Your name and review text are required.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.testimonials.submit({
        name,
        eventType,
        rating,
        quote,
      });

      if (res.success) {
        toast({
          title: 'Review Submitted! 💖',
          description: 'Thank you for sharing your experience with B1touch Artistry.',
        });
        setName('');
        setQuote('');
        setRating(5);
        onClose();
        onSuccess?.();
      }
    } catch {
      toast({
        title: 'Submission failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-sm max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-widest text-primary block mb-1">
              Client Feedback
            </span>
            <h3 className="text-xl font-serif font-bold text-foreground">
              Share Your Glam Experience
            </h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          {/* Rating Stars */}
          <div>
            <label className="block text-muted-foreground mb-1.5 uppercase tracking-wider text-[10px]">
              Your Rating *
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-primary focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={22}
                    className={`transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground/40'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-semibold text-foreground">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chioma Adebayo"
                className="w-full px-3 py-2.5 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">
                Service / Occasion
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2.5 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="Traditional Wedding">Traditional Wedding</option>
                <option value="White Wedding">White Wedding</option>
                <option value="Owambe Guest">Owambe / Party Glam</option>
                <option value="Birthday Celebration">Birthday Glam</option>
                <option value="Editorial & Photoshoot">Editorial / Shoot</option>
                <option value="Makeup Masterclass">Makeup Masterclass</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">
              Your Review & Experience *
            </label>
            <textarea
              rows={4}
              required
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Tell us about your look, longevity in Lagos weather, compliments received, and customer care..."
              className="w-full px-3 py-2.5 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary resize-none text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-sans text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-gold text-primary-foreground font-semibold rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
