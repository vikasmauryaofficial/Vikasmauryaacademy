import { useState } from 'react';
import { placementCompanies } from '@/data/mockData';
import { SectionHead } from '@/components/ui';

export function PlacementPage() {
  const [selected, setSelected] = useState(placementCompanies[0]);

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16 px-4" style={{ background: 'linear-gradient(135deg, #FEF3E2 0%, #FEF9E7 100%)' }}>
        <h1 className="font-display font-extrabold text-text" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>Placement Prep</h1>
        <p className="text-muted text-lg mt-2">Company-specific interview preparation guides</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Company selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          {placementCompanies.map((company) => (
            <button
              key={company.name}
              onClick={() => setSelected(company)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                selected.name === company.name
                  ? 'border-amber bg-amber-light text-amber'
                  : 'border-border bg-card text-muted hover:border-amber hover:text-amber'
              }`}
            >
              {company.name}
            </button>
          ))}
        </div>

        {/* Selected company panel */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Interview Rounds */}
          <div className="card">
            <h2 className="font-display font-bold text-text text-lg mb-1">{selected.name}</h2>
            <h3 className="text-sm text-muted mb-5">Interview Rounds</h3>
            <div className="space-y-3">
              {selected.rounds.map((round, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-light text-green-dark text-sm font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm text-text pt-1">{round}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Strategy */}
            <div className="card">
              <h3 className="font-bold text-text mb-3">💡 Strategy & Tips</h3>
              <p className="text-muted text-sm" style={{ lineHeight: 1.7 }}>{selected.strategy}</p>
            </div>

            {/* Resources */}
            <div className="card">
              <h3 className="font-bold text-text mb-4">Recommended Resources</h3>
              <div className="space-y-3">
                {selected.resources.map((res, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-text">{res.title}</span>
                    <span className="text-sm font-semibold text-green">{res.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
