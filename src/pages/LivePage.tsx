import { liveClasses } from '@/data/mockData';
import { ChBadge, SectionHead } from '@/components/ui';
import { useApp } from '@/context/AppContext';

export function LivePage() {
  const { showToast } = useApp();
  const liveClass = liveClasses.find((l) => l.live);
  const upcoming = liveClasses.filter((l) => !l.live);

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16 px-4" style={{ background: 'linear-gradient(135deg, #FEECEC 0%, #FFF3E2 100%)' }}>
        <div className="inline-flex items-center gap-2 rounded-full bg-red-light border border-red/30 px-4 py-1.5 text-sm font-semibold text-red mb-4">
          <span className="w-2 h-2 rounded-full bg-red animate-pulseDot" /> Live sessions every week
        </div>
        <h1 className="font-display font-extrabold text-text" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>Live Classes</h1>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Live Now */}
        {liveClass && (
          <div className="border-2 border-red rounded-xl p-5 bg-card mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-[200px] h-[120px] rounded-lg bg-dark flex flex-col items-center justify-center shrink-0">
                <span className="text-4xl mb-1">📹</span>
                <span className="text-white text-xs font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulseDot" /> LIVE
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <ChBadge channel={liveClass.channel} />
                  <span className="badge-red text-xs">🔴 {liveClass.watching} watching</span>
                </div>
                <h2 className="font-display font-extrabold text-text mb-2" style={{ fontSize: '22px' }}>{liveClass.title}</h2>
                <p className="text-muted text-sm mb-4">{liveClass.description}</p>
                <button onClick={() => showToast('Joining live class…', 'success')} className="btn-red">Join Live Class →</button>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming */}
        <SectionHead title="Upcoming classes" subtitle="Set a reminder so you don't miss out" />
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {upcoming.map((cls) => (
            <div key={cls.id} className="card-hover">
              <div className="flex items-center gap-2 mb-3">
                <ChBadge channel={cls.channel} />
                <span className="badge-amber text-xs">{cls.time}</span>
                <span className="text-xs text-faint">{cls.date}</span>
              </div>
              <h3 className="text-[15px] font-semibold text-text mb-3">{cls.title}</h3>
              <p className="text-muted text-sm mb-4">{cls.description}</p>
              <button
                onClick={() => showToast(`Reminder set for "${cls.title}" 🔔`, 'success')}
                className="btn-outline w-full"
              >
                🔔 Set Reminder
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
