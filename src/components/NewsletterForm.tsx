import { useState } from 'react';
import { Mail, Check, Loader2, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface NewsletterFormProps {
  source?: string;
  className?: string;
}

export function NewsletterForm({ source = 'website', className = '' }: NewsletterFormProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.newsletter.subscribe(email, source);
      if (res.success) {
        setSubscribed(true);
        toast({
          title: 'Subscribed to B1touch Beauty Newsletter! ✨',
          description: 'Thank you for joining our exclusive beauty community.',
        });
        setEmail('');
      }
    } catch {
      toast({
        title: 'Subscription failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (subscribed) {
    return (
      <div className={`p-4 bg-primary/10 border border-primary/30 rounded-sm text-center ${className}`}>
        <p className="text-xs font-sans font-semibold text-primary flex items-center justify-center gap-1.5">
          <Check size={14} /> You're on the VIP list! Check your inbox for updates.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 max-w-md mx-auto ${className}`}>
      <div className="relative flex-1">
        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-sm text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-3 bg-gradient-gold text-primary-foreground font-sans font-semibold text-xs uppercase tracking-wider rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center justify-center gap-1.5 shrink-0"
      >
        {submitting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        Subscribe
      </button>
    </form>
  );
}
