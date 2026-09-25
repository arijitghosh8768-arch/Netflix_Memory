-- 001_initial_schema.sql
-- Core Production Schema for OUR STORY Multi-Tenant Architecture

CREATE TYPE couple_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

CREATE TABLE templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    version TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE couples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    person1_name TEXT NOT NULL,
    person2_name TEXT NOT NULL,
    relationship_start DATE NOT NULL,
    hero_title TEXT,
    description TEXT,
    final_message TEXT,
    template_id TEXT REFERENCES templates(id) NOT NULL DEFAULT 'cinematic',
    status couple_status NOT NULL DEFAULT 'DRAFT',
    
    hero_media_id UUID,
    profile_media_id UUID,
    
    counter_enabled BOOLEAN DEFAULT true,
    counter_start_date DATE,
    ending_title TEXT,
    ending_quote TEXT,
    background_audio_media_id UUID,
    ending_audio_media_id UUID,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('IMAGE', 'VIDEO', 'AUDIO')),
    name TEXT NOT NULL,
    storage_key TEXT NOT NULL UNIQUE,
    mime_type TEXT NOT NULL,
    size BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Foreign keys to media assets (deferrable or added after to avoid circular refs, handled via simple UUID for now)
ALTER TABLE couples ADD CONSTRAINT fk_hero_media FOREIGN KEY (hero_media_id) REFERENCES media_assets(id) ON DELETE SET NULL;
ALTER TABLE couples ADD CONSTRAINT fk_profile_media FOREIGN KEY (profile_media_id) REFERENCES media_assets(id) ON DELETE SET NULL;
ALTER TABLE couples ADD CONSTRAINT fk_bg_audio FOREIGN KEY (background_audio_media_id) REFERENCES media_assets(id) ON DELETE SET NULL;
ALTER TABLE couples ADD CONSTRAINT fk_ending_audio FOREIGN KEY (ending_audio_media_id) REFERENCES media_assets(id) ON DELETE SET NULL;

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    theme TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    cover_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    video_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    duration TEXT,
    featured BOOLEAN DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_couples_slug ON couples(slug);
CREATE INDEX idx_couples_status ON couples(status);
CREATE INDEX idx_media_couple_id ON media_assets(couple_id);
CREATE INDEX idx_profiles_couple_id ON profiles(couple_id);
CREATE INDEX idx_memories_couple_id ON memories(couple_id);
CREATE INDEX idx_timeline_couple_id ON timeline_events(couple_id);
