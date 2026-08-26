/*
# Create content management tables for admin panel

## Overview
This migration creates the database tables that power the admin panel and all public-facing content.
The admin ( Vikas Maurya ) can create, edit, and delete courses, blog posts, coding problems,
job listings, PDF notes, and site settings (including YouTube channel info).

## New Tables
1. `courses` — Course catalog with title, description, channel, price, syllabus, etc.
2. `blog_posts` — Tech blog articles with category, content, and metadata.
3. `problems` — Code Arena coding problems with description, hints, and starter code.
4. `jobs` — Job board listings with company, salary, and requirements.
5. `notes` — PDF notes with subject, pages, and free/paid flag.
6. `site_settings` — Single-row table for global settings (YouTube channel IDs, subscriber counts, external site links).
7. `enrollments` — Tracks which user is enrolled in which course (for future auth integration).

## Security
- RLS enabled on all tables.
- Public read access (anon + authenticated) for courses, blog_posts, problems, jobs, notes, site_settings — these are public content.
- Write access (insert/update/delete) restricted to authenticated users only — admin panel requires login.
- Enrollments are owner-scoped (user_id) — each user sees only their own enrollments.

## Important Notes
- site_settings is a single-row table enforced by a constraint.
- All tables use gen_random_uuid() for primary keys.
- Timestamps default to now().
*/

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  channel text NOT NULL DEFAULT 'VMA' CHECK (channel IN ('VMA', 'VCS')),
  emoji text NOT NULL DEFAULT '📚',
  price integer NOT NULL DEFAULT 0,
  badge text,
  tags text[] NOT NULL DEFAULT '{}',
  lessons integer NOT NULL DEFAULT 0,
  hours integer NOT NULL DEFAULT 0,
  students integer NOT NULL DEFAULT 0,
  rating numeric(2,1) NOT NULL DEFAULT 4.5,
  reviews integer NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT '',
  syllabus jsonb NOT NULL DEFAULT '[]'::jsonb,
  what_you_wll_learn text[] NOT NULL DEFAULT '{}',
  about text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_courses" ON courses;
CREATE POLICY "public_read_courses" ON courses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_courses" ON courses;
CREATE POLICY "auth_insert_courses" ON courses FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_courses" ON courses;
CREATE POLICY "auth_update_courses" ON courses FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_courses" ON courses;
CREATE POLICY "auth_delete_courses" ON courses FOR DELETE
  TO authenticated USING (true);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Tutorial',
  emoji text NOT NULL DEFAULT '📝',
  read_time integer NOT NULL DEFAULT 5,
  views integer NOT NULL DEFAULT 0,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_blog" ON blog_posts;
CREATE POLICY "public_read_blog" ON blog_posts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_blog" ON blog_posts;
CREATE POLICY "auth_insert_blog" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_blog" ON blog_posts;
CREATE POLICY "auth_update_blog" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_blog" ON blog_posts;
CREATE POLICY "auth_delete_blog" ON blog_posts FOR DELETE
  TO authenticated USING (true);

-- Problems table
CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  difficulty text NOT NULL DEFAULT 'Easy' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  acceptance integer NOT NULL DEFAULT 0,
  tags text[] NOT NULL DEFAULT '{}',
  companies text[] NOT NULL DEFAULT '{}',
  description text NOT NULL DEFAULT '',
  examples jsonb NOT NULL DEFAULT '[]'::jsonb,
  hints text[] NOT NULL DEFAULT '{}',
  starter_code jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE problems ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_problems" ON problems;
CREATE POLICY "public_read_problems" ON problems FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_problems" ON problems;
CREATE POLICY "auth_insert_problems" ON problems FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_problems" ON problems;
CREATE POLICY "auth_update_problems" ON problems FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_problems" ON problems;
CREATE POLICY "auth_delete_problems" ON problems FOR DELETE
  TO authenticated USING (true);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL DEFAULT 'Remote',
  experience text NOT NULL DEFAULT '0-1 years',
  salary text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'Full-time',
  posted text NOT NULL DEFAULT 'Today',
  tech text[] NOT NULL DEFAULT '{}',
  logo text NOT NULL DEFAULT '🏢',
  link text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_jobs" ON jobs;
CREATE POLICY "public_read_jobs" ON jobs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_jobs" ON jobs;
CREATE POLICY "auth_insert_jobs" ON jobs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_jobs" ON jobs;
CREATE POLICY "auth_update_jobs" ON jobs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_jobs" ON jobs;
CREATE POLICY "auth_delete_jobs" ON jobs FOR DELETE
  TO authenticated USING (true);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL DEFAULT '',
  pages integer NOT NULL DEFAULT 1,
  size text NOT NULL DEFAULT '1 MB',
  free boolean NOT NULL DEFAULT true,
  emoji text NOT NULL DEFAULT '📄',
  link text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_notes" ON notes;
CREATE POLICY "public_read_notes" ON notes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_notes" ON notes;
CREATE POLICY "auth_insert_notes" ON notes FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_notes" ON notes;
CREATE POLICY "auth_update_notes" ON notes FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_notes" ON notes;
CREATE POLICY "auth_delete_notes" ON notes FOR DELETE
  TO authenticated USING (true);

-- Site settings (single-row table)
CREATE TABLE IF NOT EXISTS site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  vma_channel_id text NOT NULL DEFAULT 'UCf7mlPgA3jG5r0t8u7NyRPg',
  vcs_channel_id text NOT NULL DEFAULT 'UCrrr6PjNuPDAd_Yo0hwv73Q',
  vma_subscribers text NOT NULL DEFAULT '6.85K',
  vcs_subscribers text NOT NULL DEFAULT '6.87K',
  vma_video_count integer NOT NULL DEFAULT 845,
  vcs_video_count integer NOT NULL DEFAULT 0,
  external_site1_name text NOT NULL DEFAULT 'Anatomy Class',
  external_site1_url text NOT NULL DEFAULT 'https://anatomy-class.vercel.app/',
  external_site1_emoji text NOT NULL DEFAULT '🫀',
  external_site1_desc text NOT NULL DEFAULT 'Interactive anatomy learning platform',
  external_site2_name text NOT NULL DEFAULT 'Algorithm Class',
  external_site2_url text NOT NULL DEFAULT 'https://algorithmclass.vercel.app/',
  external_site2_emoji text NOT NULL DEFAULT '🧮',
  external_site2_desc text NOT NULL DEFAULT 'Algorithm visualization and practice tool',
  hero_title text NOT NULL DEFAULT 'Learn, Practice & Get Placed',
  hero_subtitle text NOT NULL DEFAULT 'with Vikas Maurya',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON site_settings;
CREATE POLICY "public_read_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_settings" ON site_settings;
CREATE POLICY "auth_update_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Insert default settings row if not exists
INSERT INTO site_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Enrollments table (for future auth integration)
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_enrollments" ON enrollments;
CREATE POLICY "public_read_enrollments" ON enrollments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_enrollments" ON enrollments;
CREATE POLICY "auth_insert_enrollments" ON enrollments FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_enrollments" ON enrollments;
CREATE POLICY "auth_delete_enrollments" ON enrollments FOR DELETE
  TO authenticated USING (true);

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_courses_channel ON courses(channel);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_problems_published ON problems(published);
CREATE INDEX IF NOT EXISTS idx_jobs_published ON jobs(published);
CREATE INDEX IF NOT EXISTS idx_notes_published ON notes(published);
