import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
}

// Create Supabase client with service role key for server-side operations
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Storage bucket names
// NOTE: These buckets should already exist in your Supabase project:
// - post-images (for image uploads)
// - post-videos (for video uploads)
// Make sure both buckets are set as public and have appropriate file size limits and policies
export const STORAGE_BUCKETS = {
  IMAGES: "post-images",
  VIDEOS: "post-videos",
} as const;
