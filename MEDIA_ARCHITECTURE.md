# MEDIA ARCHITECTURE

This document outlines the foundation and future requirements for managing media within the multi-tenant architecture.

## 1. Media model
`MediaAsset` defines a storage-agnostic asset belonging strictly to a `coupleId`, recording size, mimeType, type, and dimensions.

## 2. Media assignment model
`MediaAssignment` maps a `MediaAsset` to a specific `MediaUsage` (e.g. `HERO`, `PROFILE`, `MEMORY_COVER`). Media is reusable without duplicating files.

## 3. Couple isolation
Every asset belongs to one couple. Storage paths are scoped (e.g., `couples/{coupleId}/hero/...`). The backend API must explicitly authorize access to assets.

## 4. Media service
A unified API (`mediaService.ts`) abstracts storage operations. Components fetch data via this service instead of direct bucket requests.

## 5. Development storage
Currently, `localStorage` holds media metadata. Binary blobs aren't uploaded; instead, mock local paths (`/images/hero/hero.webp`) are assigned for development UI validation.

## 6. Future cloud storage
In production, media will be uploaded to an S3-compatible private bucket (or Supabase Storage). 

## 7. Future private storage
Buckets will enforce `public-read = false`. Direct GET requests to the bucket will fail.

## 8. Signed URLs
The backend will generate short-lived signed URLs for rendering the `MediaAsset`.

## 9. Storage key design
Files will be stored under `couples/{coupleId}/{usageType}/{uuid}.ext`. No user-provided filenames will be used in keys.

## 10. File validation
Future upload routes must strictly enforce MIME types (jpeg, webp, mp4), file sizes, and scan for malicious payloads.

## 11. Media limits
Future plans include per-couple total size quotas and duration limits for videos to control bandwidth costs.

## 12. Delete safety
Deletions will check `MediaAssignment`. If a photo is assigned to a memory, a warning or cascaded update will happen to prevent broken images.

## 13. Template integration
UI templates consume assigned assets from the `Couple` model instead of hardcoding paths.

## 14. Migration plan
When integrating the backend API, `mediaService.ts` will simply swap its `localStorage` internals with `fetch()` calls to the new backend. No UI components will need rewriting.


## STEP 20 - STORAGE SECURITY FOUNDATION

Private storage and Signed URL abstractions have been implemented in storageService.ts, laying the groundwork for secure media delivery.
