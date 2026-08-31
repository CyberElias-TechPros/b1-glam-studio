import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  Share2,
  Instagram,
  Facebook,
  ArrowRight,
  ChevronLeft,
  MessageCircle,
  Search,
  Send,
  Loader2,
  Sparkles,
  User,
} from "lucide-react";
import Layout from "@/components/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { GoldParticles } from "@/components/GoldParticles";
import { api, BlogPostItem } from "@/lib/api";
import { categories, blogPosts as fallbackBlogPosts } from "@/data/blog";
import { NewsletterForm } from "@/components/NewsletterForm";
import { useToast } from "@/hooks/use-toast";

// Blog Card Component
function BlogCard({ post, index }: { post: BlogPostItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/blog/${post.slug}`} className="block h-full">
        <article className="bg-card border border-border rounded-sm overflow-hidden h-full transition-all duration-300 hover:border-primary/50 hover:gold-glow flex flex-col justify-between">
          <div>
            {/* Featured Image placeholder */}
            <div className="relative h-48 sm:h-56 overflow-hidden bg-secondary">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl opacity-20">✦</span>
              </div>
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-xs font-sans font-medium uppercase tracking-wider bg-primary text-primary-foreground rounded-sm">
                  {categories.find((c) => c.id === post.category)?.label || post.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6">
              {/* Meta Info */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-sans">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(post.published_at || Date.now()).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.read_time}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-serif font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                {post.title}
              </h2>

              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6 pt-0 border-t border-border/50 flex items-center justify-between font-sans text-xs">
            <span className="text-muted-foreground">
              By <span className="text-primary font-medium">{post.author}</span>
            </span>
            <span className="inline-flex items-center font-medium text-primary group-hover:underline">
              Read More <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

// Featured Post Component
function FeaturedPost({ post }: { post: BlogPostItem }) {
  return (
    <section className="mb-16 sm:mb-20" aria-label="Featured Article">
      <AnimatedSection>
        <Link to={`/blog/${post.slug}`} className="block group">
          <article className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 bg-card border border-border rounded-sm overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-sm">
            {/* Image Side */}
            <div className="relative h-64 sm:h-80 lg:h-96 bg-secondary">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-20">✦</span>
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 text-xs font-sans font-semibold uppercase tracking-wider bg-gradient-gold text-primary-foreground rounded-sm shadow-sm">
                  Featured Article
                </span>
              </div>
            </div>

            {/* Content Side */}
            <div className="p-6 sm:p-10 lg:py-16 flex flex-col justify-center font-sans">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                <span className="px-2 py-0.5 text-xs font-medium uppercase tracking-wider bg-primary/10 text-primary rounded-sm">
                  {categories.find((c) => c.id === post.category)?.label || post.category}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <Calendar size={13} />
                  {new Date(post.published_at || Date.now()).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="w-1 h-1 rounded-full bg-primary" />
                <span className="flex items-center gap-1 text-xs">
                  <Clock size={13} />
                  {post.read_time}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                {post.title}
              </h2>

              <p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm text-muted-foreground">
                  By <span className="text-primary font-medium">{post.author}</span>
                </span>
                <span className="inline-flex items-center text-primary font-medium group-hover:underline text-sm">
                  Read Full Article <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-2" />
                </span>
              </div>
            </div>
          </article>
        </Link>
      </AnimatedSection>
    </section>
  );
}

// Social Share Component
function SocialShare({ title, slug }: { title: string; slug: string }) {
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : '';
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedTitle}%20${shareUrl}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: `https://instagram.com/b1touch_artistry`,
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-sans">
        <Share2 size={14} />
        Share:
      </span>
      <div className="flex gap-2">
        {shareLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
            aria-label={`Share on ${social.name}`}
          >
            <social.icon size={14} />
          </a>
        ))}
      </div>
    </div>
  );
}

