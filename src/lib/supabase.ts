import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase env vars. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Database Types ───────────────────────────────────────

export interface Profile {
  id: string;
  name: string;
  role: string;
  company: string;
  company_url: string;
  bio_intro: string;
  bio_hobbies: string;
  location: string;
  avatar_url?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  overview: string;
  category: string;
  tags: string[];
  image_url?: string;
  bg_color: string;
  featured: boolean;
  order_index: number;
  case_study_url?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  company_url?: string;
  order_index: number;
  is_visible: boolean;
}

export interface Skill {
  id: string;
  name: string;
  color: string;
  order_index: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  order_index: number;
}

export interface Software {
  id: string;
  name: string;
  slug: string;
  order_index: number;
}