import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface NewsletterFormProps {
  source?: string;
  className?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterForm({ source = "website", className = "" }: NewsletterFormProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();

    if (!EMAIL_PATTERN.test(value)) {
      toast({
        title: "Check that email",
        description: "It looks like there's a typo — we need a valid address to send beauty notes.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.newsletter.subscribe(value, source);
      if (res.success) {
        setSubscribed(true);
        toast({
          title: "You're on the list",
          description: "Welcome to the B1touch beauty circle.",
        });
        setEmail("");
      } else {
        toast({
          title: "Subscription failed",
          description: res.error || "Please try again in a moment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (subscribed) {
    return (
      <div
        className={`flex items-center gap-3 rounded-sm border border-gold/30 bg-gold/[0.07] px-5 py-4 ${className}`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-gold">
          <Check size={15} className="text-primary-foreground" />
        </span>
        <p className="font-sans text-sm text-foreground/90">
          You're on the VIP list — watch your inbox for the next drop.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="relative flex-1">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="your@email.com"
            aria-label="Email address"
            className="field h-full pr-4"
          />
        </div>
        <button type="submit" disabled={submitting} className="btn btn-gold shine sm:w-auto">
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          {submitting ? "Joining" : "Subscribe"}
        </button>
      </div>
    </form>
  );
}

export default NewsletterForm;
