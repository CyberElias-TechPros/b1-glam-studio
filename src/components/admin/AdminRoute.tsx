import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { Loader2 } from 'lucide-react';

/**
 * Gate for the staff console.
 *
 * The redirect is issued imperatively, once per mount, instead of rendering
 * `<Navigate>` on every pass: a route that is mid-transition can re-render for
 * a while after it has navigated, and a declarative redirect there would fire
 * again and again — a loop, not a lock-out.
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirected = useRef(false);

  useEffect(() => {
    if (isLoading || isAuthenticated || redirected.current) return;
    if (location.pathname === '/admin/login') return;

    redirected.current = true;
    navigate('/admin/login', { replace: true, state: { from: location } });
  }, [isAuthenticated, isLoading, location, navigate]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-sans">
            {isLoading ? 'Verifying authorization...' : 'Opening the studio console...'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default AdminRoute;
