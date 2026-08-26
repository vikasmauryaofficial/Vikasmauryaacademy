import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCourses, fetchProblems, fetchSiteSettings, fetchYouTubeVideos, type DBCourse, type DBProblem, type DBSiteSettings, type YouTubeVideoItem, type Channel } from '@/lib/supabase';
import { liveClasses, testimonials } from '@/data/mockData';
import { CourseCard, CourseCardSkeleton } from '@/components/CourseCard';
import { SectionHead, ChBadge, DiffBadge } from '@/components/ui';
import { useApp } from '@/context/AppContext';

const companies = ['TCS', 'Infosys', 'Accenture', 'Wipro', 'Capgemini', 'HCL', 'Cognizant', 'Google', 'Amazon', 'Deloitte'];
const allCompanies = ['TCS', 'Infosys', 'Accenture', 'Wipro', 'Capgemini', 'HCL', 'Cognizant', 'Google', 'Amazon', 'Deloitte', 'IBM', 'LTIMindtree', 'Zoho', 'Freshworks'];

const features = [
  { icon: '🎬', title: 'Video Courses', desc: '1,325+ video lessons across all topics', to: '/courses', color: 'bg-green-light' },
  { icon: '📄', title: 'PDF Notes', desc: 'Chapter-wise notes & cheat sheets', to: '/notes', color: 'bg-blue-light' },
  { icon: '🔴', title: 'Live Classes', desc: 'Weekly live sessions & doubt clearing', to: '/live', color: 'bg-red-light' },
  { icon: '💻', title: 'Code Arena', desc: '500+ coding problems with live judging', to: '/arena', color: 'bg-dark' },
  { icon: '🏢', title: 'Placement Prep', desc: 'Company-specific interview preparation', to: '/placement', color: 'bg-amber-light' },
  { icon: '🏆', title: 'Certificates', desc: 'Earn certificates upon course completion', to: '/certificates', color: 'bg-purple-light' },
  { icon: '💼', title: 'Jobs Board', desc: 'Fresher jobs, internships & campus drives', to: '/jobs', color: 'bg-amber-light' },
  { icon: '✍️', title: 'Tech Blog', desc: 'Interview guides, tutorials & career tips', to: '/blog', color: 'bg-green-light' },
];

