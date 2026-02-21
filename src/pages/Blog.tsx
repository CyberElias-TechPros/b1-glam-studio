import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Share2, Instagram, Facebook, ArrowRight, ChevronLeft, MessageCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { GoldParticles } from "@/components/GoldParticles";
import { blogPosts, categories, getPostBySlug, getFeaturedPost, getRelatedPosts, getPostsByCategory, BlogPost } from "@/data/blog";

// Blog Card Component
function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/blog/${post.slug}`} className="block h-full">
        <article className="bg-card border border-border rounded-sm overflow-hidden h-full transition-all duration-300 hover:border-primary/50 hover:gold-glow">
          {/* Featured Image */}
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
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {post.readTime}
              </span>
            </div>
            
            <h3 className="text-lg sm:text-xl font-serif font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {post.excerpt}
            </p>
            
            <span className="inline-flex items-center text-sm font-medium text-primary group-hover:underline">
              Read More <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

// Featured Post Component
function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <section className="mb-16 sm:mb-20">
      <AnimatedSection>
        <Link to={`/blog/${post.slug}`} className="block group">
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 bg-card border border-border rounded-sm overflow-hidden hover:border-primary/50 transition-all duration-300">
            {/* Image Side */}
            <div className="relative h-64 sm:h-80 lg:h-96 bg-secondary">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-20">✦</span>
              </div>
              {/* Featured Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 text-xs font-sans font-semibold uppercase tracking-wider bg-gradient-gold text-primary-foreground rounded-sm">
                  Featured
                </span>
              </div>
            </div>
            
            {/* Content Side */}
            <div className="p-6 sm:p-10 lg:py-16 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
                <span className="w-1 h-1 rounded-full bg-primary" />
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {post.readTime}
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="mt-auto">
                <span className="inline-flex items-center text-primary font-medium group-hover:underline">
                  Read Full Article <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-2" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </AnimatedSection>
    </section>
  );
}

// Category Filter Component
function CategoryFilter({ activeCategory, onCategoryChange }: { activeCategory: string; onCategoryChange: (category: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 text-sm font-sans font-medium tracking-wide rounded-sm transition-all duration-300 ${
            activeCategory === category.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-primary/20"
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}

// Social Share Component
function SocialShare({ title, slug }: { title: string; slug: string }) {
  const shareUrl = `${window.location.origin}/blog/${slug}`;
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: `https://www.instagram.com/sharer/sharer.php?u=${shareUrl}&quote=${encodedTitle}`,
      color: "hover:bg-primary",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedTitle}%20${shareUrl}`,
      color: "hover:bg-primary",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      color: "hover:bg-primary",
    },
  ];

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground flex items-center gap-2">
        <Share2 size={16} />
        Share:
      </span>
      <div className="flex gap-2">
        {shareLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground ${social.color} hover:text-primary-foreground transition-colors`}
            aria-label={`Share on ${social.name}`}
          >
            <social.icon size={16} />
          </a>
        ))}
      </div>
    </div>
  );
}

