import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Mail,
  Users,
  Star,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/blog', label: 'Journal', icon: FileText },
  { to: '/admin/subscribers', label: 'Subscribers', icon: Users },
  { to: '/admin/settings', label: 'Studio Settings', icon: Settings },
];

function NavLinkItem({
  item,
  index,
  active,
  onNavigate,
}: {
  item: (typeof navItems)[number];
  index: number;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={cn(
        'group relative flex items-center gap-3 py-2.5 pl-4 pr-3 font-sans text-[0.8125rem] tracking-[0.01em] transition-colors duration-500',
        active ? 'text-gold-light' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {/* Gold rail marks the room you're standing in */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-1 left-0 w-px transition-all duration-500 ease-expo',
          active ? 'bg-gradient-to-b from-transparent via-gold to-transparent' : 'bg-transparent group-hover:bg-border',
        )}
      />
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-0 -left-4 w-4 bg-[radial-gradient(60%_50%_at_0%_50%,hsl(40_62%_62%_/_0.16),transparent_70%)] transition-opacity duration-500',
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60',
        )}
      />
      <span className={cn('numeral w-4 text-[0.625rem]', active ? 'text-gold/80' : 'text-muted-foreground/50')}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <Icon size={15} className={active ? 'text-gold' : 'text-muted-foreground/70'} />
      <span className="flex-1 truncate">{item.label}</span>
      {active && <span className="h-1 w-1 rotate-45 bg-gold" aria-hidden />}
    </Link>
  );
}

export function AdminLayout({ children, title, subtitle, action }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const current = navItems.find((item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to),
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground md:flex">
      {/* Ambient studio light behind the whole console */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 top-1/4 h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,hsl(40_62%_62%_/_0.07),transparent_70%)]" />
        <div className="absolute inset-0 grain opacity-60" />
      </div>

      {/* Sidebar — desktop */}
      <aside className="relative z-10 hidden shrink-0 border-r border-border/70 bg-[hsl(24_12%_6%_/_0.9)] backdrop-blur-xl md:flex md:w-[262px] md:flex-col md:sticky md:top-0 md:h-screen">
        <div className="border-b border-border/70 px-6 py-6">
          <Link to="/admin" className="group block">
            <span className="display-md block text-[1.35rem] leading-none">
              B1touch <span className="display-italic text-gradient-gold">Studio</span>
            </span>
            <span className="eyebrow-muted mt-2 flex items-center gap-2 text-[0.5rem]">
              <ShieldCheck size={11} className="text-gold" />
              Operations Portal
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto py-5">
          <p className="eyebrow-muted mb-3 px-6 text-[0.5rem]">Studio</p>
          {navItems.map((item, i) => (
            <NavLinkItem
              key={item.to}
              item={item}
              index={i}
              active={item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)}
            />
          ))}
        </nav>

        <div className="border-t border-border/70 px-6 py-5">
          <p className="eyebrow-muted text-[0.5rem]">Signed in</p>
          <p className="mt-2 truncate font-sans text-[0.8125rem] text-foreground">
            {user?.name || 'Administrator'}
          </p>
          <p className="truncate font-sans text-[0.6875rem] text-muted-foreground">
            {user?.email || 'admin@b1touchartistry.com'}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Link
              to="/"
              className="btn btn-ghost btn-sm flex-1 justify-center"
              title="Open the live website"
            >
              Live site
              <ArrowUpRight size={12} />
            </Link>
            <button
              onClick={handleLogout}
              className="flex h-8 w-8 items-center justify-center border border-border/70 text-muted-foreground transition-colors duration-500 hover:border-destructive/40 hover:text-destructive"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Top bar — mobile */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border/70 bg-[hsl(24_12%_6%_/_0.94)] px-5 py-4 backdrop-blur-xl md:hidden">
        <Link to="/admin" className="flex items-baseline gap-2">
          <span className="display-md text-lg leading-none">B1touch</span>
          <span className="eyebrow-muted text-[0.5rem]">Portal</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex h-9 w-9 items-center justify-center border border-border/70 text-foreground"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
        </button>
      </div>

      {/* Drawer — mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="flex h-full w-[80%] max-w-xs flex-col justify-between border-r border-gold/20 bg-[hsl(24_12%_6%)] px-5 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <span className="display-md text-lg">
                  B1touch <span className="display-italic text-gradient-gold">Studio</span>
                </span>
                <button onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation">
                  <X size={17} className="text-muted-foreground" />
                </button>
              </div>
              <nav className="mt-4 space-y-0.5">
                {navItems.map((item, i) => (
                  <NavLinkItem
                    key={item.to}
                    item={item}
                    index={i}
                    active={item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)}
                    onNavigate={() => setMobileMenuOpen(false)}
                  />
                ))}
              </nav>
            </div>
            <div className="border-t border-border/70 pt-5">
              <p className="eyebrow-muted text-[0.5rem]">Signed in</p>
              <p className="mt-1 truncate font-sans text-sm">{user?.name || 'Administrator'}</p>
              <button
                onClick={handleLogout}
                className="mt-4 flex w-full items-center gap-2 border border-destructive/30 px-3 py-2 font-sans text-xs uppercase tracking-[0.18em] text-destructive"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border/70 bg-[hsl(24_12%_6%_/_0.6)] px-5 py-7 backdrop-blur-xl sm:px-8 sm:py-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold/50" aria-hidden />
                <span className="eyebrow">{current?.label || 'Studio'}</span>
              </div>
              <h1 className="display-md mt-3 text-[1.75rem] leading-[1.05] sm:text-[2.25rem]">{title}</h1>
              {subtitle && (
                <p className="mt-2 max-w-2xl font-sans text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
          </div>
        </header>

        <main className="flex-1 px-5 py-8 sm:px-8 sm:py-10">{children}</main>

        <footer className="border-t border-border/70 px-5 py-5 sm:px-8">
          <p className="eyebrow-muted text-[0.5rem]">
            B1touch Artistry · Studio console · Addo Road, Ajah, Lagos
          </p>
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;
