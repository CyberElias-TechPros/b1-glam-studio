import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Clock,
  Facebook,
  Instagram,
  Loader2,
  MessageCircle,
  Search,
  Send,
  Share2,
} from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { api, BlogPostItem } from "@/lib/api";
import { blogPosts as fallbackBlogPosts, categories } from "@/data/blog";
import { getImages, shuffledImages, sourcesFor } from "@/lib/portfolioImages";
import {
  Magnetic,
  Ornament,
  Reveal,
  RevealMedia,
  SectionIndex,
  SplitText,
} from "@/components/motion/Reveal";

/* ───────────────────────── helpers ───────────────────────── */

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) % 100000;
  return hash;
}

/** Editorial art direction: articles inherit studio photography when no cover is set. */
function coverFor(post: { slug: string; featured_image?: string | null }) {
  const cover = post.featured_image;
  if (cover && !cover.includes("placeholder")) return cover;
  return shuffledImages[hashString(post.slug) % shuffledImages.length];
}

function categoryLabel(id: string) {
  return categories.find((category) => category.id === id)?.label || id;
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/* ───────────────────────── cards ───────────────────────── */

function PostCard({ post, index }: { post: BlogPostItem; index: number }) {
  return (
    <Reveal variant="up" delay={Math.min(index, 6) * 0.07}>
      <article className="group h-full">
        <Link to={`/blog/${post.slug}`} className="flex h-full flex-col" data-cursor="view" data-cursor-label="Read">
          <div className="overflow-hidden rounded-sm">
            <RevealMedia
              src={coverFor(post)}
              alt={post.title}
              ratio="16 / 11"
              parallax={12}
              className="rounded-sm"
            />
          </div>
          <div className="flex flex-1 flex-col pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="eyebrow">{categoryLabel(post.category)}</span>
              <span className="font-sans text-[0.6875rem] text-muted-foreground">
                {formatDate(post.published_at)}
              </span>
            </div>
            <h3 className="mt-4 font-display text-2xl leading-snug transition-colors duration-500 group-hover:text-gold-light">
              {post.title}
            </h3>
            <p className="mt-3 flex-1 font-sans text-sm leading-[1.85] text-muted-foreground">
              {post.excerpt}
            </p>
            <span className="mt-5 flex items-center gap-2 font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-gold-light">
              <Clock size={12} /> {post.read_time || "4 min read"}
            </span>
          </div>
        </Link>
      </article>
    </Reveal>
  );
}

function FeaturedPost({ post }: { post: BlogPostItem }) {
  return (
    <Reveal variant="up">
      <article className="group">
        <Link
          to={`/blog/${post.slug}`}
          className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14"
          data-cursor="view"
          data-cursor-label="Read"
        >
          <div className="overflow-hidden rounded-sm">
            <RevealMedia src={coverFor(post)} alt={post.title} ratio="16 / 10" parallax={18} className="rounded-sm" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="rounded-full border border-gold/40 px-3 py-1 font-sans text-[0.5625rem] uppercase tracking-[0.2em] text-gold-light">
                Featured
              </span>
              <span className="eyebrow">{categoryLabel(post.category)}</span>
            </div>
            <h2 className="mt-6 font-display text-[2rem] leading-[1.15] transition-colors duration-500 group-hover:text-gold-light sm:text-[2.6rem]">
              {post.title}
            </h2>
            <p className="mt-5 font-sans text-sm leading-[1.9] text-muted-foreground">{post.excerpt}</p>
            <div className="mt-7 flex items-center gap-5 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar size={12} className="text-gold" /> {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={12} className="text-gold" /> {post.read_time || "4 min read"}
              </span>
            </div>
          </div>
        </Link>
      </article>
    </Reveal>
  );
}

/* ───────────────────────── share ───────────────────────── */

function SocialShare({ title, slug }: { title: string; slug: string }) {
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : "";
  const encoded = `${encodeURIComponent(title)}%20${shareUrl}`;

  const links = [
    { name: "WhatsApp", icon: MessageCircle, url: `https://wa.me/?text=${encoded}` },
    { name: "Facebook", icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/b1touchartistry" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-2 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
        <Share2 size={13} className="text-gold" /> Share
      </span>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-all duration-500 hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold"
        >
          <link.icon size={14} />
        </a>
      ))}
    </div>
  );
}

