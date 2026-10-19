-- ==============================================================================
-- Migration: Wedding Gallery & Supabase Storage Setup
-- Project: Arpan Kamal & Arpita Simon Christian Wedding Website
-- Created: 2026-10-19
-- ==============================================================================

-- 1. Create Storage Bucket for Wedding Photos (if not already existing)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wedding-photos',
  'wedding-photos',
  true,
  20971520, -- 20 MB max limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- 2. Create wedding_gallery table
CREATE TABLE IF NOT EXISTS public.wedding_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT UNIQUE NOT NULL,
  public_url TEXT NOT NULL,
  uploader_name TEXT,
  caption TEXT,
  function_name TEXT,
  file_size BIGINT NOT NULL,
  original_file_size BIGINT,
  mime_type TEXT NOT NULL,
  moderation_status TEXT NOT NULL DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  delete_token_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Indexes for fast query performance
CREATE INDEX IF NOT EXISTS idx_wedding_gallery_status_created 
  ON public.wedding_gallery (moderation_status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_wedding_gallery_storage_path 
  ON public.wedding_gallery (storage_path);

CREATE INDEX IF NOT EXISTS idx_wedding_gallery_function 
  ON public.wedding_gallery (function_name);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.wedding_gallery ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies on wedding_gallery Table
-- Drop existing policies if re-running migration
DROP POLICY IF EXISTS "Public visitors can view approved gallery photos" ON public.wedding_gallery;
DROP POLICY IF EXISTS "Guests can insert gallery entries" ON public.wedding_gallery;
DROP POLICY IF EXISTS "Service role has full gallery access" ON public.wedding_gallery;

-- Allow public read of approved photos
CREATE POLICY "Public visitors can view approved gallery photos"
  ON public.wedding_gallery FOR SELECT
  USING (moderation_status = 'approved');

-- Allow guests to submit new photos via API or anon client
CREATE POLICY "Guests can insert gallery entries"
  ON public.wedding_gallery FOR INSERT
  WITH CHECK (
    moderation_status IN ('approved', 'pending')
    AND storage_path IS NOT NULL
    AND public_url IS NOT NULL
  );

-- 6. Storage Policies on storage.objects for wedding-photos bucket
-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public Read Wedding Photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Wedding Photos" ON storage.objects;

-- Allow public access to view images in wedding-photos bucket
CREATE POLICY "Public Read Wedding Photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wedding-photos');

-- Allow guests to upload images into wedding-photos bucket
CREATE POLICY "Public Insert Wedding Photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'wedding-photos'
    AND (storage.foldername(name))[1] = 'guest-uploads'
  );
