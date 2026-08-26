import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchYouTubeVideos, fetchSiteSettings, type YouTubeVideoItem, type DBSiteSettings, type Channel } from '@/lib/supabase';
import { videos } from '@/data/mockData';
import { ChBadge } from '@/components/ui';

export function VideosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const channel = (searchParams.get('channel') as Channel | null) || 'All';
  const [selectedVideo, setSelectedVideo] = useState<{ videoId: string; title: string; channel: Channel } | null>(null);
  const [ytVideos, setYtVideos] = useState<YouTubeVideoItem[]>([]);
  const [settings, setSettings] = useState<DBSiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchYouTubeVideos(channel === 'All' ? undefined : channel, 12)
      .then((v) => setYtVideos(v))
      .catch((e) => setError(e.message || 'Failed to load videos'))
      .finally(() => setLoading(false));
  }, [channel]);

  const filtered = videos.filter((v) => channel === 'All' || v.channel === channel);

  const subInfo: Record<Channel, { name: string; url: string; subs: string }> = {
    VMA: {
      name: 'Vikas Maurya Academy',
      url: 'https://www.youtube.com/@VikasMauryaAcademy',
      subs: settings?.vma_subscribers || '6.85K subscribers',
    },
    VCS: {
      name: 'Vikas Coding School',
      url: 'https://www.youtube.com/@VikasCodingSchool',
      subs: settings?.vcs_subscribers || '6.87K subscribers',
    },
  };

  return (
    <div>
      <section className="text-center py-16 px-4" style={{ background: 'linear-gradient(135deg, #FCE4EC 0%, #FFF3E0 100%)' }}>
        <h1 className="font-display font-extrabold text-text" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>Videos</h1>
        <p className="text-muted text-lg mt-2">1,325+ lectures across both channels</p>
      </section>

      {/* Channel subscribe bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-3">
          {(['VMA', 'VCS'] as Channel[]).map((ch) => {
            const info = subInfo[ch];
            return (
              <a
                key={ch}
                href={info.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-lg border border-border bg-bg px-4 py-2.5 hover:border-red hover:shadow-soft transition-all group"
              >
                <span className="text-xl">{ch === 'VMA' ? '📚' : '💻'}</span>
                <div className="text-left">
                  <div className="text-sm font-semibold text-text group-hover:text-red transition-colors">{info.name}</div>
                  <div className="text-xs text-muted">{info.subs}</div>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-md bg-red px-2.5 py-1 text-xs font-semibold text-white ml-2">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  Subscribe
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Channel filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['All', 'VMA', 'VCS'].map((tab) => {
            const label = tab === 'All' ? 'All Videos' : tab === 'VMA' ? '📚 Vikas Maurya Academy' : '💻 Vikas Coding School';
            const active = channel === tab;
            return (
              <button
                key={tab}
                onClick={() => { setSearchParams(tab === 'All' ? {} : { channel: tab }); setSelectedVideo(null); }}
                className={`pill-tab ${active ? 'pill-tab-active' : 'pill-tab-idle'}`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Featured video player */}
        {selectedVideo && (
          <div className="mb-8 animate-fadeUp">
            <div className="rounded-xl overflow-hidden shadow-soft bg-dark">
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                  title={selectedVideo.title}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              <h3 className="font-display font-bold text-text text-lg">{selectedVideo.title}</h3>
              <a
                href={subInfo[selectedVideo.channel].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-red transition-colors"
              >
                Watch on YouTube ↗
              </a>
            </div>
          </div>
        )}

        {/* Latest YouTube videos */}
        <div className="mb-10">
          <h2 className="font-display font-bold text-text text-lg mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            Latest from YouTube
          </h2>
          {loading ? (
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-video rounded-lg bg-bg mb-3" />
                  <div className="h-4 bg-bg rounded w-3/4 mb-2" />
                  <div className="h-3 bg-bg rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="card text-center py-8 text-muted">
              <p className="mb-2">Couldn't load live YouTube videos.</p>
              <p className="text-sm text-faint">This usually means the YouTube RSS feed is temporarily unavailable. Your videos will appear here once the feed is back.</p>
            </div>
          ) : ytVideos.length === 0 ? (
            <div className="card text-center py-8 text-muted">No videos found.</div>
          ) : (
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {ytVideos.map((v) => (
                <div key={v.videoId} className="card-hover group cursor-pointer" onClick={() => setSelectedVideo({ videoId: v.videoId, title: v.title, channel: v.channel })}>
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
                    {v.publishedDate && (
                      <span className="absolute bottom-2 left-2 bg-dark/80 text-white text-xs px-2 py-0.5 rounded">
                        {new Date(v.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <ChBadge channel={v.channel} />
                  </div>
                  <h3 className="text-sm font-semibold text-text mb-1 line-clamp-2 group-hover:text-green transition-colors">{v.title}</h3>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All video catalog */}
        <div>
          <h2 className="font-display font-bold text-text text-lg mb-4">All Video Lectures</h2>
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {filtered.map((video) => (
              <div key={video.id} className="card-hover group cursor-pointer">
                <div className="relative h-[160px] bg-dark rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                  <span className="text-5xl">{video.emoji}</span>
                  <span className="absolute bottom-2 right-2 bg-dark/80 text-white text-xs px-2 py-0.5 rounded font-mono">
                    {video.duration}
                  </span>
                  <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <span className="text-dark text-lg ml-0.5">▶️</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <ChBadge channel={video.channel} />
                </div>
                <h3 className="text-sm font-semibold text-text mb-1 line-clamp-2">{video.title}</h3>
                <p className="text-xs text-muted">{video.views} · {video.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
