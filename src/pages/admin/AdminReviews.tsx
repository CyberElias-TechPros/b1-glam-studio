import { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api, Testimonial } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function AdminReviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.testimonials.listAdmin(statusFilter);
      if (res.success && res.data) {
        setReviews(res.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleUpdate = async (id: string, payload: { status?: 'approved' | 'pending' | 'rejected'; is_featured?: boolean }) => {
    try {
      const res = await api.testimonials.update(id, payload);
      if (res.success) {
        toast({ title: 'Review updated' });
        fetchReviews();
      }
    } catch {
      toast({ title: 'Failed to update review', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.testimonials.delete(id);
      toast({ title: 'Review deleted' });
      fetchReviews();
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' });
    }
  };

  return (
    <AdminLayout
      title="Client Reviews & Testimonials"
      subtitle="Moderate customer feedback, approve new reviews, and manage featured client quotes."
      action={
        <button
          onClick={fetchReviews}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-sans font-medium bg-card border border-border hover:border-primary/40 rounded-sm text-foreground transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      }
    >
      <div className="space-y-6">
        {/* Status Filters */}
        <div className="flex gap-2">
          {['all', 'approved', 'pending', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 text-xs font-sans capitalize rounded-sm transition-all ${
                statusFilter === status
                  ? 'bg-gradient-gold text-primary-foreground font-semibold shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="py-16 text-center text-muted-foreground">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading client reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground bg-card border border-border rounded-sm">
            <Star className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-serif">No reviews found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className={`p-6 bg-card border rounded-sm flex flex-col justify-between transition-all ${
                  rev.is_featured ? 'border-primary shadow-md' : 'border-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-primary text-primary" />
                      ))}
                    </div>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                        rev.status === 'approved'
                          ? 'bg-green-500/10 text-green-500'
                          : rev.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>

                  <p className="text-sm text-foreground italic leading-relaxed mb-4">
                    "{rev.quote}"
                  </p>

                  <div className="text-xs font-sans">
                    <p className="font-semibold text-foreground">{rev.name}</p>
                    <p className="text-muted-foreground">{rev.event_type}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-sans">
                  <button
                    onClick={() => handleUpdate(rev.id, { is_featured: !rev.is_featured })}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                      rev.is_featured
                        ? 'bg-primary/20 text-primary font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Sparkles size={12} />
                    {rev.is_featured ? 'Featured on Home' : 'Feature'}
                  </button>

                  <div className="flex gap-2">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdate(rev.id, { status: 'approved' })}
                        className="p-1.5 text-green-500 hover:bg-green-500/10 rounded transition-colors"
                        title="Approve Review"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdate(rev.id, { status: 'rejected' })}
                        className="p-1.5 text-amber-500 hover:bg-amber-500/10 rounded transition-colors"
                        title="Reject Review"
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
