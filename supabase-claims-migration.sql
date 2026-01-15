-- Create claims table for found items
CREATE TABLE IF NOT EXISTS public.found_item_claims (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    found_item_id UUID REFERENCES public.found_items(id) ON DELETE CASCADE NOT NULL,
    claimer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    message TEXT,
    contact_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(found_item_id, claimer_id)
);

-- Enable Row Level Security
ALTER TABLE public.found_item_claims ENABLE ROW LEVEL SECURITY;

-- Create policies for found_item_claims
-- Anyone can view claims for items they posted
CREATE POLICY "Item owners can view claims on their items" 
ON public.found_item_claims FOR SELECT 
USING (
    found_item_id IN (
        SELECT id FROM public.found_items WHERE user_id = auth.uid()
    )
);

-- Users can view their own claims
CREATE POLICY "Users can view own claims" 
ON public.found_item_claims FOR SELECT 
USING (auth.uid() = claimer_id);

-- Users can create claims
CREATE POLICY "Users can create claims" 
ON public.found_item_claims FOR INSERT 
WITH CHECK (auth.uid() = claimer_id);

-- Only item owners can update claims
CREATE POLICY "Item owners can update claims" 
ON public.found_item_claims FOR UPDATE 
USING (
    found_item_id IN (
        SELECT id FROM public.found_items WHERE user_id = auth.uid()
    )
);

-- Users can delete their own pending claims
CREATE POLICY "Users can delete own pending claims" 
ON public.found_item_claims FOR DELETE 
USING (
    auth.uid() = claimer_id AND status = 'pending'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_found_item_claims_item_id ON public.found_item_claims(found_item_id);
CREATE INDEX IF NOT EXISTS idx_found_item_claims_claimer_id ON public.found_item_claims(claimer_id);
CREATE INDEX IF NOT EXISTS idx_found_item_claims_status ON public.found_item_claims(status);
CREATE INDEX IF NOT EXISTS idx_found_item_claims_created_at ON public.found_item_claims(created_at DESC);

-- Function to get claim count for a found item
CREATE OR REPLACE FUNCTION get_found_item_claim_count(item_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.found_item_claims WHERE found_item_id = item_id);
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has claimed an item
CREATE OR REPLACE FUNCTION has_user_claimed_item(item_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM public.found_item_claims 
        WHERE found_item_id = item_id AND claimer_id = user_id
    );
END;
$$ LANGUAGE plpgsql;

-- Trigger to update found_item status when claim is approved
CREATE OR REPLACE FUNCTION update_found_item_on_claim_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        UPDATE public.found_items 
        SET status = 'claimed', updated_at = NOW()
        WHERE id = NEW.found_item_id;
        
        -- Reject all other pending claims for this item
        UPDATE public.found_item_claims
        SET status = 'rejected', updated_at = NOW()
        WHERE found_item_id = NEW.found_item_id 
        AND id != NEW.id 
        AND status = 'pending';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_found_item_on_claim_approval
AFTER UPDATE ON public.found_item_claims
FOR EACH ROW
EXECUTE FUNCTION update_found_item_on_claim_approval();