// Individual Blog Post View
function BlogPostView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    async function loadPost() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.blog.get(slug);
        if (res.success && res.data) {
          setPost(res.data);
        } else {
          // Fallback
          const fb = fallbackBlogPosts.find((p) => p.slug === slug);
          if (fb) {
            setPost({
              id: fb.id,
              slug: fb.slug,
              title: fb.title,
              excerpt: fb.excerpt,
              content: fb.content,
              category: fb.category,
              author: fb.author,
              read_time: fb.readTime,
              is_featured: fb.isFeatured ? 1 : 0,
              published_at: fb.date,
              comments: [],
            });
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim() || !slug) return;

    setSubmittingComment(true);
    try {
      const res = await api.blog.addComment(slug, commentName, commentText, commentEmail);
      if (res.success && res.data) {
        toast({ title: "Comment Posted! ✨", description: "Thank you for contributing to the discussion." });
        setPost((prev) => {
          if (!prev) return prev;
          const comments = prev.comments ? [res.data, ...prev.comments] : [res.data];
          return { ...prev, comments };
        });
        setCommentName('');
        setCommentEmail('');
        setCommentText('');
      }
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-2xl font-serif font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-muted-foreground text-sm mb-6">The beauty article you are looking for does not exist or has been relocated.</p>
            <button
              onClick={() => navigate("/blog")}
              className="inline-flex items-center text-primary hover:underline font-sans text-sm"
            >
              <ChevronLeft size={16} className="mr-1" /> Back to Blog
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="min-h-screen pt-28 pb-16">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <AnimatedSection className="mb-8">
            <button
              onClick={() => navigate("/blog")}
              className="inline-flex items-center text-xs font-sans text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" /> Back to All Articles
            </button>
          </AnimatedSection>

          {/* Header */}
          <AnimatedSection delay={0.1}>
            <header className="mb-10 font-sans">
              <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
                <span className="px-3 py-1 font-medium uppercase tracking-wider bg-primary/10 text-primary rounded-sm">
                  {categories.find((c) => c.id === post.category)?.label || post.category}
                </span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar size={13} />
                  {new Date(post.published_at || Date.now()).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock size={13} />
                  {post.read_time}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight mb-6">
                {post.title}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                {post.excerpt}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                    <span className="text-primary-foreground font-serif font-bold text-sm">
                      {post.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{post.author}</p>
                    <p className="text-xs text-muted-foreground">Dark Skin Beauty Specialist</p>
                  </div>
                </div>
                <SocialShare title={post.title} slug={post.slug} />
              </div>
            </header>
          </AnimatedSection>

          {/* Featured Image placeholder */}
          <AnimatedSection delay={0.2}>
            <div className="relative h-64 sm:h-80 lg:h-96 bg-card border border-border rounded-sm overflow-hidden mb-12 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-20">✦</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Post Content */}
          <AnimatedSection delay={0.3}>
            <div
              className="blog-content prose prose-invert max-w-none text-muted-foreground text-sm sm:text-base leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </AnimatedSection>

          {/* Share Section */}
          <AnimatedSection delay={0.4} className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-foreground font-serif font-semibold">Enjoyed this article? Share it with friends!</p>
              <SocialShare title={post.title} slug={post.slug} />
            </div>
          </AnimatedSection>

          {/* Comments Section */}
          <section className="mt-16 pt-12 border-t border-border">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-6">
              Comments ({post.comments?.length || 0})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="p-6 bg-card border border-border rounded-sm space-y-4 mb-8 font-sans">
              <h4 className="text-sm font-semibold text-foreground">Leave a Comment</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="px-4 py-2.5 bg-secondary border border-border rounded-sm text-xs text-foreground focus:outline-none focus:border-primary"
                />
                <input
                  type="email"
                  placeholder="Your Email (optional)"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  className="px-4 py-2.5 bg-secondary border border-border rounded-sm text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <textarea
                rows={3}
                required
                placeholder="Write your comment or question..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-sm text-xs text-foreground focus:outline-none focus:border-primary resize-none"
              />
              <button
                type="submit"
                disabled={submittingComment}
                className="px-6 py-2.5 bg-gradient-gold text-primary-foreground font-semibold text-xs rounded-sm hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {submittingComment ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Post Comment
              </button>
            </form>

            {/* Existing Comments List */}
            <div className="space-y-4">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((c) => (
                  <div key={c.id} className="p-4 bg-card border border-border rounded-sm font-sans">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground text-xs">{c.author_name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{c.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground font-sans">No comments yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </section>
        </div>
      </article>
    </Layout>
  );
}

// Blog Listing Page
function BlogListing() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await api.blog.list(activeCategory, search);
      if (res.success && res.data && res.data.length > 0) {
        setPosts(res.data);
      } else {
        // Fallback
        let list = fallbackBlogPosts.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          category: p.category,
          author: p.author,
          read_time: p.readTime,
          is_featured: p.isFeatured ? 1 : 0,
          published_at: p.date,
        }));
        if (activeCategory !== 'all') {
          list = list.filter((p) => p.category === activeCategory);
        }
        if (search.trim()) {
          const s = search.toLowerCase();
          list = list.filter((p) => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s));
        }
        setPosts(list);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const featuredPost = posts.find((p) => p.is_featured);
  const postsToShow = activeCategory === "all" && featuredPost && !search
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts;

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        {/* Hero Section */}
        <section className="section-padding pb-8 relative">
          <GoldParticles count={15} className="opacity-50" />
          <div className="container-narrow mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-6">
                <span className="text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary mb-3 block">
                  Beauty & Inspiration
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-4">
                  The B1touch <span className="text-gradient-gold">Blog</span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans">
                  Expert advice, tutorials, and trend insights from Lagos' premier makeup artistry studio.
                  Celebrating melanin-rich skin beauty one look at a time.
                </p>
              </div>

              {/* Search Bar */}
              <div className="max-w-md mx-auto mb-10">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadPosts()}
                    placeholder="Search beauty tutorials, bridal advice..."
                    className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-sm text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors shadow-sm font-sans"
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Featured Post */}
        {activeCategory === "all" && featuredPost && !search && (
          <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
            <FeaturedPost post={featuredPost} />
          </div>
        )}

        {/* Category Filter */}
        <section className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs font-sans font-medium uppercase tracking-wider rounded-sm transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-gradient-gold text-primary-foreground font-semibold shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Blog Grid */}
        <section className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="py-20 text-center text-muted-foreground">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
              <p className="text-xs font-sans">Loading articles...</p>
            </div>
          ) : postsToShow.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postsToShow.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-sm max-w-md mx-auto">
              <p className="text-muted-foreground text-sm font-serif mb-2">No articles found</p>
              <p className="text-xs text-muted-foreground font-sans">Try selecting another category or clear your search query.</p>
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="mt-20">
          <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card border border-border rounded-sm p-8 sm:p-12 text-center relative overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <div className="relative z-10 max-w-xl mx-auto">
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-primary mb-2 block">
                  Join the VIP Glam Circle
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-3">
                  Never Miss a Beauty Tip
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6 font-sans leading-relaxed">
                  Subscribe to our monthly newsletter for seasonal bridal trends, skincare prep secrets, and exclusive discount codes.
                </p>
                <NewsletterForm source="blog_page" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

// Main Blog Component
export default function Blog() {
  const { slug } = useParams();
  if (slug) {
    return <BlogPostView />;
  }
  return <BlogListing />;
}
