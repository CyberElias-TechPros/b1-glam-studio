import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  DollarSign,
  Mail,
  Users,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Phone,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api, DashboardStats } from '@/lib/api';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.stats.get();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const kpis = stats?.kpis || {
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    totalInquiries: 0,
    unreadInquiries: 0,
    totalSubscribers: 0,
    totalReviews: 0,
    totalPosts: 0,
  };

  return (
    <AdminLayout
      title="Studio Overview"
      subtitle="Real-time performance metrics, client bookings, and inquiries."
      action={
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-sans font-medium bg-card border border-border hover:border-primary/40 rounded-sm text-foreground transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      }
    >
      <div className="space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Revenue */}
          <div className="p-6 bg-card border border-border rounded-sm hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-sans uppercase tracking-wider text-muted-foreground">
                Total Revenue
              </span>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <DollarSign size={18} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              ₦{kpis.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-green-500 mt-2 font-sans">
              <TrendingUp size={12} />
              <span>Confirmed & Completed value</span>
            </div>
          </div>

          {/* Pending Bookings */}
          <div className="p-6 bg-card border border-border rounded-sm hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-sans uppercase tracking-wider text-muted-foreground">
                Pending Bookings
              </span>
              <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Clock size={18} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              {kpis.pendingBookings}
            </div>
            <Link to="/admin/bookings?status=pending" className="text-[11px] text-primary hover:underline mt-2 block font-sans">
              Review requests →
            </Link>
          </div>

          {/* Confirmed Sessions */}
          <div className="p-6 bg-card border border-border rounded-sm hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-sans uppercase tracking-wider text-muted-foreground">
                Active Bookings
              </span>
              <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              {kpis.confirmedBookings}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 font-sans">
              {kpis.totalBookings} lifetime total
            </p>
          </div>

          {/* New Inquiries */}
          <div className="p-6 bg-card border border-border rounded-sm hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-sans uppercase tracking-wider text-muted-foreground">
                Unread Messages
              </span>
              <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Mail size={18} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              {kpis.unreadInquiries}
            </div>
            <Link to="/admin/inquiries?unread=true" className="text-[11px] text-primary hover:underline mt-2 block font-sans">
              Open inbox →
            </Link>
          </div>
        </div>

        {/* Recent Bookings & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bookings Table */}
          <div className="lg:col-span-2 bg-card border border-border rounded-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-serif font-semibold text-foreground">Recent Appointments</h3>
                <p className="text-xs text-muted-foreground">Latest client booking requests submitted.</p>
              </div>
              <Link
                to="/admin/bookings"
                className="text-xs font-sans font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {stats?.recentBookings && stats.recentBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground uppercase tracking-wider text-[10px]">
                      <th className="pb-3">Reference</th>
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {stats.recentBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="py-3.5 font-mono text-primary font-medium">{b.reference_code}</td>
                        <td className="py-3.5 font-semibold text-foreground">{b.name}</td>
                        <td className="py-3.5 text-muted-foreground">{b.service}</td>
                        <td className="py-3.5 text-muted-foreground">
                          {b.booking_date} · {b.booking_time}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              b.status === 'confirmed'
                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                : b.status === 'completed'
                                ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                : b.status === 'cancelled'
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground text-sm">
                <CalendarCheck className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                No bookings recorded yet.
              </div>
            )}
          </div>

          {/* Quick Management Shortcuts */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-sm p-6">
              <h3 className="text-lg font-serif font-semibold text-foreground mb-4">Quick Studio Tools</h3>
              <div className="space-y-3 font-sans text-xs">
                <Link
                  to="/admin/bookings"
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-sm hover:bg-secondary transition-colors"
                >
                  <span className="flex items-center gap-2 text-foreground">
                    <CalendarCheck size={16} className="text-primary" />
                    Manage Booking Schedule
                  </span>
                  <ArrowRight size={14} className="text-muted-foreground" />
                </Link>

                <Link
                  to="/admin/inquiries"
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-sm hover:bg-secondary transition-colors"
                >
                  <span className="flex items-center gap-2 text-foreground">
                    <Mail size={16} className="text-primary" />
                    Customer Inquiries ({kpis.unreadInquiries} unread)
                  </span>
                  <ArrowRight size={14} className="text-muted-foreground" />
                </Link>

                <Link
                  to="/admin/reviews"
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-sm hover:bg-secondary transition-colors"
                >
                  <span className="flex items-center gap-2 text-foreground">
                    <Star size={16} className="text-primary" />
                    Moderate Reviews ({kpis.totalReviews})
                  </span>
                  <ArrowRight size={14} className="text-muted-foreground" />
                </Link>

                <Link
                  to="/admin/subscribers"
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-sm hover:bg-secondary transition-colors"
                >
                  <span className="flex items-center gap-2 text-foreground">
                    <Users size={16} className="text-primary" />
                    Subscribers ({kpis.totalSubscribers})
                  </span>
                  <ArrowRight size={14} className="text-muted-foreground" />
                </Link>

                <Link
                  to="/admin/settings"
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-sm hover:bg-secondary transition-colors"
                >
                  <span className="flex items-center gap-2 text-foreground">
                    <Phone size={16} className="text-primary" />
                    Update Studio Phone & Hours
                  </span>
                  <ArrowRight size={14} className="text-muted-foreground" />
                </Link>
              </div>
            </div>

            {/* Cloudflare Architecture Banner */}
            <div className="p-6 bg-gradient-to-br from-primary/10 via-secondary to-card border border-primary/20 rounded-sm">
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary block mb-1">
                Cloudflare + Vercel Architecture
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                API running on Cloudflare Workers edge with D1 relational persistence and R2 media storage.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-primary font-medium">
                <CheckCircle2 size={14} /> Edge Runtime Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
