import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Channel = 'VMA' | 'VCS';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface DBCourse {
  id: string;
  title: string;
  description: string;
  channel: Channel;
  emoji: string;
  price: number;
  badge: string | null;
  tags: string[];
  lessons: number;
  hours: number;
  students: number;
  rating: number;
  reviews: number;
  category: string;
  syllabus: { title: string; duration: string; free: boolean }[];
  what_you_wll_learn: string[];
  about: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBBlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  emoji: string;
  read_time: number;
  views: number;
  excerpt: string;
  content: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DBProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  acceptance: number;
  tags: string[];
  companies: string[];
  description: string;
  examples: { input: string; output: string; explanation: string }[];
  hints: string[];
  starter_code: Record<string, string>;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DBJob {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  type: string;
  posted: string;
  tech: string[];
  logo: string;
  link: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DBNote {
  id: string;
  title: string;
  subject: string;
  pages: number;
  size: string;
  free: boolean;
  emoji: string;
  link: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DBSiteSettings {
  id: number;
  vma_channel_id: string;
  vcs_channel_id: string;
  vma_subscribers: string;
  vcs_subscribers: string;
  vma_video_count: number;
  vcs_video_count: number;
  external_site1_name: string;
  external_site1_url: string;
  external_site1_emoji: string;
  external_site1_desc: string;
  external_site2_name: string;
  external_site2_url: string;
  external_site2_emoji: string;
  external_site2_desc: string;
  hero_title: string;
  hero_subtitle: string;
}

export interface YouTubeVideoItem {
  videoId: string;
  title: string;
  publishedDate: string;
  channel: Channel;
}

// Data fetching functions

export async function fetchCourses(): Promise<DBCourse[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchBlogPosts(): Promise<DBBlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchProblems(): Promise<DBProblem[]> {
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchJobs(): Promise<DBJob[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchNotes(): Promise<DBNote[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchSiteSettings(): Promise<DBSiteSettings | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchYouTubeVideos(channel?: Channel, max?: number): Promise<YouTubeVideoItem[]> {
  const params = new URLSearchParams();
  if (channel) params.set('channel', channel);
  if (max) params.set('max', String(max));

  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/youtube-feed?${params}`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
  });
  if (!resp.ok) throw new Error(`YouTube feed failed (${resp.status})`);
  const json = await resp.json();
  return json.videos || [];
}
