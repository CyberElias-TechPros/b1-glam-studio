import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { useToast } from '@/hooks/use-toast';

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
          title: 'Welcome back! ✨',
          description: 'Successfully authenticated to B1touch Admin Portal.',
        });
        navigate(from, { replace: true });
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 px-4">
        <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center mx-auto mb-4 shadow-lg">
          <ShieldCheck className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-foreground tracking-tight">
          B1touch Studio
        </h2>
        <p className="mt-2 text-xs font-sans uppercase tracking-[0.3em] text-primary">
          Management & Operations Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-card py-8 px-6 shadow-xl border border-border rounded-sm sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-sm text-destructive text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="admin@b1touchartistry.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-muted-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-secondary border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Quick Demo Pre-fill helper */}
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-sm">
              <p className="text-[11px] font-sans text-muted-foreground flex items-center gap-1.5 mb-1.5">
                <Sparkles size={12} className="text-primary" />
                <strong>Default Administrator Access:</strong>
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">
                Email: admin@b1touchartistry.com<br />
                Password: Admin123!@#
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-sans font-semibold tracking-wide bg-gradient-gold text-primary-foreground hover:opacity-90 transition-opacity rounded-sm shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Access Admin Dashboard
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
