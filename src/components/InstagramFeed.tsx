import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Instagram as InstagramIcon, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Lightbox from "@/components/Lightbox";
import { getImages } from "@/lib/portfolioImages";
import { Magnetic, Reveal, SectionIndex, SplitText } from "@/components/motion/Reveal";

const CAPTIONS = [
  "Flawless finish for melanin skin ✨",
  "Bridal glam, engineered to last 👰🏾",
  "Soft glam for the weekend",
  "Bold and beautiful 💋",
  "Glow season is here ✨",
  "Every shade is beautiful",
  "Editorial mood 🎬",
  "Natural beauty, amplified",
  "When the glow hits different 💫",
];

// Deterministic engagement figures — stable across renders, no layout jitter.
const likeCounts = [3184, 2471, 5210, 1866, 4093, 2754, 3612, 1987, 4420];
const commentCounts = [148, 92, 233, 61, 187, 104, 165, 78, 211];

const feedImages = getImages(9, 50);

const instagramPosts = feedImages.map((image, i) => ({
  id: i + 1,
  image,
  likes: likeCounts[i % likeCounts.length],
  comments: commentCounts[i % commentCounts.length],
  caption: CAPTIONS[i % CAPTIONS.length],
}));

function InstagramPost({
  post,
  index,
  onOpen,
}: {
  post: (typeof instagramPosts)[number];
  index: number;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const featured = index % 7 === 0;

  return (
    <Reveal variant="up" delay={(index % 3) * 0.08} className={featured ? "sm:col-span-2 sm:row-span-2" : ""}>
      <button
        onClick={onOpen}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        data-cursor="view"
        data-cursor-label="View"
        className="group relative block h-full w-full overflow-hidden rounded-sm bg-secondary/40"
        style={{ aspectRatio: featured ? "1 / 1" : "1 / 1" }}
        aria-label={`Open Instagram post: ${post.caption}`}
      >
        <img
          src={post.image}
          alt={post.caption}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-expo group-hover:scale-[1.07]"
        />

        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,hsl(20_14%_3%_/_0.85))] opacity-0 transition-opacity duration-700 ease-expo group-hover:opacity-100" />

        <span className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4 text-left">
          <motion.span
            className="block"
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block font-sans text-[0.8125rem] leading-snug text-foreground/90">
              {post.caption}
            </span>
            <span className="mt-2 flex items-center gap-4 font-sans text-[0.6875rem] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Heart size={12} className="fill-rose text-rose" /> {post.likes.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle size={12} /> {post.comments}
              </span>
            </span>
          </motion.span>
        </span>

        <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-[hsl(20_14%_4%_/_0.55)] text-gold-light opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100">
          <InstagramIcon size={14} />
        </span>
      </button>
    </Reveal>
  );
}

export function InstagramFeed() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = useMemo(() => instagramPosts.map((post) => post.image), []);
  const captions = useMemo(() => instagramPosts.map((post) => post.caption), []);

  return (
    <section className="section-y relative overflow-hidden">
      <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,hsl(40_62%_62%_/_0.1),transparent_70%)] blur-2xl" />

      <div className="shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionIndex index="06" label="@b1touchartistry" className="mb-7" />
            <SplitText as="h2" text="Follow the studio" className="display-lg" />
          </div>
          <Reveal variant="up" delay={0.15}>
            <p className="max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
              Daily looks, behind-the-scenes moments and the occasional product confession.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {instagramPosts.map((post, index) => (
            <InstagramPost key={post.id} post={post} index={index} onOpen={() => setLightboxIndex(index)} />
          ))}
        </div>

        <Reveal variant="up" className="mt-12 flex flex-wrap justify-center gap-4">
          <Magnetic strength={0.2}>
            <a
              href="https://instagram.com/b1touchartistry"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
            >
              <InstagramIcon size={15} />
              Follow @b1touchartistry
            </a>
          </Magnetic>
          <Link to="/portfolio" className="btn btn-outline">
            View full portfolio
          </Link>
        </Reveal>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            captions={captions}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
            eyebrow="@b1touchartistry"
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/** Compact floating badge — retained for backwards compatibility. */
export function FloatingInstagramBadge() {
  return (
    <motion.a
      href="https://instagram.com/b1touchartistry"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.05 }}
      className="fixed bottom-24 left-6 z-50 hidden items-center gap-2 rounded-full px-4 py-2 text-primary-foreground shadow-lg lg:flex"
      style={{ background: "linear-gradient(90deg,#833AB4,#FD1D1D,#F77737)" }}
      aria-label="Follow B1touch Artistry on Instagram"
    >
      <InstagramIcon size={17} />
      <span className="text-xs font-semibold uppercase tracking-[0.18em]">Follow</span>
    </motion.a>
  );
}

export default InstagramFeed;
