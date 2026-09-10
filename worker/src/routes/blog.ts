import { Env } from '../types';
import { generateUUID } from '../utils/crypto';
import { successResponse, errorResponse } from '../utils/response';
import { requireAuth } from '../middleware/auth';

export async function handleBlogRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  const path = url.pathname;
  const method = request.method;

  // 1. GET /api/blog (Public list posts)
  if (path === '/api/blog' && method === 'GET') {
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search')?.trim();
    const featured = url.searchParams.get('featured') === 'true';

    let query = 'SELECT id, slug, title, excerpt, category, author, featured_image, read_time, is_featured, views_count, published_at FROM blog_posts WHERE is_published = 1';
    const params: string[] = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    if (featured) {
      query += ' AND is_featured = 1';
    }
    if (search) {
      query += ' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    query += ' ORDER BY is_featured DESC, published_at DESC';

    const stmt = params.length > 0 ? env.DB.prepare(query).bind(...params) : env.DB.prepare(query);
    const { results } = await stmt.all();

    return successResponse(results);
  }

  // 2. GET /api/blog/:slug (Public get single post)
  const slugMatch = path.match(/^\/api\/blog\/([a-zA-Z0-9_-]+)$/);
  if (slugMatch && method === 'GET') {
    const slug = slugMatch[1];
    const post = await env.DB.prepare('SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1')
      .bind(slug)
      .first<{ id: string; views_count: number }>();

    if (!post) {
      return errorResponse('Post not found', 404);
    }

    // Increment views count asynchronously
    await env.DB.prepare('UPDATE blog_posts SET views_count = views_count + 1 WHERE id = ?')
      .bind(post.id)
      .run();

    // Get comments
    const comments = await env.DB.prepare(
      'SELECT id, author_name, comment, created_at FROM blog_comments WHERE post_id = ? AND status = "approved" ORDER BY created_at DESC'
    ).bind(post.id).all();

    return successResponse({
      ...post,
      comments: comments.results,
    });
  }

  // 3. POST /api/blog/:id/comments (Public submit comment)
  const commentMatch = path.match(/^\/api\/blog\/([a-zA-Z0-9_-]+)\/comments$/);
  if (commentMatch && method === 'POST') {
    const postIdOrSlug = commentMatch[1];
    try {
      const body = await request.json() as {
        authorName?: string;
        authorEmail?: string;
        comment?: string;
      };

      const authorName = body.authorName?.trim();
      const comment = body.comment?.trim();

      if (!authorName || !comment) {
        return errorResponse('Name and comment text are required', 400);
      }

      // Resolve post id
      const post = await env.DB.prepare('SELECT id FROM blog_posts WHERE id = ? OR slug = ?')
        .bind(postIdOrSlug, postIdOrSlug)
        .first<{ id: string }>();

      if (!post) return errorResponse('Post not found', 404);

      const id = generateUUID();
      const now = new Date().toISOString();

      await env.DB.prepare(
        'INSERT INTO blog_comments (id, post_id, author_name, author_email, comment, status, created_at) VALUES (?, ?, ?, ?, ?, "approved", ?)'
      ).bind(id, post.id, authorName, body.authorEmail?.trim() || null, comment, now).run();

      return successResponse({ id, authorName, comment, created_at: now }, 'Comment posted successfully!', undefined, 201);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to submit comment: ${msg}`, 500);
    }
  }

  // 4. POST /api/blog (Admin create post)
  if (path === '/api/blog' && method === 'POST') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    try {
      const body = await request.json() as {
        title?: string;
        slug?: string;
        excerpt?: string;
        content?: string;
        category?: string;
        author?: string;
        featuredImage?: string;
        readTime?: string;
        isFeatured?: boolean;
        isPublished?: boolean;
      };

      const title = body.title?.trim();
      if (!title) return errorResponse('Post title is required', 400);

      const slug = (body.slug?.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
      const excerpt = body.excerpt?.trim() || title;
      const content = body.content || '';
      const category = body.category || 'tips';
      const author = body.author?.trim() || authGuard.user.name || 'B1touch';
      const id = generateUUID();
      const now = new Date().toISOString();

      await env.DB.prepare(
        `INSERT INTO blog_posts (
          id, slug, title, excerpt, content, category, author,
          featured_image, read_time, is_featured, is_published,
          views_count, published_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`
      ).bind(
        id,
        slug,
        title,
        excerpt,
        content,
        category,
        author,
        body.featuredImage || null,
        body.readTime || '4 min read',
        body.isFeatured ? 1 : 0,
        body.isPublished !== false ? 1 : 0,
        now,
        now,
        now
      ).run();

      return successResponse({ id, slug, title }, 'Blog post created successfully', undefined, 201);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to create post: ${msg}`, 500);
    }
  }

  // 5. PUT /api/blog/:id (Admin update post)
  if (slugMatch && method === 'PUT') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const id = slugMatch[1];
    try {
      const body = await request.json() as {
        title?: string;
        slug?: string;
        excerpt?: string;
        content?: string;
        category?: string;
        author?: string;
        featuredImage?: string;
        readTime?: string;
        isFeatured?: boolean;
        isPublished?: boolean;
      };

      const now = new Date().toISOString();
      await env.DB.prepare(
        `UPDATE blog_posts SET
          title = COALESCE(?, title),
          slug = COALESCE(?, slug),
          excerpt = COALESCE(?, excerpt),
          content = COALESCE(?, content),
          category = COALESCE(?, category),
          author = COALESCE(?, author),
          featured_image = COALESCE(?, featured_image),
          read_time = COALESCE(?, read_time),
          is_featured = COALESCE(?, is_featured),
          is_published = COALESCE(?, is_published),
          updated_at = ?
         WHERE id = ?`
      ).bind(
        body.title || null,
        body.slug || null,
        body.excerpt || null,
        body.content || null,
        body.category || null,
        body.author || null,
        body.featuredImage || null,
        body.readTime || null,
        body.isFeatured !== undefined ? (body.isFeatured ? 1 : 0) : null,
        body.isPublished !== undefined ? (body.isPublished ? 1 : 0) : null,
        now,
        id
      ).run();

      return successResponse(null, 'Blog post updated successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to update post: ${msg}`, 500);
    }
  }

  // 6. DELETE /api/blog/:id (Admin delete post)
  if (slugMatch && method === 'DELETE') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const id = slugMatch[1];
    await env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id).run();
    return successResponse(null, 'Blog post deleted successfully');
  }

  return errorResponse('Not found', 404);
}
