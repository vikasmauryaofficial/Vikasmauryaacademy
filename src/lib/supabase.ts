import { createClient } from '@supabase/supabase-js';
import {
  blogPosts as mockBlogPosts,
  courses as mockCourses,
  jobs as mockJobs,
  notes as mockNotes,
  problems as mockProblems,
  videos as mockVideos,
} from '@/data/mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co',
  supabaseAnonKey || 'demo-anon-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  },
);

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

const fallbackDate = new Date().toISOString();

function mapMockCourse(course: (typeof mockCourses)[number]): DBCourse {
  return {
    id: String(course.id),
    title: course.title,
    description: course.description,
    channel: course.channel,
    emoji: course.emoji,
    price: Number(course.price ?? 0),
    badge: course.badge ?? null,
    tags: course.tags ?? [],
    lessons: Number(course.lessons ?? 0),
    hours: Number(course.hours ?? 0),
    students: Number(course.students ?? 0),
    rating: Number(course.rating ?? 0),
    reviews: Number(course.reviews ?? 0),
    category: course.category ?? '',
    syllabus: (course.syllabus ?? []).map((item) => ({
      title: item.title,
      duration: item.duration,
      free: Boolean(item.free),
    })),
    what_you_wll_learn: Array.isArray(course.whatYouWillLearn) ? course.whatYouWillLearn : [],
    about: course.about ?? '',
    sort_order: 0,
    published: true,
    created_at: fallbackDate,
    updated_at: fallbackDate,
  };
}

function mapMockBlogPost(post: (typeof mockBlogPosts)[number]): DBBlogPost {
  return {
    id: String(post.id),
    slug: post.slug,
    title: post.title,
    category: post.category,
    emoji: post.emoji,
    read_time: Number(post.readTime ?? 0),
    views: Number(post.views ?? 0),
    excerpt: post.excerpt,
    content: post.excerpt,
    published: true,
    sort_order: 0,
    created_at: fallbackDate,
    updated_at: fallbackDate,
  };
}

function mapMockProblem(problem: (typeof mockProblems)[number]): DBProblem {
  return {
    id: String(problem.id),
    slug: problem.slug,
    title: problem.title,
    difficulty: problem.difficulty,
    acceptance: Number(problem.acceptance ?? 0),
    tags: problem.tags ?? [],
    companies: problem.companies ?? [],
    description: problem.description,
    examples: problem.examples ?? [],
    hints: problem.hints ?? [],
    starter_code: problem.starterCode ?? {},
    published: true,
    sort_order: 0,
    created_at: fallbackDate,
    updated_at: fallbackDate,
  };
}

function mapMockJob(job: (typeof mockJobs)[number]): DBJob {
  return {
    id: String(job.id),
    title: job.title,
    company: job.company,
    location: job.location,
    experience: job.experience,
    salary: job.salary,
    type: job.type,
    posted: job.posted,
    tech: job.tech ?? [],
    logo: job.logo,
    link: null,
    published: true,
    sort_order: 0,
    created_at: fallbackDate,
    updated_at: fallbackDate,
  };
}

function mapMockNote(note: (typeof mockNotes)[number]): DBNote {
  return {
    id: String(note.id),
    title: note.title,
    subject: note.subject,
    pages: Number(note.pages ?? 0),
    size: note.size,
    free: Boolean(note.free),
    emoji: note.emoji,
    link: null,
    published: true,
    sort_order: 0,
    created_at: fallbackDate,
    updated_at: fallbackDate,
  };
}

function mapMockYouTubeVideos() {
  return mockVideos.map((video) => ({
    videoId: String(video.id),
    title: video.title,
    publishedDate: new Date().toISOString(),
    channel: video.channel,
  }));
}

// Data fetching functions

export async function fetchCourses(): Promise<DBCourse[]> {
  if (!isSupabaseConfigured) return mockCourses.map(mapMockCourse);
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchBlogPosts(): Promise<DBBlogPost[]> {
  if (!isSupabaseConfigured) return mockBlogPosts.map(mapMockBlogPost);
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchProblems(): Promise<DBProblem[]> {
  if (!isSupabaseConfigured) return mockProblems.map(mapMockProblem);
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchJobs(): Promise<DBJob[]> {
  if (!isSupabaseConfigured) return mockJobs.map(mapMockJob);
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchNotes(): Promise<DBNote[]> {
  if (!isSupabaseConfigured) return mockNotes.map(mapMockNote);
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchSiteSettings(): Promise<DBSiteSettings | null> {
  if (!isSupabaseConfigured) {
    return {
      id: 1,
      vma_channel_id: '',
      vcs_channel_id: '',
      vma_subscribers: '6.85K subscribers',
      vcs_subscribers: '6.87K subscribers',
      vma_video_count: 0,
      vcs_video_count: 0,
      external_site1_name: 'Anatomy Class',
      external_site1_url: 'https://anatomy-class.vercel.app/',
      external_site1_emoji: 'ðŸ«€',
      external_site1_desc: 'Interactive anatomy learning platform',
      external_site2_name: 'Algorithm Class',
      external_site2_url: 'https://algorithmclass.vercel.app/',
      external_site2_emoji: 'ðŸ§®',
      external_site2_desc: 'Algorithm visualization and practice tool',
      hero_title: 'Learn, Practice & Get Placed',
      hero_subtitle: 'with Vikas Maurya',
    };
  }

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchYouTubeVideos(channel?: Channel, max?: number): Promise<YouTubeVideoItem[]> {
  if (!isSupabaseConfigured) {
    const videos = mapMockYouTubeVideos();
    const filtered = channel ? videos.filter((video) => video.channel === channel) : videos;
    return filtered.slice(0, max ?? filtered.length);
  }

  const params = new URLSearchParams();
  if (channel) params.set('channel', channel);
  if (max) params.set('max', String(max));

  const url = `${supabaseUrl}/functions/v1/youtube-feed?${params}`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  });
  if (!resp.ok) throw new Error(`YouTube feed failed (${resp.status})`);
  const json = await resp.json();
  return json.videos || [];
}
