import { useState, useEffect } from 'react';
import { fetchNotes, type DBNote } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';

export function NotesPage() {
  const { user, showToast, openAuthModal } = useApp();
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<DBNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes()
      .then(setNotes)
      .catch((e) => console.error('Failed to load notes:', e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) || n.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = (note: DBNote) => {
    if (note.free) {
      showToast(`Downloading "${note.title}"…`, 'success');
    } else if (!user) {
      openAuthModal('login');
      showToast('Please log in to download this note', 'warning');
    } else {
      showToast(`Downloading "${note.title}"…`, 'success');
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16 px-4" style={{ background: 'linear-gradient(135deg, #E1F5EE 0%, #E3F2FD 100%)' }}>
        <h1 className="font-display font-extrabold text-text mb-4" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>PDF Notes</h1>
        <div className="max-w-[480px] mx-auto">
          <input
            type="text"
            placeholder="Search notes by title or subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card animate-pulse h-[160px]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-12 text-muted">No notes found. Try a different search!</div>
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {filtered.map((note) => (
              <div key={note.id} className="card-hover">
                <div className="flex gap-4 mb-4">
                  <div className={`w-[50px] h-[58px] rounded-lg flex items-center justify-center text-2xl shrink-0 ${note.free ? 'bg-green-light' : 'bg-blue-light'}`}>
                    {note.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text text-sm mb-2">{note.title}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs px-2 py-0.5 rounded bg-bg text-muted">{note.subject}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-bg text-muted">{note.pages} pages</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-bg text-muted">{note.size}</span>
                    </div>
                  </div>
                </div>
                {note.free && <span className="badge-green mb-3 inline-flex">FREE</span>}
                {note.link ? (
                  <a href={note.link} target="_blank" rel="noopener noreferrer" className={note.free ? 'btn-primary w-full' : 'btn-dark w-full'}>
                    ⬇️ {note.free ? 'Download Free' : 'Download (Enrolled)'}
                  </a>
                ) : (
                  <button
                    onClick={() => handleDownload(note)}
                    className={note.free ? 'btn-primary w-full' : 'btn-dark w-full'}
                  >
                    ⬇️ {note.free ? 'Download Free' : 'Download (Enrolled)'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
