-- Function to increment view count for lost items
CREATE OR REPLACE FUNCTION increment_lost_item_views(item_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE lost_items
  SET views = COALESCE(views, 0) + 1
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment view count for found items
CREATE OR REPLACE FUNCTION increment_found_item_views(item_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE found_items
  SET views = COALESCE(views, 0) + 1
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lost_items_category ON lost_items(category);
CREATE INDEX IF NOT EXISTS idx_lost_items_status ON lost_items(status);
CREATE INDEX IF NOT EXISTS idx_lost_items_location ON lost_items USING gin(to_tsvector('english', location));
CREATE INDEX IF NOT EXISTS idx_lost_items_created_at ON lost_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lost_items_user_id ON lost_items(user_id);
CREATE INDEX IF NOT EXISTS idx_lost_items_tags ON lost_items USING gin(tags);

CREATE INDEX IF NOT EXISTS idx_found_items_category ON found_items(category);
CREATE INDEX IF NOT EXISTS idx_found_items_status ON found_items(status);
CREATE INDEX IF NOT EXISTS idx_found_items_location ON found_items USING gin(to_tsvector('english', location));
CREATE INDEX IF NOT EXISTS idx_found_items_created_at ON found_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_found_items_user_id ON found_items(user_id);
CREATE INDEX IF NOT EXISTS idx_found_items_tags ON found_items USING gin(tags);

CREATE INDEX IF NOT EXISTS idx_share_items_category ON share_items(category);
CREATE INDEX IF NOT EXISTS idx_share_items_status ON share_items(status);
CREATE INDEX IF NOT EXISTS idx_share_items_location ON share_items USING gin(to_tsvector('english', location));
CREATE INDEX IF NOT EXISTS idx_share_items_created_at ON share_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_share_items_user_id ON share_items(user_id);
CREATE INDEX IF NOT EXISTS idx_share_items_tags ON share_items USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_share_items_offer_type ON share_items(offer_type);
CREATE INDEX IF NOT EXISTS idx_share_items_condition ON share_items(condition);
