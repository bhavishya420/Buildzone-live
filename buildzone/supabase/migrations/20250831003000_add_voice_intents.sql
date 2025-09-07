-- Location: supabase/migrations/20250831003000_add_voice_intents.sql
-- Schema Analysis: Existing user_profiles table with standard structure
-- Integration Type: Addition - Adding voice ordering functionality
-- Dependencies: user_profiles table (existing)

-- Create voice_intents table for demo AI voice ordering
CREATE TABLE public.voice_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    raw_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Essential indexes
CREATE INDEX idx_voice_intents_user_id ON public.voice_intents(user_id);
CREATE INDEX idx_voice_intents_created_at ON public.voice_intents(created_at);

-- Enable RLS
ALTER TABLE public.voice_intents ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Pattern 2: Simple User Ownership
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
    
    -- Create sample voice intents using existing user
    IF existing_user_id IS NOT NULL THEN
        INSERT INTO public.voice_intents (user_id, raw_text)
        VALUES 
            (existing_user_id, 'Order 10 PVC pipes for construction project'),
            (existing_user_id, 'I need 5 bags of cement and 20 steel rods'),
            (existing_user_id, 'Can you get me electrical wire and switches');
    ELSE
        RAISE NOTICE 'No existing users found. Voice intents will be created when users place voice orders.';
    END IF;
END $$;