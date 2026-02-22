import { motion } from "framer-motion";
import { Heart, MessageCircle, Send, Instagram as InstagramIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { getImages } from "@/lib/portfolioImages";

// Use real images from portfolio folder, randomized
const feedImages = getImages(9, 50);
const captions = [
  "Flawless finish for melanin skin ✨",
  "Bridal glam done right 👰🏾",
  "Soft glam for the weekend",
  "Bold and beautiful 💋",
  "Glow up season is here ✨",
  "Every shade is beautiful",
  "Editorial vibes 🎬",
  "Natural beauty enhanced",
  "When the glow hits different 💫",
];

const instagramPosts = feedImages.map((img, i) => ({
  id: i + 1,
  image: img,
  likes: 1500 + Math.floor(Math.random() * 3000),
  comments: 50 + Math.floor(Math.random() * 250),
  caption: captions[i],
  type: "image" as const,
}));

function InstagramPost({ post, index }: { post: typeof instagramPosts[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative aspect-square overflow-hidden cursor-pointer"
    >
      {/* Image with zoom effect */}
      <motion.img
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.4 }}
        src={post.image}
        alt={post.caption}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      
      {/* Gold gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Engagement overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div className="flex items-center gap-2 text-primary-foreground">
          <Heart className="w-6 h-6 fill-primary-foreground" />
          <span className="text-sm font-semibold">{post.likes.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-primary-foreground">
          <MessageCircle className="w-6 h-6 fill-primary-foreground" />
          <span className="text-sm font-semibold">{post.comments}</span>
        </div>
      </motion.div>
      
      {/* Gold border glow on hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/60 rounded-sm transition-all duration-300 shadow-[0_0_20px_rgba(212,168,85,0.3)] group-hover:shadow-[0_0_30px_rgba(212,168,85,0.5)]" />
    </motion.div>
  );
}

function InstagramHeader() {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary p-1">
          <div className="w-full h-full rounded-full bg-gradient-gold flex items-center justify-center">
            <span className="text-2xl font-serif font-bold text-primary-foreground">B1</span>
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#E1306C] rounded-full flex items-center justify-center border-2 border-background">
          <InstagramIcon size={12} className="text-primary-foreground" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-serif font-bold text-foreground">@b1touch_artistry</h3>
        <p className="text-sm text-muted-foreground">Lagos Makeup Artist</p>
        <div className="flex items-center justify-center gap-1 mt-1">
          <a
            href="https://instagram.com/b1touch_artistry"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-gold-light transition-colors"
          >
            b1touch_artistry
          </a>
          <span className="text-muted-foreground">·</span>
          <a
            href="https://instagram.com/b1touch_artistry"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-gold-light transition-colors"
          >
            Reels
          </a>
        </div>
      </div>
    </div>
  );
}

function FollowButton() {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="text-center mt-8"
    >
      <a
        href="https://instagram.com/b1touch_artistry"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-3 text-sm font-sans font-semibold tracking-wide bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all rounded-sm gold-glow"
      >
        <InstagramIcon size={16} />
        Follow on Instagram
      </a>
    </motion.div>
  );
}

export function InstagramFeed() {
  return (
    <section className="section-padding bg-secondary">
      <div className="container-narrow mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.4em] text-primary mb-4">
            @b1touch_artistry
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4">
            Follow Our <span className="text-gradient-gold">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get inspired by our latest looks, behind-the-scenes moments, and beauty tips.
          </p>
        </motion.div>

        {/* Instagram Profile Header */}
        <InstagramHeader />

        {/* Instagram Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
          {instagramPosts.map((post, index) => (
            <InstagramPost key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* Follow CTA */}
        <FollowButton />
      </div>
    </section>
  );
}

// Floating Follow Badge Component
export function FloatingInstagramBadge() {
  return (
    <motion.a
      href="https://instagram.com/b1touch_artistry"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 left-6 z-50 hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all"
    >
      <InstagramIcon size={18} />
      <span className="text-sm font-semibold">Follow</span>
    </motion.a>
  );
}
