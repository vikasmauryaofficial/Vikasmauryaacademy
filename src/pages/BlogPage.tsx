import { useState, useEffect } from 'react';
import { fetchBlogPosts, type DBBlogPost } from '@/lib/supabase';

const categoryColors: Record<string, { bg: string; badge: string; pill: string }> = {
  All: { bg: 'from-gray-100 to-white', badge: 'badge-green', pill: 'pill-tab-idle' },
  Interview: { bg: 'from-red-light to-white', badge: 'badge-red', pill: 'border-red text-red hover:bg-red-light' },
  Tutorial: { bg: 'from-blue-light to-white', badge: 'badge-blue', pill: 'border-blue text-blue hover:bg-blue-light' },
  Career: { bg: 'from-green-light to-white', badge: 'badge-green', pill: 'border-green text-green hover:bg-green-light' },
};

export function BlogPage() {
  const [category, setCategory] = useState('All');
  const [posts, setPosts] = useState<DBBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts()
      .then(setPosts)
      .catch((e) => console.error('Failed to load blog posts:', e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter((p) => category === 'All' || p.category === category);

  return (
    <div>
      <section className="text-center py-16 px-4" style={{ background: 'linear-gradient(135deg, #FCE4EC 0%, #F5F0FF 100%)' }}>
        <h1 className="font-display font-extrabold text-text" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>Tech Blog</h1>
        <p className="text-muted text-lg mt-2">Interview guides, tutorials, and career tips</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex gap-2 flex-wrap mb-6">
          {['All', 'Interview', 'Tutorial', 'Career'].map((tab) => (
            <button
              key={tab}
              onClick={() => setCategory(tab)}
              className={`pill-tab ${category === tab ? 'pill-tab-active' : 'pill-tab-idle'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-[100px] bg-bg rounded-lg mb-3" />
                <div className="h-4 bg-bg rounded w-3/4 mb-2" />
                <div className="h-3 bg-bg rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-12 text-muted">No blog posts yet. Check back soon!</div>
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {filtered.map((post) => {
              const colors = categoryColors[post.category] || categoryColors.All;
              return (
                <div key={post.id} className="card-hover group cursor-pointer">
                  <div className={`h-[100px] rounded-lg bg-gradient-to-br ${colors.bg} flex items-center justify-center mb-3`}>
                    <span className="text-4xl">{post.emoji}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={colors.badge}>{post.category}</span>
                    <span className="text-xs text-muted">{post.read_time} min read · {post.views.toLocaleString()} views</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-text mb-2 line-clamp-2 group-hover:text-green transition-colors">{post.title}</h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-faint">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="text-green font-semibold group-hover:underline">Read more →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