export function HomePage() {
  const { user, openAuthModal } = useApp();
  const [loading, setLoading] = useState(true);
  const [displayCourses, setDisplayCourses] = useState<DBCourse[]>([]);
  const [dbProblems, setDbProblems] = useState<DBProblem[]>([]);
  const [settings, setSettings] = useState<DBSiteSettings | null>(null);
  const [ytVideos, setYtVideos] = useState<YouTubeVideoItem[]>([]);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    Promise.all([
      fetchCourses().then(setDisplayCourses).catch(() => {}),
      fetchProblems().then(setDbProblems).catch(() => {}),
      fetchSiteSettings().then(setSettings).catch(() => {}),
      fetchYouTubeVideos(undefined, 6).then(setYtVideos).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const filteredCourses = displayCourses.filter((c) => {
    if (filter === 'Vikas Maurya Academy') return c.channel === 'VMA';
    if (filter === 'Vikas Coding School') return c.channel === 'VCS';
    if (filter === 'Free') return c.price === 0;
    return true;
  });

  const liveClass = liveClasses.find((l) => l.live);
  const upcoming = liveClasses.filter((l) => !l.live).slice(0, 3);

  const heroTitle = settings?.hero_title || 'Learn, Practice & Get Placed';
  const heroSubtitle = settings?.hero_subtitle || 'with Vikas Maurya';

  const channelData: Record<Channel, { name: string; emoji: string; subs: string; url: string; handle: string; description: string; tags: string[]; tagBadgeClass: string; borderColor: string }> = {
    VMA: {
      name: 'Vikas Maurya Academy',
      emoji: '📚',
      subs: settings?.vma_subscribers || '6.85K subscribers',
      url: 'https://www.youtube.com/@VikasMauryaAcademy',
      handle: '@VikasMauryaAcademy',
      description: 'GATE, PSU, and government exam preparation with detailed concept lectures.',
      tags: ['GATE', 'PSU', 'AE/JE', 'SSC JE'],
      tagBadgeClass: 'badge-green',
      borderColor: 'border-green-mid',
    },
    VCS: {
      name: 'Vikas Coding School',
      emoji: '💻',
      subs: settings?.vcs_subscribers || '6.87K subscribers',
      url: 'https://www.youtube.com/@VikasCodingSchool',
      handle: '@VikasCodingSchool',
      description: 'Programming, DSA, and web development tutorials for beginners to advanced.',
      tags: ['DSA', 'React', 'Node.js', 'Python'],
      tagBadgeClass: 'badge-blue',
      borderColor: 'border-blue-mid',
    },
  };

  const externalSites = [
    { name: settings?.external_site1_name || 'Anatomy Class', url: settings?.external_site1_url || 'https://anatomy-class.vercel.app/', emoji: settings?.external_site1_emoji || '🫀', description: settings?.external_site1_desc || 'Interactive anatomy learning platform' },
    { name: settings?.external_site2_name || 'Algorithm Class', url: settings?.external_site2_url || 'https://algorithmclass.vercel.app/', emoji: settings?.external_site2_emoji || '🧮', description: settings?.external_site2_desc || 'Algorithm visualization and practice tool' },
  ].filter((s) => s.url);

  return (
    <div>
      {/* Section 1 — Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(150deg, #F0FDF8 0%, #EBF5FF 48%, #F5F0FF 100%)', paddingTop: '88px', paddingBottom: '80px' }}>
        <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-green opacity-[0.06] blur-3xl" />
        <div className="absolute bottom-10 left-20 w-72 h-72 rounded-full bg-blue opacity-[0.06] blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-light border border-green-mid px-4 py-1.5 text-sm font-semibold text-green-dark mb-6 animate-fadeUp">
            ✦ 9,000+ students learning right now
          </div>
          <h1 className="font-display font-extrabold leading-[1.1] mb-6 animate-fadeUp" style={{ fontSize: 'clamp(34px, 6vw, 62px)', letterSpacing: '-0.04em' }}>
            {heroTitle}
            <br />
            <span className="text-green">{heroSubtitle}</span>
          </h1>
          <p className="text-muted text-lg max-w-[600px] mx-auto mb-8 animate-fadeUp" style={{ lineHeight: 1.75 }}>
            Courses, live classes, a coding arena, placement prep, jobs, and a tech blog — everything you need to crack GATE, PSUs, and land your dream tech job.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12 animate-fadeUp">
            <Link to="/courses" className="btn-primary">Explore Courses →</Link>
            <Link to="/arena" className="btn-outline">Try Code Arena Free</Link>
            {!user && (
              <button onClick={() => openAuthModal('signup')} className="btn-outline border-border text-muted">
                Sign Up Free
              </button>
            )}
          </div>
          <div className="animate-fadeIn">
            <p className="text-xs text-faint uppercase tracking-wider mb-4">Students now placed at</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {companies.map((company) => (
                <span key={company} className="px-3 py-1.5 rounded-full bg-card border border-border text-sm font-medium text-muted">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Stats Bar */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            { value: '9,000+', label: 'Students enrolled' },
            { value: '1,325+', label: 'Video lessons' },
            { value: '500+', label: 'Coding problems' },
            { value: '2 Channels', label: 'One platform' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`text-center py-7 ${i < 3 ? 'border-r border-border' : ''} ${i < 2 ? 'border-b md:border-b-0 border-border' : ''}`}
            >
              <div className="font-display font-extrabold text-3xl text-green">{stat.value}</div>
              <div className="text-[13px] text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 — Courses */}
      <section className="max-w-7xl mx-auto px-4 py-[72px]">
        <SectionHead
          title="Featured Courses"
          subtitle="Hand-picked courses from both channels"
          right={<Link to="/courses" className="text-sm font-semibold text-green hover:underline">View all courses →</Link>}
        />
        <div className="flex gap-2 mb-6 flex-wrap">
          {['All', 'Vikas Maurya Academy', 'Vikas Coding School', 'Free'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pill-tab ${filter === tab ? 'pill-tab-active' : 'pill-tab-idle'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)
            : filteredCourses.slice(0, 8).map((course) => <CourseCard key={course.id} course={course} />)}
        </div>
      </section>

      {/* Section 4 — Code Arena CTA */}
      <section className="bg-dark text-white py-[72px] px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-green text-[11px] font-extrabold tracking-[0.25em] mb-3">CODE ARENA</div>
            <h2 className="font-display font-extrabold mb-4" style={{ fontSize: 'clamp(26px, 4vw, 42px)' }}>
              Practice coding like a pro — completely free
            </h2>
            <p className="text-white/60 text-[15.5px] mb-6" style={{ lineHeight: 1.78 }}>
              500+ problems across all difficulty levels, 10+ supported languages, live leaderboard, and daily contests. Built for placement prep and competitive programming.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['500+ Problems', '10+ Languages', 'Live Leaderboard', 'Daily Contests'].map((pill) => (
                <span key={pill} className="px-3 py-1.5 rounded-full bg-dark-card border border-dark-border text-xs font-medium text-white/80">
                  {pill}
                </span>
              ))}
            </div>
            <Link to="/arena" className="btn-primary">Start Solving Free →</Link>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-bold text-white">Problems</span>
              <span className="badge-green text-xs">{dbProblems.length} total</span>
            </div>
            <div className="space-y-1">
              {dbProblems.slice(0, 7).map((p) => (
                <Link
                  key={p.id}
                  to={`/arena?problem=${p.slug}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-dark-hover transition-colors group"
                >
                  <span className="text-sm">⬜</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate group-hover:text-green transition-colors">{p.title}</div>
                    <div className="flex gap-1.5 mt-1">
                      {p.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-dark-hover text-white/50">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <DiffBadge difficulty={p.difficulty} />
                  <span className="text-xs text-white/40 w-12 text-right">{p.acceptance}%</span>
                </Link>
              ))}
              {dbProblems.length === 0 && (
                <div className="text-white/40 text-sm text-center py-4">No problems yet. Add some from the admin panel!</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Live Classes */}
      <section className="bg-bg py-[72px] px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHead
            title="Live Classes"
            subtitle="Join live sessions and clear your doubts in real-time"
            right={<Link to="/live" className="text-sm font-semibold text-green hover:underline">All live classes →</Link>}
          />
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-5">
            {/* Live Now card */}
            {liveClass && (
              <div className="border-2 border-red rounded-xl p-5 bg-card">
                <div className="flex gap-4">
                  <div className="w-[200px] h-[120px] rounded-lg bg-dark flex flex-col items-center justify-center shrink-0">
                    <span className="text-4xl mb-1">📹</span>
                    <span className="text-white text-xs font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulseDot" />
                      LIVE
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <ChBadge channel={liveClass.channel} />
                      <span className="badge-red text-xs">🔴 {liveClass.watching} watching</span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-text mb-2">{liveClass.title}</h3>
                    <p className="text-muted text-sm mb-3 line-clamp-2">{liveClass.description}</p>
                    <Link to="/live" className="btn-red text-xs">Join Live →</Link>
                  </div>
                </div>
              </div>
            )}
            {/* Upcoming list */}
            <div className="space-y-3">
              {upcoming.map((cls) => (
                <div key={cls.id} className="card flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <ChBadge channel={cls.channel} />
                      <span className="badge-amber text-xs">{cls.time}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-text truncate">{cls.title}</h4>
                  </div>
                  <button className="btn-outline text-xs px-3 py-1.5 shrink-0">🔔 Remind</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 — Features Grid */}
      <section className="bg-card py-[72px] px-4 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <SectionHead title="Everything you need" subtitle="One platform, all the tools" />
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {features.map((f) => (
              <Link key={f.title} to={f.to} className="card-hover group">
                <div className={`w-[50px] h-[50px] rounded-[14px] ${f.color} flex items-center justify-center text-2xl mb-3`}>
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-text mb-1 group-hover:text-green transition-colors">{f.title}</h3>
                <p className="text-muted text-[13.5px]">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 — Latest YouTube Videos */}
      {ytVideos.length > 0 && (
        <section className="bg-bg py-[72px] px-4">
          <div className="max-w-7xl mx-auto">
            <SectionHead
              title="Latest from YouTube"
              subtitle="Fresh uploads from both channels"
              right={<Link to="/videos" className="text-sm font-semibold text-green hover:underline">All videos →</Link>}
            />
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {ytVideos.slice(0, 6).map((v) => (
                <Link key={v.videoId} to="/videos" className="card-hover group">
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-dark">
                    <img
                      src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-dark/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-red/90 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <ChBadge channel={v.channel} />
                  </div>
                  <h3 className="text-sm font-semibold text-text mb-1 line-clamp-2 group-hover:text-green transition-colors">{v.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 8 — Two Channels */}
      <section className="bg-card py-[72px] px-4 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <SectionHead title="Our YouTube Channels" subtitle="Two channels, one mission — your success" />
          <div className="grid md:grid-cols-2 gap-5">
            {(['VMA', 'VCS'] as Channel[]).map((ch) => {
              const info = channelData[ch];
              return (
                <div key={ch} className={`rounded-xl border-2 ${info.borderColor} bg-card p-7 flex flex-col`}>
                  <div className="text-4xl mb-3">{info.emoji}</div>
                  <h3 className="font-display font-extrabold text-xl text-text mb-1">{info.name}</h3>
                  <a
                    href={info.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-faint text-sm mb-3 hover:text-red transition-colors inline-flex items-center gap-1"
                  >
                    {info.handle} <span className="text-xs">↗</span>
                  </a>
                  <p className="text-muted text-sm mb-4">{info.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {info.tags.map((tag) => (
                      <span key={tag} className={info.tagBadgeClass}>{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-sm text-muted">{info.subs}</p>
                    <a
                      href={info.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-red px-4 py-2 text-sm font-semibold text-white hover:brightness-110 transition-all"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      Subscribe
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 8b — Our Websites */}
      {externalSites.length > 0 && (
        <section className="bg-bg py-[72px] px-4">
          <div className="max-w-7xl mx-auto">
            <SectionHead title="Our Learning Platforms" subtitle="Explore more educational tools from Vikas Maurya" />
            <div className="grid md:grid-cols-2 gap-5">
              {externalSites.map((site) => (
                <a
                  key={site.url}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-hover group flex items-center gap-5"
                >
                  <div className="w-16 h-16 rounded-xl bg-bg flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                    {site.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-text mb-1 group-hover:text-green transition-colors flex items-center gap-2">
                      {site.name} <span className="text-xs text-faint">↗</span>
                    </h3>
                    <p className="text-muted text-sm">{site.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 9 — Testimonials */}
      <section className="bg-card py-[72px] px-4 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <SectionHead title="Student Success Stories" subtitle="Real students, real results" />
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {testimonials.map((t) => (
              <div key={t.name} className="card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-green text-white font-bold flex items-center justify-center">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-text text-sm">{t.name}</div>
                    <div className="text-xs text-muted">{t.college} · {t.detail}</div>
                  </div>
                </div>
                <div className="text-[#F59E0B] text-sm mb-2">{'★'.repeat(5)}</div>
                <p className="text-muted text-sm italic">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 10 — Placement Companies */}
      <section className="bg-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-faint uppercase tracking-wider mb-5">Our students get placed at</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {allCompanies.map((company) => (
              <Link
                key={company}
                to="/placement"
                className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-muted hover:border-green hover:text-green transition-all"
              >
                {company}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 11 — Final CTA */}
      <section className="bg-green py-[76px] px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-extrabold text-white mb-4" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            Ready to start your journey?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join 9,000+ students learning and getting placed with Vikas Maurya Academy.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => (user ? window.location.href = '/dashboard' : openAuthModal('signup'))}
              className="bg-white text-green font-semibold px-6 py-3 rounded-lg hover:bg-green-light transition-colors"
            >
              Sign Up Free →
            </button>
            <Link
              to="/arena"
              className="border-2 border-white/50 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Try Code Arena Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