// Related Posts Component
function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <AnimatedSection>
        <h3 className="text-2xl font-serif font-bold text-foreground mb-8">Related Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`} className="block group">
                <article className="bg-card border border-border rounded-sm overflow-hidden transition-all duration-300 hover:border-primary/50">
                  <div className="h-32 bg-secondary relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl opacity-20">✦</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-serif font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <span className="text-xs text-muted-foreground mt-2 block">
                      {post.readTime}
                    </span>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}

// Individual Blog Post View
function BlogPostView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;
  
  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate("/blog")}
              className="inline-flex items-center text-primary hover:underline"
            >
              <ChevronLeft size={16} className="mr-1" /> Back to Blog
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const relatedPosts = getRelatedPosts(post.slug, post.category, 3);

  return (
    <Layout>
      <article className="min-h-screen pt-24 pb-16">
        <div className="container-narrow">
          {/* Back Button */}
          <AnimatedSection className="mb-8">
            <button
              onClick={() => navigate("/blog")}
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft size={18} className="mr-1" /> Back to Blog
            </button>
          </AnimatedSection>

          {/* Post Header */}
          <AnimatedSection delay={0.1}>
            <header className="mb-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 text-xs font-sans font-medium uppercase tracking-wider bg-primary/10 text-primary rounded-sm">
                  {categories.find((c) => c.id === post.category)?.label || post.category}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock size={14} />
                  {post.readTime}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight mb-6">
                {post.title}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relax mb-6">
                {post.excerpt}
              </p>
              
              <SocialShare title={post.title} slug={post.slug} />
            </header>
          </AnimatedSection>

          {/* Featured Image */}
          <AnimatedSection delay={0.2}>
            <div className="relative h-64 sm:h-80 lg:h-96 bg-card border border-border rounded-sm overflow-hidden mb-12">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-20">✦</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Post Content */}
          <AnimatedSection delay={0.3}>
            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-serif prose-headings:text-foreground
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-strong:text-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-li:text-muted-foreground
                prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic
                prose-code:text-primary prose-code:bg-primary/10 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-sm"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </AnimatedSection>

          {/* Share Section */}
          <AnimatedSection delay={0.4} className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-foreground font-serif font-semibold">Enjoyed this article? Share it!</p>
              <SocialShare title={post.title} slug={post.slug} />
            </div>
          </AnimatedSection>

          {/* Related Posts */}
          <RelatedPosts posts={relatedPosts} />
        </div>
      </article>
    </Layout>
  );
}

// Blog Listing Page
function BlogListing() {
  const [activeCategory, setActiveCategory] = useState("all");
  const filteredPosts = getPostsByCategory(activeCategory);
  const featuredPost = getFeaturedPost();

  // Filter out featured post from regular grid if showing all
  const postsToShow = activeCategory === "all" && featuredPost
    ? filteredPosts.filter(p => p.id !== featuredPost.id)
    : filteredPosts;

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        {/* Hero Section */}
        <section className="section-padding pb-8 relative">
          <GoldParticles count={15} className="opacity-50" />
          <div className="container-narrow">
            <AnimatedSection>
              <div className="text-center mb-4">
                <span className="text-xs font-sans font-semibold uppercase tracking-[0.3em] text-primary mb-3 block">
                  Beauty & Inspiration
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
                  The B1touch <span className="text-gradient-gold">Blog</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Tips, tutorials, and insights from Lagos' premier makeup artistry studio. 
                  Celebrating dark skin beauty one post at a time.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Featured Post */}
        {activeCategory === "all" && featuredPost && (
          <div className="container-narrow px-4 sm:px-6 lg:px-8">
            <FeaturedPost post={featuredPost} />
          </div>
        )}

        {/* Category Filter */}
        <section className="container-narrow px-4 sm:px-6 lg:px-8 mb-12">
          <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        </section>

        {/* Blog Grid */}
        <section className="container-narrow px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {postsToShow.length > 0 ? (
                <StaggerContainer delay={0.1} staggerDelay={0.1}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {postsToShow.map((post, index) => (
                      <StaggerItem key={post.id}>
                        <BlogCard post={post} index={index} />
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerContainer>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No posts found in this category.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Newsletter CTA */}
        <section className="mt-20">
          <div className="container-narrow px-4 sm:px-6 lg:px-8">
            <div className="bg-card border border-border rounded-sm p-8 sm:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-4">
                  Never Miss a Post
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Subscribe to our newsletter for the latest beauty tips, trends, and exclusive offers.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-secondary border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <button className="px-6 py-3 bg-gradient-gold text-primary-foreground font-medium rounded-sm hover:opacity-90 transition-opacity">
                    Subscribe
                  </button>
                </div>
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
  
  // If there's a slug, show the individual post view
  if (slug) {
    return <BlogPostView />;
  }
  
  // Otherwise show the listing page
  return <BlogListing />;
}
