-- Enable Row Level Security
ALTER DATABASE postgres SET timezone TO 'UTC';

-- Notes table (core feature)
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('chain', 'app', 'token')),
  entity_id TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own notes" ON notes
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_notes_entity ON notes(entity_type, entity_id);
CREATE INDEX idx_notes_user ON notes(user_id);

-- Cache table for LayerZero chain stats
CREATE TABLE cached_chain_stats (
  chain_eid TEXT PRIMARY KEY,
  chain_name TEXT NOT NULL,
  total_messages BIGINT,
  total_volume_usd NUMERIC,
  active_oapps INT,
  connected_chains JSONB,
  tier TEXT CHECK (tier IN ('P0', 'P1', 'P2', 'P3', 'P4')),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Cache table for protocols/OApps
CREATE TABLE cached_protocols (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  category TEXT,
  chains JSONB,
  tvl_usd NUMERIC,
  revenue_30d NUMERIC,
  fees_30d NUMERIC,
  active_users_30d INT,
  is_oapp BOOLEAN DEFAULT false,
  oapp_address TEXT,
  connected_chain_eids JSONB,
  lz_messages_30d BIGINT,
  lz_volume_usd_30d NUMERIC,
  logo_url TEXT,
  website TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Cache table for OFT tokens
CREATE TABLE cached_tokens (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  is_oft BOOLEAN DEFAULT false,
  deployed_chains JSONB,
  market_cap_usd NUMERIC,
  price_usd NUMERIC,
  volume_24h_usd NUMERIC,
  price_change_24h NUMERIC,
  contract_addresses JSONB,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  pinned_chains JSONB DEFAULT '[]',
  pinned_apps JSONB DEFAULT '[]',
  pinned_tokens JSONB DEFAULT '[]',
  default_filter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
