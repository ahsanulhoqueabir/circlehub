-- Enable Row Level Security
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    university VARCHAR(255),
    student_id VARCHAR(100),
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('admin', 'student')),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lost_items table
CREATE TABLE IF NOT EXISTS public.lost_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date_lost DATE NOT NULL,
    image_url TEXT,
    contact_info VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'found', 'closed')),
    tags TEXT[],
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create found_items table
CREATE TABLE IF NOT EXISTS public.found_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date_found DATE NOT NULL,
    image_url TEXT,
    contact_info VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'returned')),
    tags TEXT[],
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create share_items table
CREATE TABLE IF NOT EXISTS public.share_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    condition VARCHAR(50) NOT NULL CHECK (condition IN ('new', 'like-new', 'good', 'fair')),
    offer_type VARCHAR(20) NOT NULL CHECK (offer_type IN ('free', 'sale')),
    price DECIMAL(10,2),
    location VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255) NOT NULL,
    image_url TEXT,
    tags TEXT[],
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'shared')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT price_required_for_sale CHECK (
        (offer_type = 'sale' AND price IS NOT NULL AND price > 0) OR
        (offer_type = 'free' AND price IS NULL)
    )
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_items ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for lost_items
CREATE POLICY "Anyone can view lost items" ON public.lost_items FOR SELECT USING (true);
CREATE POLICY "Users can create lost items" ON public.lost_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lost items" ON public.lost_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own lost items" ON public.lost_items FOR DELETE USING (auth.uid() = user_id);

-- Create policies for found_items
CREATE POLICY "Anyone can view found items" ON public.found_items FOR SELECT USING (true);
CREATE POLICY "Users can create found items" ON public.found_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own found items" ON public.found_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own found items" ON public.found_items FOR DELETE USING (auth.uid() = user_id);

-- Create policies for share_items
CREATE POLICY "Anyone can view share items" ON public.share_items FOR SELECT USING (true);
CREATE POLICY "Users can create share items" ON public.share_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own share items" ON public.share_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own share items" ON public.share_items FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lost_items_user_id ON public.lost_items(user_id);
CREATE INDEX IF NOT EXISTS idx_lost_items_status ON public.lost_items(status);
CREATE INDEX IF NOT EXISTS idx_lost_items_category ON public.lost_items(category);
CREATE INDEX IF NOT EXISTS idx_found_items_user_id ON public.found_items(user_id);
CREATE INDEX IF NOT EXISTS idx_found_items_status ON public.found_items(status);
CREATE INDEX IF NOT EXISTS idx_found_items_category ON public.found_items(category);
CREATE INDEX IF NOT EXISTS idx_share_items_user_id ON public.share_items(user_id);
CREATE INDEX IF NOT EXISTS idx_share_items_status ON public.share_items(status);
CREATE INDEX IF NOT EXISTS idx_share_items_category ON public.share_items(category);
CREATE INDEX IF NOT EXISTS idx_share_items_offer_type ON public.share_items(offer_type);

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER trigger_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_lost_items_updated_at 
    BEFORE UPDATE ON public.lost_items 
    FOR EACH ROW 
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_found_items_updated_at 
    BEFORE UPDATE ON public.found_items 
    FOR EACH ROW 
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_share_items_updated_at 
    BEFORE UPDATE ON public.share_items 
    FOR EACH ROW 
    EXECUTE FUNCTION handle_updated_at();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();