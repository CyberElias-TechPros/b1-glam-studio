import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Loader2, Check } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api, StudioSettings } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<StudioSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.settings.get();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.settings.update(settings as Record<string, string>);
      toast({
        title: 'Settings Saved',
        description: 'Studio contact and operation settings updated successfully.',
      });
    } catch {
      toast({ title: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Studio Configuration"
      subtitle="Manage studio contact details, physical address, business hours, and social media handles."
    >
      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading studio settings...</p>
          </div>
        ) : (
          <>
            {/* General Info */}
            <div className="p-6 bg-card border border-border rounded-sm space-y-4">
              <h3 className="text-base font-serif font-semibold text-foreground">General Studio Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Studio Brand Name</label>
                  <input
                    type="text"
                    value={settings.studio_name || ''}
                    onChange={(e) => handleChange('studio_name', e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Brand Tagline</label>
                  <input
                    type="text"
                    value={settings.studio_tagline || ''}
                    onChange={(e) => handleChange('studio_tagline', e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="p-6 bg-card border border-border rounded-sm space-y-4">
              <h3 className="text-base font-serif font-semibold text-foreground">Contact & Location</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Studio Phone / Display</label>
                  <input
                    type="text"
                    value={settings.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">WhatsApp Number (digits only)</label>
                  <input
                    type="text"
                    value={settings.whatsapp || ''}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Contact Email</label>
                  <input
                    type="email"
                    value={settings.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Studio Physical Address</label>
                  <input
                    type="text"
                    value={settings.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="p-6 bg-card border border-border rounded-sm space-y-4">
              <h3 className="text-base font-serif font-semibold text-foreground">Studio Operating Hours</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Monday – Saturday Hours</label>
                  <input
                    type="text"
                    value={settings.hours_weekday || ''}
                    onChange={(e) => handleChange('hours_weekday', e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Sunday Hours</label>
                  <input
                    type="text"
                    value={settings.hours_sunday || ''}
                    onChange={(e) => handleChange('hours_sunday', e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-6 bg-card border border-border rounded-sm space-y-4">
              <h3 className="text-base font-serif font-semibold text-foreground">Social Profiles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Instagram URL</label>
                  <input
                    type="text"
                    value={settings.instagram || ''}
                    onChange={(e) => handleChange('instagram', e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Facebook URL</label>
                  <input
                    type="text"
                    value={settings.facebook || ''}
                    onChange={(e) => handleChange('facebook', e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-gradient-gold text-primary-foreground font-sans font-semibold rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2 shadow-md"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Studio Settings
              </button>
            </div>
          </>
        )}
      </form>
    </AdminLayout>
  );
}
