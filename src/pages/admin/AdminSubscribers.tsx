import { useState, useEffect } from 'react';
import { Users, Download, Search, RefreshCw, Loader2, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api, Subscriber } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function AdminSubscribers() {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await api.newsletter.list();
      if (res.success && res.data) {
        setSubscribers(res.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      toast({ title: 'No subscribers to export' });
      return;
    }

    const headers = ['Email', 'Source', 'Status', 'Date Subscribed'];
    const rows = subscribers.map((s) => [
      s.email,
      s.source || 'website',
      s.is_active ? 'Active' : 'Inactive',
      new Date(s.created_at).toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `b1touch-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Subscriber list exported to CSV! 📥' });
  };

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Newsletter Subscribers"
      subtitle="Manage audience subscriptions, email reach, and export subscriber lists."
      action={
        <div className="flex gap-2">
          <button
            onClick={fetchSubscribers}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-xs font-sans font-medium bg-card border border-border hover:border-primary/40 rounded-sm text-foreground transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-semibold bg-gradient-gold text-primary-foreground rounded-sm hover:opacity-90 transition-opacity"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground font-sans">
            Total Audience: <strong className="text-foreground">{subscribers.length}</strong> subscribed users
          </div>
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email..."
              className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-sm text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-muted-foreground">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
              <p className="text-xs">Loading subscribers...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-serif">No subscribers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-secondary/40 border-b border-border text-muted-foreground uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Channel / Source</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Subscribed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-foreground">{s.email}</td>
                      <td className="py-3.5 px-4 capitalize text-muted-foreground">{s.source || 'Website Footer'}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-green-500 font-semibold text-[10px]">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-muted-foreground">
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
