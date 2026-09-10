import { useState, useEffect } from 'react';
import { FileText, Plus, Edit2, Trash2, RefreshCw, Loader2, Sparkles, X, Check } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { api, BlogPostItem } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function AdminBlog() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Partial<BlogPostItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.blog.list('all');
      if (res.success && res.data) {
        setPosts(res.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openNewPost = () => {
    setEditingPost({
      title: '',
      slug: '',
      category: 'bridal',
      author: 'B1touch',
      excerpt: '',
      content: '',
      read_time: '5 min read',
      is_featured: 0,
    });
    setIsModalOpen(true);
  };

  const openEditPost = (post: BlogPostItem) => {
    setEditingPost({ ...post });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.content) {
      toast({ title: 'Title and content are required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      if (editingPost.id) {
        await api.blog.update(editingPost.id, editingPost);
        toast({ title: 'Blog post updated successfully' });
      } else {
        await api.blog.create(editingPost);
        toast({ title: 'Blog post published successfully' });
      }
      setIsModalOpen(false);
      fetchPosts();
    } catch {
      toast({ title: 'Save failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.blog.delete(id);
      toast({ title: 'Post deleted' });
      fetchPosts();
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' });
    }
  };

  return (
    <AdminLayout
      title="Blog & Articles"
      subtitle="Publish beauty tutorials, dark skin makeup advice, and editorial trend articles."
      action={
        <div className="flex gap-2">
          <button
            onClick={fetchPosts}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-xs font-sans font-medium bg-card border border-border hover:border-primary/40 rounded-sm text-foreground transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={openNewPost}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-semibold bg-gradient-gold text-primary-foreground rounded-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            New Article
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading articles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-card border border-border rounded-sm overflow-hidden flex flex-col justify-between hover:border-primary/40 transition-colors"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-sans uppercase font-bold tracking-wider bg-primary/10 text-primary">
                      {post.category}
                    </span>
                    {post.is_featured ? (
                      <span className="flex items-center gap-1 text-[10px] font-sans text-amber-500 font-semibold">
                        <Sparkles size={12} /> Featured
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-serif font-bold text-foreground text-base mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <div className="text-[10px] text-muted-foreground font-sans">
                    By {post.author} · {post.read_time}
                  </div>
                </div>

                <div className="p-4 border-t border-border bg-secondary/20 flex items-center justify-between text-xs font-sans">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View on Site →
                  </a>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditPost(post)}
                      className="p-1.5 text-muted-foreground hover:text-primary rounded hover:bg-secondary"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive rounded hover:bg-destructive/10"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && editingPost && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-card border border-border rounded-sm max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-xl font-serif font-bold text-foreground">
                {editingPost.id ? 'Edit Article' : 'Write New Article'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Title *</label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  placeholder="e.g. Flawless Foundation Techniques for Deep Melanin"
                  className="w-full px-3 py-2.5 bg-secondary border border-border rounded-sm text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Category</label>
                  <select
                    value={editingPost.category || 'tips'}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="bridal">Bridal</option>
                    <option value="events">Events</option>
                    <option value="tips">Tips</option>
                    <option value="dark-skin">Dark Skin</option>
                    <option value="tutorials">Tutorials</option>
                  </select>
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Read Time</label>
                  <input
                    type="text"
                    value={editingPost.read_time || '5 min read'}
                    onChange={(e) => setEditingPost({ ...editingPost, read_time: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="Short introductory summary for card listings..."
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Article Body (HTML/Markdown) *</label>
                <textarea
                  rows={10}
                  required
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="<p>Full article paragraphs...</p><h2>Key Techniques</h2>"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-sm text-foreground focus:outline-none focus:border-primary font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featCheck"
                  checked={!!editingPost.is_featured}
                  onChange={(e) => setEditingPost({ ...editingPost, is_featured: e.target.checked ? 1 : 0 })}
                  className="rounded text-primary focus:ring-primary"
                />
                <label htmlFor="featCheck" className="text-foreground cursor-pointer">
                  Feature this article at the top of the blog
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-gold text-primary-foreground font-semibold rounded-sm hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
