-- 004_media_assignments.sql
-- Database schema for media assignments

CREATE TABLE IF NOT EXISTS media_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
    media_id UUID REFERENCES media_assets(id) ON DELETE CASCADE NOT NULL,
    usage TEXT NOT NULL CHECK (usage IN ('HERO', 'PROFILE', 'MEMORY_COVER', 'MEMORY_VIDEO', 'TIMELINE', 'GALLERY', 'BACKGROUND_AUDIO', 'ENDING_AUDIO')),
    reference_id TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique index to prevent duplicate assignments for the exact same usage context
CREATE UNIQUE INDEX IF NOT EXISTS idx_media_assignments_unique 
ON media_assignments (couple_id, media_id, usage, COALESCE(reference_id, ''));

-- Lookup indexes
CREATE INDEX IF NOT EXISTS idx_media_assignments_couple_id ON media_assignments(couple_id);
CREATE INDEX IF NOT EXISTS idx_media_assignments_media_id ON media_assignments(media_id);
CREATE INDEX IF NOT EXISTS idx_media_assignments_usage ON media_assignments(usage);

-- Enable RLS
ALTER TABLE media_assignments ENABLE ROW LEVEL SECURITY;

-- Admin Policy: Authenticated users have full access (matches existing V1 model)
DO \$\$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'media_assignments' 
        AND policyname = 'Admins have full access to media_assignments'
    ) THEN
        CREATE POLICY "Admins have full access to media_assignments" 
        ON media_assignments 
        FOR ALL TO authenticated USING (true);
    END IF;
END
\$\$;
