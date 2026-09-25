-- 002_rls_policies.sql
-- Row Level Security (RLS) Configuration

-- Enable RLS on all tables
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- 1. Admin Policies (Full Access for authenticated users)
-- In a real scenario with customer accounts, this would check if auth.uid() is an Admin role.
-- Since this is currently a single Admin Panel, any authenticated Supabase user is an Admin.
CREATE POLICY "Admins have full access to templates" ON templates FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access to couples" ON couples FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access to media_assets" ON media_assets FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access to profiles" ON profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access to memories" ON memories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access to timeline_events" ON timeline_events FOR ALL TO authenticated USING (true);

-- 2. Public Policies (Read-Only Access for PUBLISHED couples)
-- Templates
CREATE POLICY "Public can view templates" ON templates FOR SELECT TO anon USING (true);

-- Couples
CREATE POLICY "Public can view PUBLISHED couples" ON couples FOR SELECT TO anon 
USING (status = 'PUBLISHED');

-- Media Assets
CREATE POLICY "Public can view media for PUBLISHED couples" ON media_assets FOR SELECT TO anon
USING (
    EXISTS (
        SELECT 1 FROM couples 
        WHERE couples.id = media_assets.couple_id 
        AND couples.status = 'PUBLISHED'
    )
);

-- Profiles
CREATE POLICY "Public can view profiles for PUBLISHED couples" ON profiles FOR SELECT TO anon
USING (
    EXISTS (
        SELECT 1 FROM couples 
        WHERE couples.id = profiles.couple_id 
        AND couples.status = 'PUBLISHED'
    )
);

-- Memories
CREATE POLICY "Public can view memories for PUBLISHED couples" ON memories FOR SELECT TO anon
USING (
    EXISTS (
        SELECT 1 FROM couples 
        WHERE couples.id = memories.couple_id 
        AND couples.status = 'PUBLISHED'
    )
);

-- Timeline Events
CREATE POLICY "Public can view timeline for PUBLISHED couples" ON timeline_events FOR SELECT TO anon
USING (
    EXISTS (
        SELECT 1 FROM couples 
        WHERE couples.id = timeline_events.couple_id 
        AND couples.status = 'PUBLISHED'
    )
);
