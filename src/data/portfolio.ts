// Portfolio data for B1touch Artistry
// Lagos-based makeup artist specializing in dark skin tones

export type PortfolioCategory = 
  | 'Bridal' 
  | 'Owambe/Events' 
  | 'Editorial' 
  | 'Dark Skin' 
  | 'Bold/Afrocentric' 
  | 'Soft Glam' 
  | 'Reels/Videos';

export interface PortfolioItem {
  id: number;
  title: string;
  category: PortfolioCategory;
  description: string;
  gradient: string;
  accentGradient: string;
  isVideo: boolean;
  videoThumbnail?: string;
  duration?: string;
  instagramUrl?: string;
  heightClass: string;
  featured?: boolean;
}

export interface VideoContent {
  id: number;
  title: string;
  category: 'Bridal Transformations' | 'Party Glam' | 'Tutorials' | 'Behind the Scenes';
  thumbnail: string;
  duration: string;
  views: string;
  gradient: string;
  accentColor: string;
}

export const portfolioItems: PortfolioItem[] = [
  // BRIDAL - 4 items
  {
    id: 1,
    title: "Traditional Bridal Glam",
    category: "Bridal",
    description: "Elegant traditional wedding look with golden highlights and flawless base, perfect for Igbo traditional weddings",
    gradient: "from-amber-900 via-yellow-800 to-yellow-700",
    accentGradient: "from-yellow-500 to-amber-400",
    isVideo: false,
    heightClass: "aspect-[3/4]",
    featured: true,
  },
  {
    id: 2,
    title: "White Wedding Belle",
    category: "Bridal",
    description: "Classic white wedding look with soft romantic eyes, glowing skin and timeless elegance",
    gradient: "from-amber-800 via-yellow-700 to-orange-600",
    accentGradient: "from-yellow-400 to-amber-300",
    isVideo: false,
    heightClass: "aspect-square",
  },
  {
    id: 3,
    title: "Bridal Party Glam",
    category: "Bridal",
    description: "Coordinated bridal party looks with subtle glamour for the entire wedding entourage",
    gradient: "from-yellow-900 via-amber-800 to-orange-700",
    accentGradient: "from-orange-400 to-yellow-300",
    isVideo: false,
    heightClass: "aspect-[4/5]",
    featured: true,
  },
  {
    id: 4,
    title: "Luxury Bridal Edition",
    category: "Bridal",
    description: "High-end bridal transformation with premium products for that special day",
    gradient: "from-stone-950 via-stone-800 to-stone-700",
    accentGradient: "from-stone-300 to-neutral-200",
    isVideo: true,
    videoThumbnail: "bridal-luxury",
    duration: "2:34",
    heightClass: "aspect-video",
  },

  // OWAMBE/EVENTS - 5 items
  {
    id: 5,
    title: "Aso-Ebi Queen",
    category: "Owambe/Events",
    description: "Bold owambe party look with dramatic lashes, perfect for Aso-Ebi events and family gatherings",
    gradient: "from-amber-800 via-yellow-700 to-orange-600",
    accentGradient: "from-yellow-400 to-amber-300",
    isVideo: false,
    heightClass: "aspect-[3/4]",
    featured: true,
  },
  {
    id: 6,
    title: "Party Ready Glam",
    category: "Owambe/Events",
    description: "Long-lasting glam with high-wattage highlight for all-night celebrations and club appearances",
    gradient: "from-amber-900 via-yellow-800 to-orange-700",
    accentGradient: "from-yellow-400 to-orange-300",
    isVideo: false,
    heightClass: "aspect-square",
  },
  {
    id: 7,
    title: "Birthday Celebration",
    category: "Owambe/Events",
    description: "Radiant birthday look with dewy skin and champagne pops of color",
    gradient: "from-amber-700 via-yellow-600 to-orange-500",
    accentGradient: "from-yellow-300 to-amber-200",
    isVideo: false,
    heightClass: "aspect-[4/5]",
  },
  {
    id: 8,
    title: "Anniversary Night",
    category: "Owambe/Events",
    description: "Sophisticated date night look with soft glam and romantic undertones",
    gradient: "from-amber-800 via-yellow-700 to-orange-600",
    accentGradient: "from-yellow-400 to-amber-300",
    isVideo: false,
    heightClass: "aspect-[3/4]",
  },
  {
    id: 9,
    title: "Night Party Transformation",
    category: "Owambe/Events",
    description: "Full party glam transformation video - from natural to stunning",
    gradient: "from-amber-900 via-yellow-800 to-orange-700",
    accentGradient: "from-yellow-400 to-orange-300",
    isVideo: true,
    videoThumbnail: "party-glam",
    duration: "1:45",
    instagramUrl: "party-glam-reel",
    heightClass: "aspect-video",
  },

  // EDITORIAL - 4 items
  {
    id: 10,
    title: "Studio Editorial",
    category: "Editorial",
    description: "High-fashion editorial look for magazine shoots and professional photography",
    gradient: "from-stone-950 via-stone-800 to-stone-700",
    accentGradient: "from-stone-300 to-neutral-200",
    isVideo: false,
    heightClass: "aspect-[3/4]",
    featured: true,
  },
  {
    id: 11,
    title: "Cover Ready",
    category: "Editorial",
    description: "Bold editorial statement look with statement lips and dramatic eyes",
    gradient: "from-amber-900 via-yellow-800 to-orange-700",
    accentGradient: "from-yellow-400 to-amber-300",
    isVideo: false,
    heightClass: "aspect-square",
  },
  {
    id: 12,
    title: "Professional Headshots",
    category: "Editorial",
    description: "Polished professional looks for LinkedIn, corporate profiles and business branding",
    gradient: "from-stone-900 via-stone-700 to-stone-600",
    accentGradient: "from-stone-300 to-stone-200",
    isVideo: false,
    heightClass: "aspect-[4/5]",
  },
  {
    id: 13,
    title: "Fashion Week Backstage",
    category: "Editorial",
    description: "Quick editorial transformation behind the scenes at Lagos Fashion Week",
    gradient: "from-amber-800 via-yellow-700 to-orange-600",
    accentGradient: "from-yellow-400 to-amber-300",
    isVideo: true,
    videoThumbnail: "fashion-week",
    duration: "3:12",
    heightClass: "aspect-video",
  },

  // DARK SKIN - 5 items (showcasing expertise)
  {
    id: 14,
    title: "Melanin Magic",
    category: "Dark Skin",
    description: "Celebrating deep skin tones with warm golds and bronze finishes that pop",
    gradient: "from-yellow-900 via-amber-800 to-orange-700",
    accentGradient: "from-orange-400 to-yellow-300",
    isVideo: false,
    heightClass: "aspect-[3/4]",
    featured: true,
  },
  {
    id: 15,
    title: "Rich Chocolate Glow",
    category: "Dark Skin",
    description: "Deep skin radiance with bronze tones and luminous highlights",
    gradient: "from-amber-900 via-orange-800 to-yellow-700",
    accentGradient: "from-yellow-400 to-amber-300",
    isVideo: false,
    heightClass: "aspect-square",
  },
  {
    id: 16,
    title: "Deep Skin Highlight",
    category: "Dark Skin",
    description: "Custom highlighter techniques specifically for deeper skin tones",
    gradient: "from-orange-900 via-amber-700 to-yellow-600",
    accentGradient: "from-amber-400 to-yellow-300",
    isVideo: false,
    heightClass: "aspect-[4/5]",
  },
  {
    id: 17,
    title: "Chocolate Gold",
    category: "Dark Skin",
    description: "Luxurious gold-toned glam that enhances natural dark skin beauty",
    gradient: "from-yellow-800 via-amber-600 to-orange-700",
    accentGradient: "from-amber-300 to-orange-200",
    isVideo: false,
    heightClass: "aspect-[3/4]",
  },
  {
    id: 18,
    title: "Dark Skin Deep Dive",
    category: "Dark Skin",
    description: "Full tutorial on makeup techniques specifically for deep dark skin tones",
    gradient: "from-yellow-900 via-orange-800 to-amber-700",
    accentGradient: "from-orange-500 to-yellow-400",
    isVideo: true,
    videoThumbnail: "dark-skin-tutorial",
    duration: "8:45",
    instagramUrl: "dark-skin-reel",
    heightClass: "aspect-video",
    featured: true,
  },

  // BOLD/AFROCENTRIC - 4 items
  {
    id: 19,
    title: "Gele Tying Special",
    category: "Bold/Afrocentric",
    description: "Complete gele tying transformation with matching makeup for traditional events",
    gradient: "from-amber-800 via-yellow-700 to-orange-600",
    accentGradient: "from-yellow-400 to-amber-300",
    isVideo: false,
    heightClass: "aspect-[3/4]",
    featured: true,
  },
  {
    id: 20,
    title: "Ankara Bold",
    category: "Bold/Afrocentric",
    description: "Vibrant Ankara print-inspired look with bold color blocking on eyes",
    gradient: "from-amber-900 via-yellow-800 to-orange-700",
    accentGradient: "from-yellow-400 to-orange-300",
    isVideo: false,
    heightClass: "aspect-square",
  },
  {
    id: 21,
    title: "Traditional Print Queen",
    category: "Bold/Afrocentric",
    description: "Cultural fusion look combining contemporary artistry with traditional prints",
    gradient: "from-amber-800 via-yellow-700 to-orange-600",
    accentGradient: "from-yellow-400 to-amber-300",
    isVideo: false,
    heightClass: "aspect-[4/5]",
  },
  {
    id: 22,
    title: "Afrobeat Diva",
    category: "Bold/Afrocentric",
    description: "Music video ready look with bold graphics and fierce attitude",
    gradient: "from-amber-900 via-yellow-800 to-orange-700",
    accentGradient: "from-yellow-400 to-amber-300",
    isVideo: true,
    videoThumbnail: "afrobeat",
    duration: "2:15",
    heightClass: "aspect-video",
  },

  // SOFT GLAM - 4 items
  {
    id: 23,
    title: "Soft Glow",
    category: "Soft Glam",
    description: "Natural, dewy finish for everyday elegance and minimal makeup days",
    gradient: "from-amber-700 via-yellow-600 to-orange-500",
    accentGradient: "from-yellow-300 to-amber-200",
    isVideo: false,
    heightClass: "aspect-[3/4]",
    featured: true,
  },
  {
    id: 24,
    title: "Date Night Soft",
    category: "Soft Glam",
    description: "Romantic soft glam with subtle shimmer and enhanced natural features",
    gradient: "from-amber-600 via-yellow-500 to-orange-400",
    accentGradient: "from-yellow-300 to-amber-200",
    isVideo: false,
    heightClass: "aspect-square",
  },
  {
    id: 25,
    title: "Everyday Radiance",
    category: "Soft Glam",
    description: "Quick everyday glam that's camera-ready but still looks like natural skin",
    gradient: "from-amber-700 via-yellow-600 to-orange-500",
    accentGradient: "from-yellow-300 to-amber-200",
    isVideo: false,
    heightClass: "aspect-[4/5]",
  },
  {
    id: 26,
    title: "Minimal to Max",
    category: "Soft Glam",
    description: "Watch the transformation from minimal makeup to full glam in real-time",
    gradient: "from-amber-800 via-yellow-700 to-orange-600",
    accentGradient: "from-yellow-300 to-amber-200",
    isVideo: true,
    videoThumbnail: "minimal-max",
    duration: "4:20",
    instagramUrl: "soft-glam-reel",
    heightClass: "aspect-video",
  },
];

