import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type DBCourse, type DBBlogPost, type DBProblem, type DBJob, type DBNote, type DBSiteSettings } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { EmptyState } from '@/components/ui';
import { X, Plus, Trash2, Edit3, Save, ArrowLeft, ExternalLink, Youtube, Settings } from 'lucide-react';

type Tab = 'Dashboard' | 'Courses' | 'Blog' | 'Problems' | 'Jobs' | 'Notes' | 'Settings';

const adminTabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'Dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'Courses', label: 'Courses', icon: '📚' },
  { key: 'Blog', label: 'Blog Posts', icon: '✍️' },
  { key: 'Problems', label: 'Problems', icon: '🧩' },
  { key: 'Jobs', label: 'Jobs', icon: '💼' },
  { key: 'Notes', label: 'Notes', icon: '📄' },
  { key: 'Settings', label: 'Site Settings', icon: '⚙️' },
];

export function AdminPage() {
  const { user, openAuthModal } = useApp();
  const [tab, setTab] = useState<Tab>('Dashboard');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <EmptyState
          icon="🔒"
          title="Please log in"
          subtitle="Admin access requires authentication"
          action={<button onClick={() => openAuthModal('login')} className="btn-primary">Log In →</button>}
        />
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <EmptyState
          icon="🚫"
          title="Access Denied"
          subtitle="You need admin privileges to access this page. Sign in with an admin email (e.g. admin@vma.edu)."
          action={<Link to="/" className="btn-primary">← Back to Home</Link>}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[240px] bg-dark text-white/70 shrink-0 hidden md:flex flex-col">
        <div className="p-5 border-b border-dark-border">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-green flex items-center justify-center text-lg">🎓</div>
            <div>
              <div className="font-display font-extrabold text-white text-sm">VMA Admin</div>
              <div className="text-[10px] text-white/40">Control Panel</div>
            </div>
          </Link>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {adminTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2.5 ${
                tab === t.key ? 'bg-green text-white' : 'text-white/60 hover:text-white hover:bg-dark-card'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-dark-border">
          <Link to="/dashboard" className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-dark-card transition-colors flex items-center gap-2.5">
            <ArrowLeft className="w-4 h-4" /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 bg-bg overflow-y-auto">
        {/* Mobile tab selector */}
        <div className="md:hidden sticky top-0 bg-card border-b border-border z-10 flex gap-1 overflow-x-auto no-scrollbar p-2">
          {adminTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${tab === t.key ? 'bg-green text-white' : 'bg-bg border border-border text-muted'}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'Dashboard' && <AdminDashboard />}
          {tab === 'Courses' && <AdminCourses />}
          {tab === 'Blog' && <AdminBlog />}
          {tab === 'Problems' && <AdminProblems />}
          {tab === 'Jobs' && <AdminJobs />}
          {tab === 'Notes' && <AdminNotes />}
          {tab === 'Settings' && <AdminSettings />}
        </div>
      </div>
    </div>
  );
}

// ===================== Dashboard =====================

function AdminDashboard() {
  const [stats, setStats] = useState({ courses: 0, blog: 0, problems: 0, jobs: 0, notes: 0 });

  useEffect(() => {
    (async () => {
      const [c, b, p, j, n] = await Promise.all([
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('problems').select('id', { count: 'exact', head: true }),
        supabase.from('jobs').select('id', { count: 'exact', head: true }),
        supabase.from('notes').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        courses: c.count || 0,
        blog: b.count || 0,
        problems: p.count || 0,
        jobs: j.count || 0,
        notes: n.count || 0,
      });
    })();
  }, []);

  const cards = [
    { label: 'Courses', value: stats.courses, icon: '📚', color: 'text-green' },
    { label: 'Blog Posts', value: stats.blog, icon: '✍️', color: 'text-blue' },
    { label: 'Problems', value: stats.problems, icon: '🧩', color: 'text-amber' },
    { label: 'Jobs', value: stats.jobs, icon: '💼', color: 'text-purple' },
    { label: 'Notes', value: stats.notes, icon: '📄', color: 'text-red' },
  ];

  return (
    <div>
      <h1 className="font-display font-extrabold text-text text-2xl mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map((s) => (
          <div key={s.label} className="card">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`font-display font-extrabold text-2xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 className="font-bold text-text mb-3">Quick Actions</h3>
        <p className="text-muted text-sm mb-4">Use the sidebar to manage your content. You can add, edit, and delete courses, blog posts, coding problems, job listings, and PDF notes. The Settings tab lets you update your YouTube channel IDs and subscriber counts.</p>
        <div className="flex flex-wrap gap-2">
          <a href="https://www.youtube.com/@VikasMauryaAcademy" target="_blank" rel="noopener noreferrer" className="btn-outline text-sm flex items-center gap-2">
            <Youtube className="w-4 h-4 text-red" /> VMA Channel
          </a>
          <a href="https://www.youtube.com/@VikasCodingSchool" target="_blank" rel="noopener noreferrer" className="btn-outline text-sm flex items-center gap-2">
            <Youtube className="w-4 h-4 text-red" /> VCS Channel
          </a>
        </div>
      </div>
    </div>
  );
}

// ===================== Generic CRUD helpers =====================

function useCrud<T extends { id: string }>(table: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table).select('*').order('sort_order', { ascending: true });
    if (error) { console.error(error); }
    setItems((data || []) as T[]);
    setLoading(false);
  }, [table]);

  useEffect(() => { load(); }, [load]);

  const save = async (item: Partial<T> & { id?: string }) => {
    if (item.id) {
      const { id, ...updates } = item;
      const { error } = await supabase.from(table).update(updates).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from(table).insert(item);
      if (error) throw error;
    }
    await load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    await load();
  };

  return { items, loading, save, remove, reload: load };
}

function AdminHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <h1 className="font-display font-extrabold text-text text-2xl">{title}</h1>
      <button onClick={onAdd} className="btn-primary flex items-center gap-2">
        <Plus className="w-4 h-4" /> Add New
      </button>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/55 animate-fadeIn" onClick={onClose}>
      <div className="bg-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeUp" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-bold text-text text-lg">{title}</h2>
          <button onClick={onClose} className="text-faint hover:text-text"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-text mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full rounded-lg bg-bg border border-border px-3 py-2 text-sm text-text outline-none focus:border-green transition-colors';
const textareaCls = inputCls + ' resize-y min-h-[80px]';

function SaveBar({ onSave, onCancel, saving }: { onSave: () => void; onCancel: () => void; saving: boolean }) {
  return (
    <div className="flex gap-3 mt-6">
      <button onClick={onSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
      </button>
      <button onClick={onCancel} className="btn-outline">Cancel</button>
    </div>
  );
}

function ItemRow({ children, onEdit, onDelete }: { children: React.ReactNode; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-b-0 group">
      <div className="flex-1 min-w-0">{children}</div>
      <button onClick={onEdit} className="text-sm text-green hover:underline shrink-0 flex items-center gap-1">
        <Edit3 className="w-3.5 h-3.5" /> Edit
      </button>
      <button onClick={onDelete} className="text-sm text-red hover:underline shrink-0 flex items-center gap-1">
        <Trash2 className="w-3.5 h-3.5" /> Delete
      </button>
    </div>
  );
}

// ===================== Courses Admin =====================

function AdminCourses() {
  const { items, loading, save, remove } = useCrud<DBCourse>('courses');
  const [editing, setEditing] = useState<DBCourse | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useApp();

  const blank: Partial<DBCourse> = {
    title: '', description: '', channel: 'VMA', emoji: '📚', price: 0, badge: '',
    tags: [], lessons: 0, hours: 0, students: 0, rating: 4.5, reviews: 0, category: '',
    syllabus: [], what_you_wll_learn: [], about: '', sort_order: items.length, published: true,
  };

  const handleSave = async (data: Partial<DBCourse>) => {
    setSaving(true);
    try {
      await save(data);
      showToast('Course saved! ✅', 'success');
      setEditing(null);
      setCreating(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader title="Courses" onAdd={() => setCreating(true)} />

      {loading ? (
        <div className="card text-center py-8 text-muted">Loading…</div>
      ) : items.length === 0 ? (
        <div className="card"><EmptyState icon="📚" title="No courses yet" subtitle="Click Add New to create your first course" /></div>
      ) : (
        <div className="card">
          {items.map((c) => (
            <ItemRow key={c.id} onEdit={() => setEditing(c)} onDelete={() => { if (confirm(`Delete "${c.title}"?`)) remove(c.id); }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{c.emoji}</span>
                <div className="min-w-0">
                  <div className="font-medium text-text text-sm truncate">{c.title}</div>
                  <div className="text-xs text-muted">{c.channel} · {c.price === 0 ? 'Free' : `₹${c.price}`} · {c.students.toLocaleString()} students</div>
                </div>
                {!c.published && <span className="badge-amber text-xs">Draft</span>}
              </div>
            </ItemRow>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <Modal title={editing ? 'Edit Course' : 'Add Course'} onClose={() => { setEditing(null); setCreating(false); }}>
          <CourseForm initial={editing || blank} onSave={handleSave} saving={saving} />
        </Modal>
      )}
    </div>
  );
}

function CourseForm({ initial, onSave, saving }: { initial: Partial<DBCourse>; onSave: (d: Partial<DBCourse>) => void; saving: boolean }) {
  const [data, setData] = useState<Partial<DBCourse>>(initial);
  const [tagsStr, setTagsStr] = useState((initial.tags || []).join(', '));
  const [learnStr, setLearnStr] = useState((initial.what_you_wll_learn || []).join('\n'));
  const [syllabusStr, setSyllabusStr] = useState(
    (initial.syllabus || []).map((s) => `${s.title}|${s.duration}|${s.free ? 'free' : 'paid'}`).join('\n')
  );

  const set = (k: keyof DBCourse, v: unknown) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    onSave({
      ...data,
      tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
      what_you_wll_learn: learnStr.split('\n').map((t) => t.trim()).filter(Boolean),
      syllabus: syllabusStr.split('\n').map((line) => {
        const [title, duration, freeStr] = line.split('|').map((s) => s.trim());
        return { title: title || '', duration: duration || '10:00', free: freeStr === 'free' };
      }).filter((s) => s.title),
    });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Title"><input className={inputCls} value={data.title || ''} onChange={(e) => set('title', e.target.value)} /></Field>
        <Field label="Emoji"><input className={inputCls} value={data.emoji || ''} onChange={(e) => set('emoji', e.target.value)} /></Field>
      </div>
      <Field label="Description"><textarea className={textareaCls} value={data.description || ''} onChange={(e) => set('description', e.target.value)} /></Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Channel">
          <select className={inputCls} value={data.channel || 'VMA'} onChange={(e) => set('channel', e.target.value)}>
            <option value="VMA">VMA (Academy)</option>
            <option value="VCS">VCS (Coding School)</option>
          </select>
        </Field>
        <Field label="Price (₹)"><input type="number" className={inputCls} value={data.price ?? 0} onChange={(e) => set('price', parseInt(e.target.value) || 0)} /></Field>
        <Field label="Badge"><input className={inputCls} value={data.badge || ''} onChange={(e) => set('badge', e.target.value)} placeholder="Bestseller, New, Popular" /></Field>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Field label="Lessons"><input type="number" className={inputCls} value={data.lessons ?? 0} onChange={(e) => set('lessons', parseInt(e.target.value) || 0)} /></Field>
        <Field label="Hours"><input type="number" className={inputCls} value={data.hours ?? 0} onChange={(e) => set('hours', parseInt(e.target.value) || 0)} /></Field>
        <Field label="Students"><input type="number" className={inputCls} value={data.students ?? 0} onChange={(e) => set('students', parseInt(e.target.value) || 0)} /></Field>
        <Field label="Rating"><input type="number" step="0.1" className={inputCls} value={data.rating ?? 4.5} onChange={(e) => set('rating', parseFloat(e.target.value) || 4.5)} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category"><input className={inputCls} value={data.category || ''} onChange={(e) => set('category', e.target.value)} /></Field>
        <Field label="Reviews"><input type="number" className={inputCls} value={data.reviews ?? 0} onChange={(e) => set('reviews', parseInt(e.target.value) || 0)} /></Field>
      </div>
      <Field label="Tags (comma-separated)"><input className={inputCls} value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="GATE, DSA, React" /></Field>
      <Field label="What You'll Learn (one per line)"><textarea className={textareaCls} value={learnStr} onChange={(e) => setLearnStr(e.target.value)} /></Field>
      <Field label="Syllabus (one per line: Title|Duration|free or paid)"><textarea className={textareaCls} value={syllabusStr} onChange={(e) => setSyllabusStr(e.target.value)} placeholder="Intro to DSA|10:00|free&#10;Arrays|45:30|paid" /></Field>
      <Field label="About"><textarea className={textareaCls} value={data.about || ''} onChange={(e) => set('about', e.target.value)} /></Field>
      <div className="flex items-center gap-2 mb-4">
        <input type="checkbox" id="published" checked={data.published ?? true} onChange={(e) => set('published', e.target.checked)} />
        <label htmlFor="published" className="text-sm text-text">Published (visible on site)</label>
      </div>
      <SaveBar onSave={handleSave} onCancel={() => window.history.back()} saving={saving} />
    </div>
  );
}

// ===================== Blog Admin =====================

function AdminBlog() {
  const { items, loading, save, remove } = useCrud<DBBlogPost>('blog_posts');
  const [editing, setEditing] = useState<DBBlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useApp();

  const blank: Partial<DBBlogPost> = {
    slug: '', title: '', category: 'Tutorial', emoji: '📝', read_time: 5, views: 0,
    excerpt: '', content: '', published: true, sort_order: items.length,
  };

  const handleSave = async (data: Partial<DBBlogPost>) => {
    setSaving(true);
    try {
      if (!data.slug) data.slug = (data.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      await save(data);
      showToast('Blog post saved! ✅', 'success');
      setEditing(null); setCreating(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <AdminHeader title="Blog Posts" onAdd={() => setCreating(true)} />
      {loading ? <div className="card text-center py-8 text-muted">Loading…</div> : items.length === 0 ? (
        <div className="card"><EmptyState icon="✍️" title="No blog posts yet" subtitle="Click Add New to write your first article" /></div>
      ) : (
        <div className="card">
          {items.map((p) => (
            <ItemRow key={p.id} onEdit={() => setEditing(p)} onDelete={() => { if (confirm(`Delete "${p.title}"?`)) remove(p.id); }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{p.emoji}</span>
                <div className="min-w-0">
                  <div className="font-medium text-text text-sm truncate">{p.title}</div>
                  <div className="text-xs text-muted">{p.category} · {p.read_time} min · {p.views.toLocaleString()} views</div>
                </div>
                {!p.published && <span className="badge-amber text-xs">Draft</span>}
              </div>
            </ItemRow>
          ))}
        </div>
      )}
      {(editing || creating) && (
        <Modal title={editing ? 'Edit Blog Post' : 'Add Blog Post'} onClose={() => { setEditing(null); setCreating(false); }}>
          <BlogForm initial={editing || blank} onSave={handleSave} saving={saving} />
        </Modal>
      )}
    </div>
  );
}

function BlogForm({ initial, onSave, saving }: { initial: Partial<DBBlogPost>; onSave: (d: Partial<DBBlogPost>) => void; saving: boolean }) {
  const [data, setData] = useState<Partial<DBBlogPost>>(initial);
  const set = (k: keyof DBBlogPost, v: unknown) => setData((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Title"><input className={inputCls} value={data.title || ''} onChange={(e) => set('title', e.target.value)} /></Field>
        <Field label="Slug (URL)"><input className={inputCls} value={data.slug || ''} onChange={(e) => set('slug', e.target.value)} placeholder="auto-generated from title" /></Field>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Field label="Category">
          <select className={inputCls} value={data.category || 'Tutorial'} onChange={(e) => set('category', e.target.value)}>
            <option>Tutorial</option><option>Interview</option><option>Career</option>
          </select>
        </Field>
        <Field label="Emoji"><input className={inputCls} value={data.emoji || ''} onChange={(e) => set('emoji', e.target.value)} /></Field>
        <Field label="Read Time (min)"><input type="number" className={inputCls} value={data.read_time ?? 5} onChange={(e) => set('read_time', parseInt(e.target.value) || 5)} /></Field>
        <Field label="Views"><input type="number" className={inputCls} value={data.views ?? 0} onChange={(e) => set('views', parseInt(e.target.value) || 0)} /></Field>
      </div>
      <Field label="Excerpt"><textarea className={textareaCls} value={data.excerpt || ''} onChange={(e) => set('excerpt', e.target.value)} /></Field>
      <Field label="Content (Markdown supported)"><textarea className={textareaCls + ' min-h-[200px]'} value={data.content || ''} onChange={(e) => set('content', e.target.value)} /></Field>
      <div className="flex items-center gap-2 mb-4">
        <input type="checkbox" id="blog-pub" checked={data.published ?? true} onChange={(e) => set('published', e.target.checked)} />
        <label htmlFor="blog-pub" className="text-sm text-text">Published</label>
      </div>
      <SaveBar onSave={() => onSave(data)} onCancel={() => window.history.back()} saving={saving} />
    </div>
  );
}

// ===================== Problems Admin =====================

function AdminProblems() {
  const { items, loading, save, remove } = useCrud<DBProblem>('problems');
  const [editing, setEditing] = useState<DBProblem | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useApp();

  const blank: Partial<DBProblem> = {
    slug: '', title: '', difficulty: 'Easy', acceptance: 0, tags: [], companies: [],
    description: '', examples: [], hints: [], starter_code: {}, published: true, sort_order: items.length,
  };

  const handleSave = async (data: Partial<DBProblem>) => {
    setSaving(true);
    try {
      if (!data.slug) data.slug = (data.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      await save(data);
      showToast('Problem saved! ✅', 'success');
      setEditing(null); setCreating(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <AdminHeader title="Coding Problems" onAdd={() => setCreating(true)} />
      {loading ? <div className="card text-center py-8 text-muted">Loading…</div> : items.length === 0 ? (
        <div className="card"><EmptyState icon="🧩" title="No problems yet" subtitle="Click Add New to create a coding problem" /></div>
      ) : (
        <div className="card">
          {items.map((p) => (
            <ItemRow key={p.id} onEdit={() => setEditing(p)} onDelete={() => { if (confirm(`Delete "${p.title}"?`)) remove(p.id); }}>
              <div className="flex items-center gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-text text-sm truncate">{p.title}</div>
                  <div className="text-xs text-muted">{p.difficulty} · {p.acceptance}% acceptance · {p.tags.join(', ')}</div>
                </div>
                {!p.published && <span className="badge-amber text-xs">Draft</span>}
              </div>
            </ItemRow>
          ))}
        </div>
      )}
      {(editing || creating) && (
        <Modal title={editing ? 'Edit Problem' : 'Add Problem'} onClose={() => { setEditing(null); setCreating(false); }}>
          <ProblemForm initial={editing || blank} onSave={handleSave} saving={saving} />
        </Modal>
      )}
    </div>
  );
}

function ProblemForm({ initial, onSave, saving }: { initial: Partial<DBProblem>; onSave: (d: Partial<DBProblem>) => void; saving: boolean }) {
  const [data, setData] = useState<Partial<DBProblem>>(initial);
  const [tagsStr, setTagsStr] = useState((initial.tags || []).join(', '));
  const [companiesStr, setCompaniesStr] = useState((initial.companies || []).join(', '));
  const [hintsStr, setHintsStr] = useState((initial.hints || []).join('\n'));
  const [examplesStr, setExamplesStr] = useState(
    (initial.examples || []).map((e) => `Input: ${e.input}\nOutput: ${e.output}\nExplanation: ${e.explanation}`).join('\n---\n')
  );
  const [jsCode, setJsCode] = useState(initial.starter_code?.javascript || '');
  const [pyCode, setPyCode] = useState(initial.starter_code?.python || '');

  const set = (k: keyof DBProblem, v: unknown) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    const examples = examplesStr.split('\n---\n').map((block) => {
      const inputMatch = block.match(/Input:\s*(.+)/);
      const outputMatch = block.match(/Output:\s*(.+)/);
      const explanationMatch = block.match(/Explanation:\s*(.+)/);
      return {
        input: inputMatch ? inputMatch[1].trim() : '',
        output: outputMatch ? outputMatch[1].trim() : '',
        explanation: explanationMatch ? explanationMatch[1].trim() : '',
      };
    }).filter((e) => e.input);

    onSave({
      ...data,
      tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
      companies: companiesStr.split(',').map((t) => t.trim()).filter(Boolean),
      hints: hintsStr.split('\n').map((t) => t.trim()).filter(Boolean),
      examples,
      starter_code: { javascript: jsCode, python: pyCode },
    });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Title"><input className={inputCls} value={data.title || ''} onChange={(e) => set('title', e.target.value)} /></Field>
        <Field label="Slug"><input className={inputCls} value={data.slug || ''} onChange={(e) => set('slug', e.target.value)} placeholder="auto-generated" /></Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Difficulty">
          <select className={inputCls} value={data.difficulty || 'Easy'} onChange={(e) => set('difficulty', e.target.value)}>
            <option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
        </Field>
        <Field label="Acceptance %"><input type="number" className={inputCls} value={data.acceptance ?? 0} onChange={(e) => set('acceptance', parseInt(e.target.value) || 0)} /></Field>
        <Field label="Sort Order"><input type="number" className={inputCls} value={data.sort_order ?? 0} onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)} /></Field>
      </div>
      <Field label="Tags (comma-separated)"><input className={inputCls} value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} /></Field>
      <Field label="Companies (comma-separated)"><input className={inputCls} value={companiesStr} onChange={(e) => setCompaniesStr(e.target.value)} /></Field>
      <Field label="Description"><textarea className={textareaCls + ' min-h-[120px]'} value={data.description || ''} onChange={(e) => set('description', e.target.value)} /></Field>
      <Field label="Examples (separate with --- on its own line)"><textarea className={textareaCls + ' min-h-[120px]'} value={examplesStr} onChange={(e) => setExamplesStr(e.target.value)} placeholder="Input: nums = [2,7], target = 9&#10;Output: [0,1]&#10;Explanation: Because nums[0] + nums[1] == 9&#10;---&#10;Input: ...&#10;Output: ..." /></Field>
      <Field label="Hints (one per line)"><textarea className={textareaCls} value={hintsStr} onChange={(e) => setHintsStr(e.target.value)} /></Field>
      <Field label="Starter Code — JavaScript"><textarea className={textareaCls + ' font-mono text-xs min-h-[100px]'} value={jsCode} onChange={(e) => setJsCode(e.target.value)} /></Field>
      <Field label="Starter Code — Python"><textarea className={textareaCls + ' font-mono text-xs min-h-[100px]'} value={pyCode} onChange={(e) => setPyCode(e.target.value)} /></Field>
      <div className="flex items-center gap-2 mb-4">
        <input type="checkbox" id="prob-pub" checked={data.published ?? true} onChange={(e) => set('published', e.target.checked)} />
        <label htmlFor="prob-pub" className="text-sm text-text">Published</label>
      </div>
      <SaveBar onSave={handleSave} onCancel={() => window.history.back()} saving={saving} />
    </div>
  );
}

// ===================== Jobs Admin =====================

function AdminJobs() {
  const { items, loading, save, remove } = useCrud<DBJob>('jobs');
  const [editing, setEditing] = useState<DBJob | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useApp();

  const blank: Partial<DBJob> = {
    title: '', company: '', location: 'Remote', experience: '0-1 years', salary: '',
    type: 'Full-time', posted: 'Today', tech: [], logo: '🏢', link: '', published: true, sort_order: items.length,
  };

  const handleSave = async (data: Partial<DBJob>) => {
    setSaving(true);
    try {
      await save(data);
      showToast('Job saved! ✅', 'success');
      setEditing(null); setCreating(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <AdminHeader title="Jobs" onAdd={() => setCreating(true)} />
      {loading ? <div className="card text-center py-8 text-muted">Loading…</div> : items.length === 0 ? (
        <div className="card"><EmptyState icon="💼" title="No jobs yet" subtitle="Click Add New to post a job" /></div>
      ) : (
        <div className="card">
          {items.map((j) => (
            <ItemRow key={j.id} onEdit={() => setEditing(j)} onDelete={() => { if (confirm(`Delete "${j.title}"?`)) remove(j.id); }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{j.logo}</span>
                <div className="min-w-0">
                  <div className="font-medium text-text text-sm truncate">{j.title}</div>
                  <div className="text-xs text-muted">{j.company} · {j.location} · {j.salary}</div>
                </div>
                {!j.published && <span className="badge-amber text-xs">Draft</span>}
              </div>
            </ItemRow>
          ))}
        </div>
      )}
      {(editing || creating) && (
        <Modal title={editing ? 'Edit Job' : 'Add Job'} onClose={() => { setEditing(null); setCreating(false); }}>
          <JobForm initial={editing || blank} onSave={handleSave} saving={saving} />
        </Modal>
      )}
    </div>
  );
}

function JobForm({ initial, onSave, saving }: { initial: Partial<DBJob>; onSave: (d: Partial<DBJob>) => void; saving: boolean }) {
  const [data, setData] = useState<Partial<DBJob>>(initial);
  const [techStr, setTechStr] = useState((initial.tech || []).join(', '));
  const set = (k: keyof DBJob, v: unknown) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    onSave({ ...data, tech: techStr.split(',').map((t) => t.trim()).filter(Boolean) });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Job Title"><input className={inputCls} value={data.title || ''} onChange={(e) => set('title', e.target.value)} /></Field>
        <Field label="Company"><input className={inputCls} value={data.company || ''} onChange={(e) => set('company', e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Location"><input className={inputCls} value={data.location || ''} onChange={(e) => set('location', e.target.value)} /></Field>
        <Field label="Experience"><input className={inputCls} value={data.experience || ''} onChange={(e) => set('experience', e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Salary"><input className={inputCls} value={data.salary || ''} onChange={(e) => set('salary', e.target.value)} /></Field>
        <Field label="Type">
          <select className={inputCls} value={data.type || 'Full-time'} onChange={(e) => set('type', e.target.value)}>
            <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option>
          </select>
        </Field>
        <Field label="Logo Emoji"><input className={inputCls} value={data.logo || '🏢'} onChange={(e) => set('logo', e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Posted (e.g. 2 days ago)"><input className={inputCls} value={data.posted || ''} onChange={(e) => set('posted', e.target.value)} /></Field>
        <Field label="Apply Link"><input className={inputCls} value={data.link || ''} onChange={(e) => set('link', e.target.value)} placeholder="https://..." /></Field>
      </div>
      <Field label="Tech Stack (comma-separated)"><input className={inputCls} value={techStr} onChange={(e) => setTechStr(e.target.value)} placeholder="React, Node.js, MongoDB" /></Field>
      <div className="flex items-center gap-2 mb-4">
        <input type="checkbox" id="job-pub" checked={data.published ?? true} onChange={(e) => set('published', e.target.checked)} />
        <label htmlFor="job-pub" className="text-sm text-text">Published</label>
      </div>
      <SaveBar onSave={handleSave} onCancel={() => window.history.back()} saving={saving} />
    </div>
  );
}

// ===================== Notes Admin =====================

function AdminNotes() {
  const { items, loading, save, remove } = useCrud<DBNote>('notes');
  const [editing, setEditing] = useState<DBNote | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useApp();

  const blank: Partial<DBNote> = {
    title: '', subject: '', pages: 1, size: '1 MB', free: true, emoji: '📄',
    link: '', published: true, sort_order: items.length,
  };

  const handleSave = async (data: Partial<DBNote>) => {
    setSaving(true);
    try {
      await save(data);
      showToast('Note saved! ✅', 'success');
      setEditing(null); setCreating(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <AdminHeader title="PDF Notes" onAdd={() => setCreating(true)} />
      {loading ? <div className="card text-center py-8 text-muted">Loading…</div> : items.length === 0 ? (
        <div className="card"><EmptyState icon="📄" title="No notes yet" subtitle="Click Add New to upload notes" /></div>
      ) : (
        <div className="card">
          {items.map((n) => (
            <ItemRow key={n.id} onEdit={() => setEditing(n)} onDelete={() => { if (confirm(`Delete "${n.title}"?`)) remove(n.id); }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{n.emoji}</span>
                <div className="min-w-0">
                  <div className="font-medium text-text text-sm truncate">{n.title}</div>
                  <div className="text-xs text-muted">{n.subject} · {n.pages} pages · {n.free ? 'Free' : 'Paid'} · {n.size}</div>
                </div>
                {!n.published && <span className="badge-amber text-xs">Draft</span>}
              </div>
            </ItemRow>
          ))}
        </div>
      )}
      {(editing || creating) && (
        <Modal title={editing ? 'Edit Notes' : 'Add Notes'} onClose={() => { setEditing(null); setCreating(false); }}>
          <NoteForm initial={editing || blank} onSave={handleSave} saving={saving} />
        </Modal>
      )}
    </div>
  );
}

function NoteForm({ initial, onSave, saving }: { initial: Partial<DBNote>; onSave: (d: Partial<DBNote>) => void; saving: boolean }) {
  const [data, setData] = useState<Partial<DBNote>>(initial);
  const set = (k: keyof DBNote, v: unknown) => setData((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Title"><input className={inputCls} value={data.title || ''} onChange={(e) => set('title', e.target.value)} /></Field>
        <Field label="Subject"><input className={inputCls} value={data.subject || ''} onChange={(e) => set('subject', e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Pages"><input type="number" className={inputCls} value={data.pages ?? 1} onChange={(e) => set('pages', parseInt(e.target.value) || 1)} /></Field>
        <Field label="File Size"><input className={inputCls} value={data.size || ''} onChange={(e) => set('size', e.target.value)} placeholder="5 MB" /></Field>
        <Field label="Emoji"><input className={inputCls} value={data.emoji || '📄'} onChange={(e) => set('emoji', e.target.value)} /></Field>
      </div>
      <Field label="Download Link"><input className={inputCls} value={data.link || ''} onChange={(e) => set('link', e.target.value)} placeholder="https://..." /></Field>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="note-free" checked={data.free ?? true} onChange={(e) => set('free', e.target.checked)} />
          <label htmlFor="note-free" className="text-sm text-text">Free</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="note-pub" checked={data.published ?? true} onChange={(e) => set('published', e.target.checked)} />
          <label htmlFor="note-pub" className="text-sm text-text">Published</label>
        </div>
      </div>
      <SaveBar onSave={() => onSave(data)} onCancel={() => window.history.back()} saving={saving} />
    </div>
  );
}

// ===================== Settings Admin =====================

function AdminSettings() {
  const [settings, setSettings] = useState<DBSiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useApp();

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);

  const set = (k: keyof DBSiteSettings, v: string | number) => {
    setSettings((prev) => prev ? { ...prev, [k]: v } : prev);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('site_settings').update(settings).eq('id', 1);
      if (error) throw error;
      showToast('Settings saved! ✅', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div className="card text-center py-8 text-muted">Loading…</div>;

  return (
    <div>
      <h1 className="font-display font-extrabold text-text text-2xl mb-6">Site Settings</h1>

      <div className="card mb-6">
        <h3 className="font-bold text-text mb-4 flex items-center gap-2"><Youtube className="w-5 h-5 text-red" /> YouTube Channels</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="VMA Channel ID"><input className={inputCls} value={settings.vma_channel_id} onChange={(e) => set('vma_channel_id', e.target.value)} /></Field>
          <Field label="VMA Subscribers (display)"><input className={inputCls} value={settings.vma_subscribers} onChange={(e) => set('vma_subscribers', e.target.value)} /></Field>
          <Field label="VCS Channel ID"><input className={inputCls} value={settings.vcs_channel_id} onChange={(e) => set('vcs_channel_id', e.target.value)} /></Field>
          <Field label="VCS Subscribers (display)"><input className={inputCls} value={settings.vcs_subscribers} onChange={(e) => set('vcs_subscribers', e.target.value)} /></Field>
        </div>
        <div className="flex gap-3 mt-4">
          <a href={`https://www.youtube.com/channel/${settings.vma_channel_id}`} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> View VMA
          </a>
          <a href={`https://www.youtube.com/channel/${settings.vcs_channel_id}`} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> View VCS
          </a>
        </div>
        <p className="text-xs text-faint mt-3">The channel IDs are used to fetch your latest YouTube videos automatically. The subscriber counts shown on the site are manually entered here.</p>
      </div>

      <div className="card mb-6">
        <h3 className="font-bold text-text mb-4">Hero Section</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Hero Title"><input className={inputCls} value={settings.hero_title} onChange={(e) => set('hero_title', e.target.value)} /></Field>
          <Field label="Hero Subtitle"><input className={inputCls} value={settings.hero_subtitle} onChange={(e) => set('hero_subtitle', e.target.value)} /></Field>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="font-bold text-text mb-4">External Websites</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Site 1 Name"><input className={inputCls} value={settings.external_site1_name} onChange={(e) => set('external_site1_name', e.target.value)} /></Field>
          <Field label="Site 1 URL"><input className={inputCls} value={settings.external_site1_url} onChange={(e) => set('external_site1_url', e.target.value)} /></Field>
          <Field label="Site 1 Emoji"><input className={inputCls} value={settings.external_site1_emoji} onChange={(e) => set('external_site1_emoji', e.target.value)} /></Field>
          <Field label="Site 1 Description"><input className={inputCls} value={settings.external_site1_desc} onChange={(e) => set('external_site1_desc', e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Site 2 Name"><input className={inputCls} value={settings.external_site2_name} onChange={(e) => set('external_site2_name', e.target.value)} /></Field>
          <Field label="Site 2 URL"><input className={inputCls} value={settings.external_site2_url} onChange={(e) => set('external_site2_url', e.target.value)} /></Field>
          <Field label="Site 2 Emoji"><input className={inputCls} value={settings.external_site2_emoji} onChange={(e) => set('external_site2_emoji', e.target.value)} /></Field>
          <Field label="Site 2 Description"><input className={inputCls} value={settings.external_site2_desc} onChange={(e) => set('external_site2_desc', e.target.value)} /></Field>
        </div>
      </div>

      <SaveBar onSave={handleSave} onCancel={() => {}} saving={saving} />
    </div>
  );
}
