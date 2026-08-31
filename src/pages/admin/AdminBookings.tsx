import { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Instagram,
  MapPin,
  MessageSquare,
  Trash2,
  Loader2,
  RefreshCw,
  ExternalLink,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api, Booking } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function AdminBookings() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [servicePrice, setServicePrice] = useState<number>(0);
  const [updating, setUpdating] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.bookings.list({
        status: statusFilter,
        search,
      });
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await api.bookings.updateStatus(id, newStatus);
      if (res.success) {
        toast({
          title: 'Status Updated',
          description: `Booking is now marked as ${newStatus}.`,
        });
        fetchBookings();
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus as Booking['status'] });
        }
      }
    } catch {
      toast({
        title: 'Update failed',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!selectedBooking) return;
    setUpdating(true);
    try {
      const res = await api.bookings.updateStatus(
        selectedBooking.id,
        selectedBooking.status,
        adminNotes,
        servicePrice
      );
      if (res.success) {
        toast({
          title: 'Booking Saved',
          description: 'Price and internal notes updated.',
        });
        fetchBookings();
        setSelectedBooking({
          ...selectedBooking,
          admin_notes: adminNotes,
          service_price: servicePrice,
        });
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking permanently?')) return;
    try {
      await api.bookings.delete(id);
      toast({ title: 'Booking deleted' });
      setSelectedBooking(null);
      fetchBookings();
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' });
    }
  };

  const openDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setAdminNotes(booking.admin_notes || '');
    setServicePrice(booking.service_price || 0);
  };

  return (
    <AdminLayout
      title="Appointment Bookings"
      subtitle="Track customer glam requests, update schedule status, and manage client details."
      action={
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-sans font-medium bg-card border border-border hover:border-primary/40 rounded-sm text-foreground transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      }
    >
      <div className="space-y-6">
        {/* Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-card p-1 border border-border rounded-sm">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 text-xs font-sans capitalize rounded-sm transition-all ${
                  statusFilter === tab
                    ? 'bg-gradient-gold text-primary-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, code..."
                className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-sm text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 text-xs font-sans font-medium bg-secondary text-foreground hover:bg-primary/20 rounded-sm transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Bookings Table */}
        <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-muted-foreground">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
              <p className="text-xs font-sans">Loading appointments...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <CalendarCheck className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-serif">No bookings found</p>
              <p className="text-xs text-muted-foreground mt-1">Try selecting a different status or clear search filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-secondary/40 border-b border-border text-muted-foreground uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Ref Code</th>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Phone / WhatsApp</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => openDetails(b)}
                      className="hover:bg-secondary/30 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-primary">{b.reference_code}</td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">{b.name}</td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        <a
                          href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          <Phone size={12} className="text-green-500" />
                          {b.phone}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-foreground">{b.service}</td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {b.booking_date} · {b.booking_time}
                      </td>
                      <td className="py-3.5 px-4 capitalize">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${b.location_type === 'home' ? 'bg-amber-500/10 text-amber-500' : 'bg-secondary text-muted-foreground'}`}>
                          {b.location_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        ₦{(b.service_price || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          disabled={updating}
                          className={`text-[11px] font-semibold uppercase tracking-wider rounded px-2 py-1 bg-secondary border border-border focus:outline-none focus:border-primary ${
                            b.status === 'confirmed'
                              ? 'text-green-500'
                              : b.status === 'completed'
                              ? 'text-blue-500'
                              : b.status === 'cancelled'
                              ? 'text-red-500'
                              : 'text-amber-500'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openDetails(b)}
                          className="p-1.5 text-muted-foreground hover:text-primary rounded hover:bg-secondary transition-colors mr-1"
                          title="View Details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive rounded hover:bg-destructive/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-card border border-border rounded-sm max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-widest text-primary block mb-1">
                  Booking Dossier
                </span>
                <h3 className="text-xl font-serif font-bold text-foreground">
                  {selectedBooking.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-muted-foreground hover:text-foreground rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Core Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-3 bg-secondary/50 rounded-sm">
                <span className="text-muted-foreground block mb-1">Reference Code</span>
                <span className="font-mono text-primary font-bold text-sm">{selectedBooking.reference_code}</span>
              </div>
              <div className="p-3 bg-secondary/50 rounded-sm">
                <span className="text-muted-foreground block mb-1">Status</span>
                <select
                  value={selectedBooking.status}
                  onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value)}
                  className="font-bold text-xs uppercase bg-transparent text-foreground focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="p-3 bg-secondary/50 rounded-sm">
                <span className="text-muted-foreground block mb-1">Service</span>
                <span className="font-semibold text-foreground">{selectedBooking.service}</span>
              </div>
              <div className="p-3 bg-secondary/50 rounded-sm">
                <span className="text-muted-foreground block mb-1">Schedule</span>
                <span className="font-semibold text-foreground">{selectedBooking.booking_date} @ {selectedBooking.booking_time}</span>
              </div>
              <div className="p-3 bg-secondary/50 rounded-sm">
                <span className="text-muted-foreground block mb-1">Phone / WhatsApp</span>
                <a
                  href={`https://wa.me/${selectedBooking.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-green-500 hover:underline flex items-center gap-1"
                >
                  <Phone size={12} /> {selectedBooking.phone}
                </a>
              </div>
              <div className="p-3 bg-secondary/50 rounded-sm">
                <span className="text-muted-foreground block mb-1">Instagram</span>
                <span className="font-semibold text-foreground">{selectedBooking.instagram || 'None provided'}</span>
              </div>
            </div>

            {/* Location & Notes */}
            <div className="space-y-3 text-xs font-sans">
              {selectedBooking.address && (
                <div className="p-3 bg-secondary/30 rounded-sm">
                  <span className="text-muted-foreground block mb-1">Client Address (Home Service)</span>
                  <p className="text-foreground">{selectedBooking.address}</p>
                </div>
              )}
              {selectedBooking.notes && (
                <div className="p-3 bg-secondary/30 rounded-sm">
                  <span className="text-muted-foreground block mb-1">Customer Special Requests & Notes</span>
                  <p className="text-foreground">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            {/* Editable Pricing and Internal Staff Notes */}
            <div className="space-y-4 pt-4 border-t border-border text-xs font-sans">
              <div>
                <label className="text-muted-foreground block mb-1">Service Price (₦)</label>
                <input
                  type="number"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-muted-foreground block mb-1">Internal Staff Notes</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes on deposits, skin allergy details, glam artist assignment..."
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <a
                href={`https://wa.me/${selectedBooking.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hi ${selectedBooking.name}! This is B1touch Artistry regarding your booking (${selectedBooking.reference_code}) for ${selectedBooking.service} on ${selectedBooking.booking_date}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-sans font-medium bg-[#25D366] text-white hover:opacity-90 rounded-sm inline-flex items-center gap-1.5"
              >
                Chat on WhatsApp
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 text-xs font-sans text-muted-foreground hover:text-foreground rounded-sm"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveDetails}
                  disabled={updating}
                  className="px-5 py-2 text-xs font-sans font-semibold bg-gradient-gold text-primary-foreground rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-1"
                >
                  {updating ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