// Video content for the video section
export const videoContent: VideoContent[] = [
  {
    id: 1,
    title: "Bridal Transformation Start to Finish",
    category: "Bridal Transformations",
    thumbnail: "bridal-transform",
    duration: "12:34",
    views: "45K",
    gradient: "from-amber-900 via-yellow-800 to-orange-700",
    accentColor: "amber",
  },
  {
    id: 2,
    title: "Owambe Party Glam Tutorial",
    category: "Party Glam",
    thumbnail: "owambe-tutorial",
    duration: "8:22",
    views: "32K",
    gradient: "from-amber-800 via-yellow-700 to-orange-600",
    accentColor: "amber",
  },
  {
    id: 3,
    title: "How to Highlight Dark Skin",
    category: "Tutorials",
    thumbnail: "highlight-tutorial",
    duration: "15:45",
    views: "78K",
    gradient: "from-yellow-800 via-amber-700 to-orange-600",
    accentColor: "yellow",
  },
  {
    id: 4,
    title: "Behind the Scenes - Wedding Day",
    category: "Behind the Scenes",
    thumbnail: "bts-wedding",
    duration: "6:15",
    views: "18K",
    gradient: "from-stone-900 via-stone-700 to-stone-600",
    accentColor: "stone",
  },
  {
    id: 5,
    title: "Gele Tying & Makeup Combo",
    category: "Tutorials",
    thumbnail: "gele-tutorial",
    duration: "18:30",
    views: "56K",
    gradient: "from-amber-800 via-yellow-700 to-orange-600",
    accentColor: "amber",
  },
  {
    id: 6,
    title: "Quick 5-Minute Glam",
    category: "Tutorials",
    thumbnail: "quick-glam",
    duration: "5:00",
    views: "92K",
    gradient: "from-amber-700 via-yellow-600 to-orange-500",
    accentColor: "amber",
  },
];

export const categories: PortfolioCategory[] = [
  "All",
  "Bridal",
  "Owambe/Events",
  "Editorial",
  "Dark Skin",
  "Bold/Afrocentric",
  "Soft Glam",
  "Reels/Videos",
];

export const videoCategories = [
  "All",
  "Bridal Transformations",
  "Party Glam",
  "Tutorials",
  "Behind the Scenes",
];
