# PRODUCTION DEPLOYMENT & MIGRATION

This guide explains how to take the existing foundation and deploy it to a live production environment using Supabase and Vercel.

## 1. Supabase Project Setup
1. Create a new Supabase project.
2. Navigate to **Project Settings -> API** and copy your `Project URL` and `anon public` key.
3. Open **Authentication** and ensure Email/Password login is enabled. Create an initial Admin user (e.g., `admin@ourstory.com`).

## 2. Database Migration
Using the Supabase CLI (or SQL Editor in the dashboard), execute the migration files in order:
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_rls_policies.sql`
- `supabase/migrations/003_storage_policies.sql`

This will establish the `couples`, `profiles`, `memories`, `timeline_events`, and `media_assets` tables, and correctly apply Row Level Security.

## 3. Storage Bucket Creation
The `003_storage_policies.sql` migration attempts to create the `our-story-media` bucket automatically. If this fails due to dashboard constraints:
1. Navigate to **Storage** in Supabase.
2. Create a new bucket named `our-story-media`.
3. Set the bucket to **Private**.
4. The RLS policies from the migration will secure the bucket contents.

## 4. Local Development Setup
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
Start the development server (`npm run dev`). If Supabase credentials are not found, the app safely falls back to local development mock mode.

## 5. Async Service Migration (Pending Phase)
Before going live, the local `contentService.ts` and `coupleService.ts` must be converted from synchronous `localStorage` operations to async `supabase.from('...')` calls. This involves updating React component lifecycles to handle the `await` patterns.

## 6. Vercel Deployment
1. Import the repository into Vercel.
2. Set the framework preset to **Vite**.
3. Add the following Environment Variables in the Vercel Dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. The `vercel.json` ensures that all unmatched routes correctly serve `index.html` (SPA routing).

## 7. Post-Deployment Verification
1. Access the deployed Vercel URL.
2. Navigate to `/admin/login` and authenticate.
3. Create a test couple.
4. Upload media to the Hero section (verifying Storage uploads work).
5. Publish the couple and verify the public route `/c/{slug}` successfully generates signed URLs and displays the media.
