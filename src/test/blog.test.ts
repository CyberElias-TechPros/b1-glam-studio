import { describe, it, expect, beforeEach } from 'vitest';
import { api } from '@/lib/api';
import { getPostBySlug, getPostsByCategory } from '@/data/blog';

describe('Blog & Editorial Services', () => {
  it('should find static blog post by slug', () => {
    const post = getPostBySlug('top-5-bridal-makeup-looks-dark-skin-2026');
    expect(post).toBeDefined();
    expect(post?.title).toContain('Bridal Makeup Looks');
    expect(post?.category).toBe('bridal');
  });

  it('should filter blog posts by category', () => {
    const bridalPosts = getPostsByCategory('bridal');
    expect(bridalPosts.length).toBeGreaterThan(0);
    expect(bridalPosts.every((p) => p.category === 'bridal')).toBe(true);

    const allPosts = getPostsByCategory('all');
    expect(allPosts.length).toBeGreaterThanOrEqual(6);
  });

  it('should add comment to a blog post via API', async () => {
    const slug = 'top-5-bridal-makeup-looks-dark-skin-2026';
    const commentRes = await api.blog.addComment(slug, 'Fatima Aliyu', 'Loved the tips on warm undertones!');
    expect(commentRes.success).toBe(true);
    expect(commentRes.data?.author_name).toBe('Fatima Aliyu');

    const getRes = await api.blog.get(slug);
    expect(getRes.success).toBe(true);
    expect(getRes.data?.comments?.some((c) => c.author_name === 'Fatima Aliyu')).toBe(true);
  });
});

describe('Testimonials and Reviews', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should submit a client review and retrieve it', async () => {
    const submitRes = await api.testimonials.submit({
      name: 'Simi Gold',
      eventType: 'Birthday Glam',
      rating: 5,
      quote: 'The beat was immaculate! Held up through my entire party.',
    });

    expect(submitRes.success).toBe(true);
    expect(submitRes.data?.id).toBeDefined();

    const listRes = await api.testimonials.getApproved();
    expect(listRes.success).toBe(true);
    expect(listRes.data?.some((r) => r.name === 'Simi Gold')).toBe(true);
  });
});

describe('Newsletter Subscription', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should register subscriber without duplicates', async () => {
    const sub1 = await api.newsletter.subscribe('beauty@b1touch.com', 'footer');
    expect(sub1.success).toBe(true);

    const sub2 = await api.newsletter.subscribe('beauty@b1touch.com', 'blog');
    expect(sub2.success).toBe(true);

    const list = await api.newsletter.list();
    const matches = list.data?.filter((s) => s.email === 'beauty@b1touch.com');
    expect(matches?.length).toBe(1);
  });
});
