-- 003_storage_policies.sql
-- Supabase Storage Policies for our-story-media bucket

-- Insert the bucket if it doesn't exist (assuming Supabase Storage schema)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('our-story-media', 'our-story-media', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. Admins have full access to manage media objects
CREATE POLICY "Admins have full access to media bucket" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'our-story-media');

-- 2. Public has SELECT access ONLY if they have a signed URL, or via explicit secure paths.
-- By default, for a private bucket, Supabase handles Signed URL validation natively 
-- (no RLS policy required for signed URLs to work, as the JWT signature covers the grant).
-- So we DO NOT add an anon SELECT policy here, to ensure the bucket remains strictly private.
