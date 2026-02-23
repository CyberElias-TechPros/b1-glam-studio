// Sample ad data - In production, this would come from an ad network API
export interface AdData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  type: 'banner' | 'rectangle' | 'native';
}

// Sample ads for demonstration
export const sampleAds: AdData[] = [
  {
    id: 'ad-1',
    title: 'Luxury Skincare Collection',
    description: 'Discover premium skincare products perfect for dark skin tones. Get 20% off your first order.',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
    linkUrl: 'https://example.com/skincare',
    type: 'rectangle',
  },
  {
    id: 'ad-2',
    title: 'Professional Makeup Brushes',
    description: 'Handcrafted brushes for flawless application. Shop the complete collection.',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
    linkUrl: 'https://example.com/brushes',
    type: 'native',
  },
  {
    id: 'ad-3',
    title: 'Bridal Beauty Package',
    description: 'Make your special day unforgettable with our exclusive bridal makeup services.',
    imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=300&h=200&fit=crop',
    linkUrl: 'https://example.com/bridal',
    type: 'rectangle',
  },
  {
    id: 'ad-4',
    title: 'Beauty Masterclass',
    description: 'Learn professional makeup techniques from industry experts. Online courses available.',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=200&fit=crop',
    linkUrl: 'https://example.com/masterclass',
    type: 'native',
  },
  {
    id: 'ad-5',
    title: 'Premium Hair Care',
    description: 'Nourish your natural hair with our curated selection of hair care products.',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=200&fit=crop',
    linkUrl: 'https://example.com/haircare',
    type: 'banner',
  },
];

// Helper function to get random ad
export function getRandomAd(type?: 'banner' | 'rectangle' | 'native'): AdData {
  const filteredAds = type 
    ? sampleAds.filter(ad => ad.type === type)
    : sampleAds;
  return filteredAds[Math.floor(Math.random() * filteredAds.length)];
}

// Helper function to get multiple ads
export function getAds(count: number, type?: 'banner' | 'rectangle' | 'native'): AdData[] {
  const filteredAds = type 
    ? sampleAds.filter(ad => ad.type === type)
    : sampleAds;
  const shuffled = [...filteredAds].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
