-- Location: supabase/migrations/20250831003008_add_voice_intents_table.sql
-- Schema Analysis: Existing schema has user_profiles table with id (UUID) referencing auth.users(id)
-- Integration Type: Addition - Adding voice_intents table for AI voice ordering demo
-- Dependencies: user_profiles table (existing)

-- Create voice_intents table for storing voice order commands
CREATE TABLE public.voice_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    raw_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add essential indexes
CREATE INDEX idx_voice_intents_user_id ON public.voice_intents(user_id);
CREATE INDEX idx_voice_intents_created_at ON public.voice_intents(created_at);

-- Enable RLS
ALTER TABLE public.voice_intents ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Simple user ownership (Pattern 2)
CREATE POLICY "users_manage_own_voice_intents"
ON public.voice_intents
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Mock data for demo
DO $$
DECLARE
    existing_user_id UUID;
BEGIN
    -- Get existing user ID from user_profiles
    SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;
    
    -- Add sample voice intents if user exists
    IF existing_user_id IS NOT NULL THEN
        INSERT INTO public.voice_intents (user_id, raw_text) VALUES
            (existing_user_id, 'Order 10 PVC pipes for my construction project'),
            (existing_user_id, 'I need 50 bags of cement for tomorrow delivery'),
            (existing_user_id, 'Add 20 steel rods to my regular order');
    END IF;
    
    -- Log message if no users found
    IF existing_user_id IS NULL THEN
        RAISE NOTICE 'No existing users found. Voice intents table created but no sample data added.';
    END IF;
END $$;