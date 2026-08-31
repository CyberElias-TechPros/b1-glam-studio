import { useState, useEffect } from 'react';
import { Mail, Search, Trash2, CheckCircle2, Clock, Phone, ExternalLink, RefreshCw, Loader2, MessageSquare } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api, Inquiry } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function AdminInquiries() {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.contact.list({
        unread: unreadOnly,
        search,
      });
      if (res.success && res.data) {
        setInquiries(res.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadOnly]);

  const handleToggleRead = async (inquiry: Inquiry) => {
    const newRead = !inquiry.is_read;
    try {
      await api.contact.update(inquiry.id, { is_read: newRead });
      fetchInquiries();
      if (selectedInquiry && selectedInquiry.id === inquiry.id) {
        setSelectedInquiry({ ...selectedInquiry, is_read: newRead ? 1 : 0 });
      }
    } catch {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.contact.delete(id);
      toast({ title: 'Message deleted' });
      setSelectedInquiry(null);
      fetchInquiries();
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' });
    }
  };

  const selectAndMarkRead = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    if (!inquiry.is_read) {
      api.contact.update(inquiry.id, { is_read: true }).then(() => fetchInquiries());
    }
  };

  return (
    <AdminLayout
      title="Client Inquiries"
      subtitle="Review messages, questions, and inquiries sent via the Contact page."
      action={
        <button
          onClick={fetchInquiries}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-sans font-medium bg-card border border-border hover:border-primary/40 rounded-sm text-foreground transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      }
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUnreadOnly(false)}
              className={`px-3 py-1.5 text-xs font-sans rounded-sm transition-all ${
                !unreadOnly ? 'bg-gradient-gold text-primary-foreground font-semibold' : 'bg-card text-muted-foreground'
              }`}
            >
              All Messages
            </button>
            <button
              onClick={() => setUnreadOnly(true)}
              className={`px-3 py-1.5 text-xs font-sans rounded-sm transition-all ${
                unreadOnly ? 'bg-gradient-gold text-primary-foreground font-semibold' : 'bg-card text-muted-foreground'
              }`}
            >
              Unread Only
            </button>
          </div>

          <div className="relative sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchInquiries()}
              placeholder="Search sender, message..."
              className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-sm text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* List & Detail Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inbox List */}
          <div className="lg:col-span-1 bg-card border border-border rounded-sm overflow-hidden h-[600px] flex flex-col">
            <div className="p-3 bg-secondary/40 border-b border-border text-xs font-sans text-muted-foreground font-semibold uppercase tracking-wider">
              Inbox ({inquiries.length})
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {loading ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
                  <p className="text-xs">Loading messages...</p>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs p-4">
                  No messages found.
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => selectAndMarkRead(inq)}
                    className={`p-4 cursor-pointer hover:bg-secondary/40 transition-colors ${
                      selectedInquiry?.id === inq.id ? 'bg-secondary/60 border-l-2 border-primary' : ''
                    } ${!inq.is_read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-foreground truncate max-w-[140px] font-medium">{inq.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">{inq.message}</p>
                    {!inq.is_read && (
                      <span className="inline-block mt-1.5 px-1.5 py-0.5 rounded text-[9px] bg-primary/20 text-primary font-bold uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-card border border-border rounded-sm p-6 sm:p-8 flex flex-col justify-between h-[600px]">
            {selectedInquiry ? (
              <div className="space-y-6 overflow-y-auto">
                <div className="flex items-start justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-foreground mb-1">{selectedInquiry.name}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-sans">
                      {selectedInquiry.email && (
                        <span>Email: <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:underline">{selectedInquiry.email}</a></span>
                      )}
                      {selectedInquiry.phone && (
                        <span>Phone: <a href={`tel:${selectedInquiry.phone}`} className="text-primary hover:underline">{selectedInquiry.phone}</a></span>
                      )}
                      <span>Received: {new Date(selectedInquiry.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedInquiry.id)}
                    className="p-2 text-muted-foreground hover:text-destructive rounded hover:bg-destructive/10 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="bg-secondary/30 p-6 rounded-sm border border-border/50 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedInquiry.message}
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                  {selectedInquiry.phone && (
                    <a
                      href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hi ${selectedInquiry.name}! This is B1touch Artistry responding to your message.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-xs font-sans font-semibold bg-[#25D366] text-white hover:opacity-90 rounded-sm inline-flex items-center gap-1.5"
                    >
                      <Phone size={14} /> Reply on WhatsApp
                    </a>
                  )}
                  {selectedInquiry.email && (
                    <a
                      href={`mailto:${selectedInquiry.email}?subject=Re: Inquiry with B1touch Artistry`}
                      className="px-4 py-2 text-xs font-sans font-semibold bg-gradient-gold text-primary-foreground hover:opacity-90 rounded-sm inline-flex items-center gap-1.5"
                    >
                      <Mail size={14} /> Reply via Email
                    </a>
                  )}
                  <button
                    onClick={() => handleToggleRead(selectedInquiry)}
                    className="px-4 py-2 text-xs font-sans font-medium bg-secondary text-foreground hover:bg-secondary/80 rounded-sm"
                  >
                    Mark as {selectedInquiry.is_read ? 'Unread' : 'Read'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-base font-serif">Select a message from the left to view</p>
                <p className="text-xs text-muted-foreground mt-1">Full customer inquiry details will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
