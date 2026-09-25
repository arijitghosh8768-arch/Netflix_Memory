# PRODUCTION MEDIA ARCHITECTURE

This document outlines the foundation of the Supabase Private Media upload and serving system.

## Supabase Storage

The platform uses **Supabase Storage** as its private object store.
- **Bucket Name**: `our-story-media` (Conceptual)
- **Visibility**: `PRIVATE`. The bucket is not publicly readable. 

## Storage Path Design

Media objects are strictly scoped to the tenant (Couple). The key structure is:
`couples/{coupleId}/{usageType}/{uuid}.{ext}`

This structure guarantees that one couple's media is isolated within their path prefix.

## Database Metadata

Metadata is separated from binary objects. When a file is uploaded, the following happens:
1. File binary goes to Supabase Storage -> generates a `storageKey`.
2. Metadata (name, mimeType, size, coupleId, storageKey) goes to PostgreSQL (simulated by localStorage currently).

## Upload Flow

The `MediaManager` interface allows admins to upload images, videos, and audio.
1. Admin selects a file.
2. File is validated (Image < 10MB, Video < 100MB, Audio < 20MB, correct MIME types).
3. `storageService.uploadMedia()` uploads the binary to the bucket.
4. `mediaService.createMedia()` saves the metadata record.

## Signed URLs and Media Preview

Because the bucket is private, neither admins nor public users can access `https://.../couples/123/hero/img.jpg` directly.
Instead, components invoke `storageService.createSignedUrl(storageKey, coupleId)` to generate a short-lived (e.g., 1 hour) temporary URL securely signed by the backend.
- **Draft/Archived couples**: Media will not generate signed URLs for unauthorized users.
- **Published couples**: Valid requests to the public route generate signed URLs at render time.

## Deletion and Replacement

When an admin deletes media:
1. `storageService.deleteMedia(storageKey)` removes the binary from the bucket.
2. `mediaService.deleteMedia(id)` removes the metadata record.
*Note: We check for existing references (like `heroMediaId`) to prevent silently breaking the frontend.*

## Tenant Isolation & Security (RLS)

- **Upload/Delete**: Enforced via API `authService.requireAdmin()` combined with PostgreSQL/Storage RLS. An admin can only manage assets belonging to couples they are authorized to edit.
- **Bucket Policies**: Storage policies restrict `INSERT`, `UPDATE`, `DELETE` exclusively to authenticated roles. `SELECT` is restricted, forcing the usage of signed URLs for secure delivery.

## Development Fallback

If `VITE_SUPABASE_URL` is omitted, `storageService.ts` detects the missing credentials and falls back to a development mode. It simulates network delay and returns mock paths (e.g. `/images/demo-hero.jpg`) ensuring the UI remains usable for local testing without breaking the abstraction.