/* ───────────────────────── article ───────────────────────── */

function ArticleView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.blog.get(slug);
        if (!cancelled && res.success && res.data) {
          setPost(res.data);
        } else {
          const fallback = fallbackBlogPosts.find((entry) => entry.slug === slug);
          if (!cancelled) {
            setPost(
              fallback
                ? {
                    id: fallback.id,
                    slug: fallback.slug,
                    title: fallback.title,
                    excerpt: fallback.excerpt,
                    content: fallback.content,
                    category: fallback.category,
                    author: fallback.author,
                    featured_image: fallback.featuredImage,
                    read_time: fallback.readTime,
                    is_featured: fallback.isFeatured ? 1 : 0,
                    published_at: fallback.date,
                    comments: [],
                  }
                : null
            );
          }
        }
      } catch {
        const fallback = fallbackBlogPosts.find((entry) => entry.slug === slug);
        if (!cancelled && fallback) {
          setPost({
            id: fallback.id,
            slug: fallback.slug,
            title: fallback.title,
            excerpt: fallback.excerpt,
            content: fallback.content,
            category: fallback.category,
            author: fallback.author,
            featured_image: fallback.featuredImage,
            read_time: fallback.readTime,
            is_featured: fallback.isFeatured ? 1 : 0,
            published_at: fallback.date,
            comments: [],
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const related = useMemo(() => {
    if (!post) return [] as BlogPostItem[];
    return fallbackBlogPosts
      .filter((entry) => entry.slug !== post.slug)
      .slice(0, 3)
      .map((entry, index) => ({
        id: entry.id,
        slug: entry.slug,
        title: entry.title,
        excerpt: entry.excerpt,
        content: entry.content,
        category: entry.category,
        author: entry.author,
        featured_image: entry.featuredImage,
        read_time: entry.readTime,
        is_featured: entry.isFeatured ? 1 : 0,
        published_at: entry.date,
        comments: [],
      })) as BlogPostItem[];
  }, [post]);

  const handleComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!slug) return;

    if (!commentName.trim() || !commentText.trim()) {
      toast({
        title: "Add your name and comment",
        description: "Both fields are needed before we can post your thoughts.",
        variant: "destructive",
      });
      return;
    }

    setPosting(true);
    try {
      const res = await api.blog.addComment(slug, commentName.trim(), commentText.trim(), commentEmail.trim());
      if (res.success && res.data) {
        toast({ title: "Comment posted", description: "Thanks for joining the conversation." });
        setPost((previous) => {
          if (!previous) return previous;
          return { ...previous, comments: [res.data!, ...(previous.comments || [])] };
        });
        setCommentName("");
        setCommentEmail("");
        setCommentText("");
      } else {
        toast({
          title: "Comment not posted",
          description: res.error || "Please try again in a moment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Comment not posted",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[70vh] items-center justify-center pt-32">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-7 w-7 animate-spin text-gold" />
            <span className="eyebrow-muted">Opening the journal</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <section className="flex min-h-[80vh] items-center pt-32 pb-20">
          <div className="shell-tight text-center">
            <Ornament className="mx-auto mb-8 max-w-xs" />
            <h1 className="display-md">That article has moved</h1>
            <p className="lede mx-auto mt-5 max-w-md text-center">
              The piece you're looking for doesn't exist any more — the journal is still worth a browse.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link to="/blog" className="btn btn-gold">
                <ArrowLeft size={14} /> Back to the journal
              </Link>
              <Link to="/booking" className="btn btn-outline">
                Book a session
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* HERO */}
      <article>
        <header className="relative isolate overflow-hidden pb-12 pt-36 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_20%_0%,hsl(40_62%_62%_/_0.12),transparent_60%)]" />
          <div className="shell-tight">
            <Reveal variant="fade">
              <button
                onClick={() => navigate("/blog")}
                className="link-draw inline-flex items-center gap-2 font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold-light"
              >
                <ArrowLeft size={13} /> All articles
              </button>
            </Reveal>

            <Reveal variant="fade" delay={0.08}>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <span className="eyebrow">{categoryLabel(post.category)}</span>
                <span className="flex items-center gap-2 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
                  <Calendar size={12} className="text-gold" /> {formatDate(post.published_at)}
                </span>
                <span className="flex items-center gap-2 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
                  <Clock size={12} className="text-gold" /> {post.read_time || "4 min read"}
                </span>
              </div>
            </Reveal>

            <SplitText
              as="h1"
              text={post.title}
              className="display-md mt-6 max-w-[26ch]"
              delay={0.2}
              stagger={0.035}
            />

            {post.excerpt && (
              <Reveal variant="up" delay={0.5}>
                <p className="lede mt-7 max-w-2xl">{post.excerpt}</p>
              </Reveal>
            )}

            <Reveal variant="fade" delay={0.6}>
              <div className="mt-9 border-t border-border/70 pt-6">
                <SocialShare title={post.title} slug={post.slug} />
              </div>
            </Reveal>
          </div>
        </header>

        <Reveal variant="up" delay={0.15}>
          <div className="shell-tight">
            <RevealMedia
              src={coverFor(post)}
              alt={post.title}
              ratio="16 / 9"
              parallax={20}
              className="rounded-sm"
            />
          </div>
        </Reveal>

        {/* BODY */}
        <section className="py-16 sm:py-20">
          <div className="shell">
            <Reveal variant="fade">
              <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            </Reveal>

            <div className="mx-auto mt-14 flex max-w-3xl flex-col gap-6 border-t border-border/70 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <SocialShare title={post.title} slug={post.slug} />
              <button
                onClick={() => navigate("/blog")}
                className="link-draw inline-flex items-center gap-2 font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold-light"
              >
                <ArrowLeft size={13} /> More articles
              </button>
            </div>
          </div>
        </section>

        {/* COMMENTS */}
        <section className="border-y border-border/60 bg-[hsl(22_13%_5%)] py-16 sm:py-20">
          <div className="shell-tight">
            <div className="flex items-end justify-between gap-6">
              <h2 className="display-md">
                The conversation
                <span className="ml-3 numeral text-lg text-gold/70">({post.comments?.length || 0})</span>
              </h2>
            </div>

            <form onSubmit={handleComment} className="panel mt-9 rounded-sm p-6 sm:p-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="comment-name">
                    Name *
                  </label>
                  <input
                    id="comment-name"
                    className="field"
                    value={commentName}
                    onChange={(event) => setCommentName(event.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="comment-email">
                    Email (not published)
                  </label>
                  <input
                    id="comment-email"
                    type="email"
                    className="field"
                    value={commentEmail}
                    onChange={(event) => setCommentEmail(event.target.value)}
                    placeholder="you@email.com"
                  />
                </div>
              </div>
              <div className="mt-5">
                <label className="field-label" htmlFor="comment-text">
                  Your comment *
                </label>
                <textarea
                  id="comment-text"
                  rows={4}
                  className="field resize-none"
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Share your thoughts or ask a question…"
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button type="submit" disabled={posting} className="btn btn-gold btn-sm shine">
                  {posting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {posting ? "Posting" : "Post comment"}
                </button>
              </div>
            </form>

            <div className="mt-10 space-y-5">
              <AnimatePresence initial={false}>
                {(post.comments || []).map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-sm border border-border/70 bg-[hsl(22_13%_6%)] p-6"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 font-display text-sm text-gold-light">
                        {comment.author_name?.charAt(0)?.toUpperCase() || "B"}
                      </span>
                      <div>
                        <div className="font-sans text-sm text-foreground">{comment.author_name}</div>
                        <div className="font-sans text-[0.6875rem] text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 font-sans text-sm leading-[1.85] text-muted-foreground">
                      {comment.comment}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!(post.comments || []).length && (
                <p className="rounded-sm border border-dashed border-border/70 py-10 text-center font-sans text-sm text-muted-foreground">
                  No comments yet — be the first to share your thoughts.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="py-16 sm:py-20">
            <div className="shell">
              <div className="flex items-end justify-between gap-6">
                <h2 className="display-md">More from the journal</h2>
                <Link
                  to="/blog"
                  className="link-draw hidden items-center gap-2 font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-gold-light sm:inline-flex"
                >
                  All articles <ArrowUpRight size={13} />
                </Link>
              </div>
              <div className="mt-12 grid gap-8 md:grid-cols-3">
                {related.map((item, index) => (
                  <PostCard key={item.id} post={item} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
}

/* ───────────────────────── index ───────────────────────── */

function JournalIndex() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  const localFallback = (): BlogPostItem[] =>
    fallbackBlogPosts.map((entry) => ({
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      excerpt: entry.excerpt,
      content: entry.content,
      category: entry.category,
      author: entry.author,
      featured_image: entry.featuredImage,
      read_time: entry.readTime,
      is_featured: entry.isFeatured ? 1 : 0,
      published_at: entry.date,
    }));

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await api.blog.list(activeCategory, search);
        let list: BlogPostItem[] = res.success && res.data && res.data.length > 0 ? res.data : localFallback();

        if (activeCategory !== "all") list = list.filter((post) => post.category === activeCategory);
        if (search.trim()) {
          const needle = search.trim().toLowerCase();
          list = list.filter(
            (post) =>
              post.title.toLowerCase().includes(needle) || post.excerpt.toLowerCase().includes(needle)
          );
        }

        if (!cancelled) setPosts(list);
      } catch {
        if (!cancelled) setPosts(localFallback());
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const timer = window.setTimeout(load, 180);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [activeCategory, search]);

  const featured = posts.find((post) => post.is_featured) || posts[0];
  const rest = posts.filter((post) => post.id !== featured?.id);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden pb-12 pt-36 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_80%_0%,hsl(40_62%_62%_/_0.12),transparent_60%)]" />
        <div className="shell">
          <Reveal variant="fade">
            <SectionIndex index="01" label="The journal" className="mb-8" />
          </Reveal>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <SplitText
              as="h1"
              text="Beauty notes from the studio"
              highlightFrom={2}
              className="display-lg max-w-[20ch]"
              delay={0.15}
            />
            <Reveal variant="up" delay={0.5}>
              <p className="lede max-w-lg">
                Technique, product honesty and bridal timelines — written by the people holding the brush.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CONTROLS */}
      <section className="sticky top-[4.5rem] z-[800] border-y border-border/60 bg-[hsl(20_14%_4%_/_0.88)] py-4 backdrop-blur-xl lg:top-20">
        <div className="shell flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const active = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full border px-4 py-2 font-sans text-[0.625rem] uppercase tracking-[0.18em] transition-all duration-500 ease-expo ${
                    active
                      ? "border-transparent bg-gradient-gold text-primary-foreground"
                      : "border-border/80 text-muted-foreground hover:border-gold/40 hover:text-gold-light"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <Search size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold/70" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search articles"
              aria-label="Search articles"
              className="field py-3 pl-10 text-xs"
            />
          </div>
        </div>
      </section>

      {/* LIST */}
      <section className="py-14 sm:py-20">
        <div className="shell">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-24">
              <Loader2 className="h-7 w-7 animate-spin text-gold" />
              <span className="eyebrow-muted">Loading the journal</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-sm border border-dashed border-border/70 py-24 text-center">
              <Ornament className="mx-auto mb-6 max-w-[8rem]" />
              <h2 className="font-display text-2xl">Nothing matches that search</h2>
              <p className="mx-auto mt-3 max-w-sm font-sans text-sm text-muted-foreground">
                Try a different keyword, or browse all articles.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
                className="btn btn-outline btn-sm mt-7"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {featured && activeCategory === "all" && !search && (
                <div className="mb-16 sm:mb-20">
                  <FeaturedPost post={featured} />
                </div>
              )}

              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {(activeCategory === "all" && !search ? rest : posts).map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden border-t border-border/60 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_100%,hsl(40_62%_62%_/_0.16),transparent_65%)]" />
        <div className="shell text-center">
          <SplitText as="h2" text="Put the reading into practice" className="display-md mx-auto max-w-[22ch]" highlightFrom={4} />
          <Reveal variant="up" delay={0.25} className="mt-9 flex flex-wrap justify-center gap-4">
            <Magnetic strength={0.2}>
              <Link to="/booking" className="btn btn-gold shine">
                Book your session
                <ArrowUpRight size={14} />
              </Link>
            </Magnetic>
            <Link to="/services" className="btn btn-outline">
              See services & pricing
            </Link>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}

export default function Blog() {
  const { slug } = useParams<{ slug?: string }>();
  return slug ? <ArticleView /> : <JournalIndex />;
}
