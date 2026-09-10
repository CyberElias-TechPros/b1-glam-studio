import { Env } from '../types';
import { generateUUID } from '../utils/crypto';
import { successResponse, errorResponse } from '../utils/response';
import { requireAuth } from '../middleware/auth';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function handleUploadRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  const path = url.pathname;
  const method = request.method;

  // 1. POST /api/upload (Admin or public review upload)
  if (path === '/api/upload' && method === 'POST') {
    try {
      const contentType = request.headers.get('content-type') || '';
      
      let fileBuffer: ArrayBuffer | null = null;
      let mimeType = 'image/jpeg';
      let originalName = 'upload.jpg';

      if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || typeof file === 'string') {
          return errorResponse('No file provided in form data', 400);
        }

        const fileObj = file as File;
        mimeType = fileObj.type || 'image/jpeg';
        originalName = fileObj.name || 'image.jpg';
        fileBuffer = await fileObj.arrayBuffer();
      } else if (contentType.startsWith('image/')) {
        mimeType = contentType.split(';')[0];
        fileBuffer = await request.arrayBuffer();
      } else {
        return errorResponse('Content-Type must be multipart/form-data or an image MIME type', 400);
      }

      if (!fileBuffer || fileBuffer.byteLength === 0) {
        return errorResponse('Empty file payload', 400);
      }

      if (fileBuffer.byteLength > MAX_FILE_SIZE) {
        return errorResponse('File size exceeds maximum limit of 10MB', 400);
      }

      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return errorResponse(`Invalid image format: ${mimeType}. Allowed formats: JPEG, PNG, WebP, AVIF, GIF`, 400);
      }

      const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
      const fileId = generateUUID();
      const filename = `${fileId}.${ext}`;
      const objectKey = `uploads/${new Date().getFullYear()}/${filename}`;

      // If R2 is bound, store directly into R2
      if (env.MEDIA_BUCKET) {
        await env.MEDIA_BUCKET.put(objectKey, fileBuffer, {
          httpMetadata: {
            contentType: mimeType,
            cacheControl: 'public, max-age=31536000, immutable',
          },
        });

        const publicUrl = `/api/media/${objectKey}`;
        return successResponse(
          {
            key: objectKey,
            url: publicUrl,
            size: fileBuffer.byteLength,
            mimeType,
          },
          'File uploaded successfully to R2 storage',
          undefined,
          201
        );
      }

      // If R2 is not attached locally, return data URI fallback so app never breaks
      const base64 = btoa(
        new Uint8Array(fileBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      const dataUri = `data:${mimeType};base64,${base64}`;

      return successResponse(
        {
          key: objectKey,
          url: dataUri,
          size: fileBuffer.byteLength,
          mimeType,
        },
        'File uploaded successfully',
        undefined,
        201
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Upload failed: ${msg}`, 500);
    }
  }

  // 2. GET /api/media/* (Serve file from R2)
  if (path.startsWith('/api/media/') && method === 'GET') {
    const key = path.replace('/api/media/', '');
    if (!key || !env.MEDIA_BUCKET) {
      return errorResponse('File not found or storage not configured', 404);
    }

    const object = await env.MEDIA_BUCKET.get(key);
    if (!object) {
      return errorResponse('File not found in storage', 404);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(object.body, { headers });
  }

  return errorResponse('Not found', 404);
}
