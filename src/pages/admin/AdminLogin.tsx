import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowUpRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { useToast } from '@/hooks/use-toast';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [email, setEmail] = useState('admin@b1touchartistry.com');
  const [password, setPassword] = useState('Admin123!@#');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        toast({
          title: 'Welcome back',
          description: 'You are signed in to the B1touch studio console.',
        });
        navigate(from, { replace: true });
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      {/* Cinematic backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,hsl(40_62%_62%_/_0.14),transparent_60%)]" />
        <div className="absolute -left-32 bottom-0 h-[55vh] w-[55vh] rounded-full bg-[radial-gradient(circle,hsl(344_34%_24%_/_0.35),transparent_70%)]" />
        <div className="absolute inset-0 grain" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE }}
        className="w-full max-w-[27rem]"
      >
        <div className="mb-7 flex items-center gap-3">
          <span className="h-px w-10 bg-gold/50" aria-hidden />
          <span className="eyebrow">Studio console</span>
        </div>

        <div className="relative border border-gold/15 bg-[hsl(24_12%_6%_/_0.82)] p-8 backdrop-blur-xl sm:p-10">
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          <div className="flex items-center gap-2 text-gold">
            <ShieldCheck size={15} />
            <span className="eyebrow-muted text-[0.5rem]">Restricted access</span>
          </div>

          <h2 className="display-md mt-5 text-[1.9rem] leading-none">
            B1touch <span className="display-italic text-gradient-gold">Studio</span>
          </h2>
          <p className="mt-3 font-sans text-[0.8125rem] leading-relaxed text-muted-foreground">
            Sign in to manage bookings, enquiries, reviews and the journal.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 font-sans text-xs text-destructive">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="admin-email"
                className="eyebrow-muted mb-2 block text-[0.5rem]"
              >
                Email address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field pl-10"
                  placeholder="admin@b1touchartistry.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="eyebrow-muted mb-2 block text-[0.5rem]"
              >
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold shine w-full justify-center disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Signing in
                </>
              ) : (
                <>
                  Enter the console
                  <ArrowUpRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 border-t border-border/70 pt-5">
            <p className="eyebrow-muted text-[0.5rem]">Default administrator</p>
            <p className="mt-2 font-sans text-[0.6875rem] leading-relaxed text-muted-foreground">
              admin@b1touchartistry.com
              <br />
              Admin123!@#
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 font-sans text-[0.6875rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-500 hover:text-gold-light"
        >
          <ArrowLeft size={12} />
          Return to the studio website
        </Link>
      </motion.div>
    </div>
  );
}
