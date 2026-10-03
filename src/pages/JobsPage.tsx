import { useState, useEffect } from 'react';
import { fetchJobs, type DBJob } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';

export function JobsPage() {
  const { showToast } = useApp();
  const [filter, setFilter] = useState('All');
  const [applied, setApplied] = useState<string[]>([]);
  const [jobs, setJobs] = useState<DBJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs()
      .then(setJobs)
      .catch((e) => console.error('Failed to load jobs:', e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter((j) => filter === 'All' || j.type === filter);

  const handleApply = (job: DBJob) => {
    if (applied.includes(job.id)) return;
    setApplied([...applied, job.id]);
    showToast(`Applied to ${job.title} at ${job.company} ✅`, 'success');
  };

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16 px-4" style={{ background: 'linear-gradient(135deg, #FEF3E2 0%, #FFF8E7 100%)' }}>
        <h1 className="font-display font-extrabold text-text" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>Jobs Board</h1>
        <p className="text-muted text-lg mt-2">Fresher jobs, internships, and campus drives</p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['All', 'Full-time', 'Internship', 'Part-time', 'Contract'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pill-tab ${filter === tab ? 'pill-tab-active' : 'pill-tab-idle'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Jobs list */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card animate-pulse h-[80px]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-12 text-muted">No job listings available right now. Check back soon!</div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((job) => {
              const isApplied = applied.includes(job.id);
              return (
                <div key={job.id} className="card-hover flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-[52px] h-[52px] rounded-[13px] bg-bg flex items-center justify-center text-2xl shrink-0">
                      {job.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-text text-base mb-0.5">{job.title}</h3>
                      <p className="text-sm text-muted">{job.company} · {job.location} · {job.experience}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {job.tech.map((t) => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded bg-bg text-muted">{t}</span>
                        ))}
                        <span className="badge-amber text-xs">{job.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-1 md:text-right shrink-0">
                    <span className="font-bold text-text text-sm">{job.salary}</span>
                    <span className="text-xs text-faint">{job.posted}</span>
                    {job.link ? (
                      <a href={job.link} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-3 py-1.5">
                        Apply Now ↗
                      </a>
                    ) : (
                      <button
                        onClick={() => handleApply(job)}
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        {isApplied ? '✓ Applied' : 'Apply Now'}
                      </button>
                    )}
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
