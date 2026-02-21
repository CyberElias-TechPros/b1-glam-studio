export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  featuredImage: string;
  author: string;
  isFeatured?: boolean;
}

export const categories = [
  { id: "all", label: "All Posts" },
  { id: "bridal", label: "Bridal" },
  { id: "events", label: "Events" },
  { id: "tips", label: "Tips" },
  { id: "dark-skin", label: "Dark Skin" },
  { id: "tutorials", label: "Tutorials" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "top-5-bridal-makeup-looks-dark-skin-2026",
    title: "Top 5 Bridal Makeup Looks for Dark Skin in 2026",
    excerpt: "Discover the most stunning bridal makeup trends specifically designed to enhance the natural beauty of dark skin tones. From classic glam to modern radiance.",
    content: `
<p>As we enter 2026, Nigerian brides are more confident than ever in choosing makeup looks that celebrate their unique beauty. Dark skin tones have finally taken center stage in the bridal industry, with makeup artists creating stunning looks that enhance natural radiance rather than trying to alter it.</p>

<h2>1. The Golden Hour Glow</h2>
<p>This look has become increasingly popular among Lagos brides who want that perfect dewy finish. The key is using highlighters with warm undertones that catch the light beautifully. Products like Charlotte Tilbury's Hollywood Flawless Filter in shade 6 or Fenty Beauty's Sun Stalk'r Instant Warmth Serum Bronzer work wonders on deep skin tones.</p>

<p><strong>Pro Tip:</strong> Apply your highlighter on the high points of your face - cheekbones, brow bone, and the bridge of your nose. For that coveted "Owambe glow," mix a liquid highlighter with your moisturizer for an all-over radiance.</p>

<h2>2. The Classic Red Lip</h2>
<p>A bold red lip remains timeless for Nigerian brides. The secret lies in finding the perfect red with blue undertones - think MAC's Ruby Woo or Pat McGrath's MatteTrance Lipstick in Deep Void. These shades create a stunning contrast against dark skin.</p>

<p><strong>Application Tip:</strong> Use a lip liner first to prevent feathering, and set with a translucent powder through a tissue for long-lasting wear through your reception.</p>

<h2>3. The Soft Glam</h2>
<p>Soft glam focuses on blending warm-toned eyeshadows seamlessly into the crease, creating depth without looking too heavy. Think warm browns, burnt siennas, and champagne golds that complement melanin-rich skin.</p>

<p>This look is perfect for church weddings and traditional ceremonies where you want to look elegant and sophisticated.</p>

<h2>4. The Bold Glam</h2>
<p>For the modern Lagos bride who isn't afraid to make a statement. This look features dramatic winged eyeliner, false lashes, and a contoured face with defined cheekbones. It's perfect for evening receptions and white wedding after-parties.</p>

<h2>5. The Natural Radiance</h2>
<p>More brides are opting for minimal makeup that enhances their natural features. Think light coverage foundation, tinted moisturizer, defined brows, and a soft pink lip. This look is perfect for traditional weddings where you want your features to shine through.</p>

<h2>Choosing Your Bridal Look</h2>
<p>When selecting your bridal makeup, consider your wedding theme, time of day, and most importantly, what makes you feel confident. Schedule a trial at least 2-3 months before your wedding to perfect your look.</p>

<p>At B1touch Artistry, we specialize in creating bespoke bridal looks that celebrate dark skin beauty. Book your bridal consultation today and let us make your wedding day even more memorable.</p>
    `,
    category: "bridal",
    date: "2026-02-15",
    readTime: "5 min read",
    featuredImage: "/placeholder.svg",
    author: "Bimbola",
    isFeatured: true,
  },
  {
    id: "2",
    slug: "how-to-prep-skin-long-lasting-makeup-lagos-humidity",
    title: "How to Prep Your Skin for Long-Lasting Makeup in Lagos Humidity",
    excerpt: "Fighting with makeup that slides off in Lagos weather? Learn the essential skin prep techniques that keep your glam intact all day long.",
    content: `
<p>Lagos humidity can be a makeup artist's biggest challenge. The heat and moisture in the air conspire to melt even the most carefully applied makeup. But with the right skin prep routine, you can achieve makeup that lasts from your morning meeting to your evening Owambe.</p>

<h2>The Importance of Skin Prep</h2>
<p>The key to long-lasting makeup starts hours before you apply your first product. Your skin needs to be clean, exfoliated, and properly moisturized to create the perfect canvas.</p>

<h2>Step 1: Cleanse Properly</h2>
<p>Start with a gentle cleanser that removes dirt and excess oil without stripping your skin. For oily skin, consider using a salicylic acid cleanser. For dry skin, opt for a hydrating cleanser with glycerin.</p>

<h2>Step 2: Exfoliate Weekly</h2>
<p>Dead skin cells cause makeup to look cakey and patchy. Exfoliate 2-3 times a week using a gentle chemical exfoliant. Glycolic acid works beautifully for dark skin as it helps with hyperpigmentation while creating a smooth surface for makeup.</p>

<h2>Step 3: Moisturize, Moisturize, Moisturize</h2>
<p>This is crucial in Lagos! Even oily skin needs hydration. Use a lightweight, non-comedogenic moisturizer that won't clog pores. Wait 5-10 minutes before applying makeup to let it fully absorb.</p>

<h2>Step 4: Use a Primer</h2>
<p>A good primer is your best friend in humid weather. Look for silicone-based primers that create a barrier between your skin and makeup. Fenty Beauty's Pro Filt'r Soft Matte Primer or the Becca Ever-Matte Poreless Priming Perfector work well for oily skin.</p>

<h2>Step 5: Set Your Base</h2>
<p>After applying foundation, use a translucent setting powder on areas prone to oiliness - T-zone, chin, and forehead. This creates a matte base that resists humidity.</p>

<h2>Step 6: Setting Spray</h2>
<p>Finish with a setting spray that locks everything in place. Urban Decay All Nighter or Mac Fix+ are excellent choices for Lagos weather.</p>

<h2>Quick Tips for the Day</h2>
<ul>
<li>Blot excess oil throughout the day with blotting papers</li>
<li>Carry your setting powder for touch-ups</li>
<li>Avoid touching your face</li>
<li>Stay hydrated - it shows in your skin!</li>
</ul>

<p>Remember, great makeup starts with great skin. Invest in your skincare routine, and your makeup will thank you!</p>
    `,
    category: "tips",
    date: "2026-02-10",
    readTime: "4 min read",
    featuredImage: "/placeholder.svg",
    author: "Bimbola",
    isFeatured: false,
  },
  {
    id: "3",
    slug: "owambe-glam-5-tips-flawless-party-makeup",
    title: "Owambe Glam: 5 Tips for Flawless Party Makeup",
    excerpt: "From traditional gatherings to white parties, master the art of Owambe makeup with these expert tips designed for Nigerian celebrations.",
    content: `
<p>Owambe season in Lagos is no time for subtle makeup. Whether you're attending a traditional wedding, a birthday bash, or the ever-popular white party, your makeup needs to be on point. Here's how to achieve that flawless party look that lasts all night.</p>

<h2>1. Build a Solid Base</h2>
<p>The foundation of any great party look is a flawless base. In Lagos heat, opt for a buildable coverage foundation that allows your skin to breathe. Use a silicone primer to smooth out pores and create a canvas that makeup can adhere to.</p>

<p><strong>Pro Tip:</strong> Mix your foundation with a drop of facial oil for a radiant finish that photographs beautifully.</p>

<h2>2. Master the Art of Contouring</h2>
<p>Contouring is essential for that sculpted, defined look that stands out in party photos. Use a contour shade that's only 1-2 shades darker than your skin tone. Warm undertones work best for dark skin - think terracotta and chocolate browns.</p>

<p>Focus on:
<ul>
<li>Defining your cheekbones</li>
<li>Sculpting your nose</li>
<li>Contouring your jawline</li>
<li>Adding depth to your temples</li>
</ul></p>

<h2>3. Eyes That Pop</h2>
<p>Party eyes need drama! Don't be afraid to use shimmer and glitter. Gold and bronze shades complement dark skin beautifully, creating a luxurious effect under party lights.</p>

<p><strong>Application Tip:</strong> Apply a glitter glue before your shimmer eyeshadow to ensure it stays put all night.</p>

<h2>4. The Perfect Gele-Compatible Hairstyle</h2>
<p>Your makeup needs to complement your gele or wig. If you're wearing an elaborate gele, keep your eye makeup slightly softer to avoid overwhelming your look. Conversely, if you're wearing a sleek wig, you can go heavier on the eyes.</p>

<h2>5. Lips That Last</h2>
<p>No one wants to be reapplying lipstick every hour. Start with a lip liner, apply your lipstick, blot, and set with powder. Top with a clear lip gloss for dimension.</p>

<p><strong>Long-Wear Tip:</strong> For ultra-long wear, apply a thin layer of concealer on your lips before lipstick, then proceed with your regular application.</p>

<h2>Bonus: Touch-Up Kit</h2>
<p>Pack a small touch-up kit with:
<ul>
<li>Blotting papers</li>
<li>Translucent powder</li>
<li>Lipstick for quick touch-ups</li>
<li>Setting spray</li>
</ul></p>

<p>Now go forth and serve looks at every Owambe this season!</p>
    `,
    category: "events",
    date: "2026-02-05",
    readTime: "4 min read",
    featuredImage: "/placeholder.svg",
    author: "Bimbola",
    isFeatured: false,
  },
  {
    id: "4",
    slug: "everyday-vs-event-makeup-whats-right-for-you",
    title: "Everyday vs Event Makeup: What's Right for You?",
    excerpt: "Understanding the difference between everyday and event makeup can help you choose the right look for every occasion.",
    content: `
<p>As a Lagos woman, your makeup needs vary from day to day. Understanding when to keep it natural and when to go all out is an art form. Let's break down when to embrace everyday makeup and when to level up to event-ready glam.</p>

<h2>Everyday Makeup: The Natural Look</h2>
<p>Everyday makeup should enhance your natural beauty without looking overdone. It's perfect for workdays, casual outings, and running errands around Lagos.</p>

<h3>Key Characteristics:</h3>
<ul>
<li>Light to medium coverage foundation or tinted moisturizer</li>
<li>Natural-looking brows (fill in sparse areas but avoid harsh lines)</li>
<li>Soft neutral eyeshadows or just mascara</li>
<li>Natural blush or subtle contour</li>
<li>Nude or MLBB (My Lips But Better) lip colors</li>
</ul>

<h3>Best For:</h3>
<ul>
<li>Work and professional settings</li>
<li>Casual lunches and hangouts</li>
<li>Running errands</li>
<li>Exercise and outdoor activities</li>
<li>Video calls and meetings</li>
</ul>

<h2>Event Makeup: The Glam</h2>
<p>Event makeup is your opportunity to make a statement. It's more dramatic, more polished, and designed to photograph well.</p>

<h3>Key Characteristics:</h3>
<ul>
<li>Full coverage foundation with flawless finish</li>
<li>Defined, dramatic brows</li>
<li>Layered eyeshadows with liner and false lashes</li>
<li>Contouring and highlighting for dimension</li>
<li>Bold lip colors or classic red</li>
<li>Setting spray to ensure longevity</li>
</ul>

<h3>Best For:</h3>
<ul>
<li>Weddings (as a guest or the bride)</li>
<li>Corporate events and galas</li>
<li>Photo shoots</li>
<li>Birthday parties and celebrations</li>
<li>Special date nights</li>
</ul>

<h2>Finding Your Balance</h2>
<p>The key is to match your makeup to the occasion. Here's a quick guide:</p>

<p><strong>Casual Friday:</strong> Keep it simple with BB cream and defined brows.</p>

<p><strong>Important Meeting:</strong> Polished but professional - medium coverage with a subtle lip.</p>

<p><strong>Wedding Guest:</strong> Glam it up! This is your time to shine.</p>

<p><strong>Birthday Party:</strong> Match the vibe - daytime events call for softer glam, evening parties can be more dramatic.</p>

<h2>When in Doubt</h2>
<p>When you're unsure, it's always better to be slightly underdressed than overdone. You can always add more makeup, but removing it is harder. Plus, a more natural look is always stylish and appropriate.</p>

<p>At B1touch Artistry, we help you find the perfect balance for every occasion. Book a session and let us create the perfect look for your next event!</p>
    `,
    category: "tips",
    date: "2026-01-28",
    readTime: "4 min read",
    featuredImage: "/placeholder.svg",
    author: "Bimbola",
    isFeatured: false,
  },
  {
    id: "5",
    slug: "b1touch-guide-to-gele-tying-completing-your-look",
    title: "B1touch Guide to Gele Tying: Completing Your Look",
    excerpt: "The gele is more than just a head tie - it's a statement. Learn how to choose and tie the perfect gele to complete your Nigerian outfit.",
    content: `
<p>No Nigerian outfit is complete without the perfect gele. This elaborate head tie is a crown that transforms your entire look. Whether you're wearing an ankara gown, iro and buba, or a modern jumpsuit, the right gele can elevate your style to new heights.</p>

<h2>Choosing Your Gele Material</h2>
<p>Not all gele material is created equal. Here's what you need to know:</p>

<h3>Velvet</h3>
<p>Perfect for weddings and formal events. Velvet gelé provides a luxurious sheen and holds its shape well throughout the day.</p>

<h3>George/Lace</h3>
<p>Ideal for traditional ceremonies and church weddings. The intricate patterns add elegance and sophistication.</p>

<h3>Silk</h3>
<p>A versatile option that works for both traditional and modern outfits. Silk gelé gives a subtle sheen and is comfortable to wear.</p>

<h3>Ankara</h3>
<p>Match your gelé to your outfit for a coordinated look. Ankara gelé is perfect for traditional events and cultural celebrations.</p>

<h2>Popular Gele Styles</h2>

<h3>1. The Classic Turban</h3>
<p>A timeless style that works with any outfit. Perfect for beginners as it's relatively easy to achieve.</p>

<h3>2. The Big Gele</h3>
<p>The statement piece! This oversized gelé is perfect for wedding reception entrance and photo sessions. It creates dramatic volume and Photogenic appeal.</p>

<h3>3. The Side Sweep</h3>
<p>Elegant and sophisticated, this style is perfect for church weddings and formal events. It creates a sleek, elongated look.</p>

<h3>4. The Flower Gele</h3>
<p>For the romantic at heart. This style incorporates fabric flowers for added dimension and beauty.</p>

<h3>5. The Layered Gele</h3>
<p>Create depth and complexity with multiple layers. This style is perfect for those who want to make a bold statement.</p>

<h2>Coordinating Gele with Your Makeup</h2>
<p>The key to a cohesive look is balance. If you're wearing a big, dramatic gele, consider softer eye makeup. If your gele is more subtle, you can go heavier on the eyes.</p>

<p><strong>Tip:</strong> Match your gelé color to your outfit's dominant color or your accessories for a put-together look.</p>

<h2>Gele Tips from the Pros</h2>
<ul>
<li><strong>Start with a good base:</strong> Use a gele tie or wig cap underneath for grip</li>
<li><strong>Secure properly:</strong> Use bobby pins and hair spray to keep everything in place</li>
<li><strong>Consider your face shape:</strong> Different styles flatter different face shapes</li>
<li><strong>Practice makes perfect:</strong> If you're tying it yourself, practice before the event day</li>
<li><strong>Have a backup:</strong> Bring extra pins and a small Emergency kit</li>
</ul>

<h2>When to Call a Professional</h2>
<p>For major events like weddings, it's always worth hiring a professional gele tier. They have the experience to create stunning styles that will stay perfect throughout your event. At B1touch Artistry, we offer gele tying as part of our bridal packages.</p>

<p>Now you're ready to tie (or rock) the perfect gele!</p>
    `,
    category: "tutorials",
    date: "2026-01-20",
    readTime: "5 min read",
    featuredImage: "/placeholder.svg",
    author: "Bimbola",
    isFeatured: false,
  },
  {
    id: "6",
    slug: "why-dark-skin-needs-specialized-makeup-artists",
    title: "Why Dark Skin Tones Need Specialized Makeup Artists",
    excerpt: "Not all makeup artists understand the unique needs of dark skin. Here's why choosing a specialist can make all the difference in your glow.",
    content: `
<p>The beauty industry has historically catered to lighter skin tones, leaving women with dark skin struggling to find the right products and techniques. This is why specialized makeup artists who understand melanin-rich skin are essential.</p>

<h2>Understanding Dark Skin</h2>
<p>Dark skin is not just "darker" version of light skin - it has unique characteristics that require different approaches:</p>

<ul>
<li><strong>More melanin:</strong> This affects how products appear on the skin and how they blend</li>
<li><strong>Higher risk of hyperpigmentation:</strong> Trauma from incorrect products or techniques can leave lasting marks</li>
<li><strong>Different undertones:</strong> Dark skin can have warm, neutral, or cool undertones that affect color matching</li>
<li><strong>Unique texture:</strong> The skincare needs and makeup application techniques differ</li>
</ul>

<h2>The Problem with Generalist Makeup Artists</h2>
<p>Many makeup artists trained using models and products designed for lighter skin. When they work with dark skin, common mistakes include:</p>

<h3>Wrong Foundation Shades</h3>
<p>Using ashy or grey-looking foundations that don't match the warm undertones in dark skin.</p>

<h3>Over-Contouring</h3>
<p>Using too dark contour shades that look muddy or create harsh lines instead of subtle definition.</p>

<h3>Neglecting Undertones</h3>
<p>Not recognizing that dark skin has various undertones - golden, neutral, rosy, or olive.</p>

<h3>Inappropriate Highlighting</h3>
<p>Using shimmers with white base instead of golden or champagne tones that complement dark skin.</p>

<h3>Wrong Eyeshadow Colors</h3>
<p>Not understanding which colors pop on dark skin versus those that disappear.</p>

<h2>What a Dark Skin Specialist Brings</h2>

<h3>Knowledge of Pigmentation</h3>
<p>Understanding how to color-correct hyperpigmentation and dark spots without looking cakey.</p>

<h3>Custom Color Matching</h3>
<p>The ability to mix products or layer shades to create the perfect match.</p>

<h3>Technique Adaptation</h3>
<p>Using different blending motions, tools, and pressure to achieve flawless results.</p>

<h3>Product Knowledge</h3>
<p>Knowing which brands and shades work best for various dark skin tones.</p>

<h2>Recommended Products for Dark Skin</h2>
<p>At B1touch Artistry, we use premium products specifically selected for dark skin:</p>

<ul>
<li><strong>Foundations:</strong> Fenty Beauty, MAC, NARS, Pat McGrath, Lancôme</li>
<li><strong>Concealers:</strong> Tarte, Urban Decay, Kevyn Aucoin</li>
<li><strong>Highlighters:</strong> Becca, Fenty, Pat McGrath</li>
<li><strong>Lipsticks:</strong> MAC, Mented Cosmetics, Pat McGrath</li>
</ul>

<h2>The B1touch Difference</h2>
<p>As a Lagos-based makeup artist specializing in dark skin, I understand the unique challenges and beauty of melanin-rich skin. Every technique, product, and look is designed to celebrate and enhance your natural glow.</p>

<p>Book a session today and experience the difference of truly personalized makeup artistry.</p>
    `,
    category: "dark-skin",
    date: "2026-01-15",
    readTime: "5 min read",
    featuredImage: "/placeholder.svg",
    author: "Bimbola",
    isFeatured: false,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === "all") return blogPosts;
  return blogPosts.filter((post) => post.category === category);
}

export function getFeaturedPost(): BlogPost | undefined {
  return blogPosts.find((post) => post.isFeatured);
}

export function getRelatedPosts(currentSlug: string, category: string, limit: number = 3): BlogPost[] {
  return blogPosts
    .filter((post) => post.slug !== currentSlug && post.category === category)
    .slice(0, limit);
}
