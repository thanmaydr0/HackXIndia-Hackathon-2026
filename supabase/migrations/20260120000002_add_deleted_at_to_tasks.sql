-- Add deleted_at column to tasks table for soft deletes
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Update RLS policies to exclude deleted tasks by default (optional, but good practice)
-- This depends on existing policies, but generally we want to filter them out in queries
-- For now, we'll just handle it in the application query logic (is_deleted check or deleted_at is null)
