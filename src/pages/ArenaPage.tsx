import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchProblems, type DBProblem, type Difficulty } from '@/lib/supabase';
import { leaderboard } from '@/data/mockData';
import { DiffBadge } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, X, Play, Send, CheckCircle2, XCircle, Trophy } from 'lucide-react';

export function ArenaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<'problems' | 'leaderboard'>(searchParams.get('tab') === 'leaderboard' ? 'leaderboard' : 'problems');
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState<'All' | Difficulty>('All');
  const [activeProblem, setActiveProblem] = useState<DBProblem | null>(null);
  const [problems, setProblems] = useState<DBProblem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblems()
      .then(setProblems)
      .catch((e) => console.error('Failed to load problems:', e))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const problemSlug = searchParams.get('problem');
    if (problemSlug && problems.length > 0) {
      const p = problems.find((pr) => pr.slug === problemSlug);
      if (p) setActiveProblem(p);
    }
  }, [searchParams, problems]);

  const { solvedProblems } = useApp();

  const filtered = problems.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (diffFilter !== 'All' && p.difficulty !== diffFilter) return false;
    return true;
  });

  const stats = [
    { label: 'All', count: problems.length, color: 'text-white' },
    { label: 'Easy', count: problems.filter((p) => p.difficulty === 'Easy').length, color: 'text-green' },
    { label: 'Medium', count: problems.filter((p) => p.difficulty === 'Medium').length, color: 'text-amber' },
    { label: 'Hard', count: problems.filter((p) => p.difficulty === 'Hard').length, color: 'text-red' },
  ];

  if (activeProblem) {
    return <ProblemSolver problem={activeProblem} onBack={() => { setActiveProblem(null); setSearchParams({}); }} />;
  }

  return (
    <div className="bg-dark min-h-screen">
      {/* Arena navbar */}
      <div className="bg-dark-card border-b border-dark-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/60 hover:text-white text-sm">← Home</Link>
            <div className="flex gap-1">
              <button
                onClick={() => setTab('problems')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'problems' ? 'bg-green text-white' : 'text-white/60 hover:text-white hover:bg-dark-hover'}`}
              >
                Problems
              </button>
              <button
                onClick={() => setTab('leaderboard')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'leaderboard' ? 'bg-green text-white' : 'text-white/60 hover:text-white hover:bg-dark-hover'}`}
              >
                Leaderboard
              </button>
            </div>
          </div>
          <div className="text-sm font-semibold text-green">
            ✅ {solvedProblems.length}/{problems.length} solved
          </div>
        </div>
      </div>

      {tab === 'problems' && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Filter row */}
          <div className="flex gap-3 mb-5 flex-wrap">
            <input
              type="text"
              placeholder="Search problems…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-green placeholder:text-white/30"
            />
            <select
              value={diffFilter}
              onChange={(e) => setDiffFilter(e.target.value as 'All' | Difficulty)}
              className="bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-green"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-dark-card border border-dark-border rounded-lg p-4">
                <div className={`text-2xl font-extrabold ${s.color}`}>{s.count}</div>
                <div className="text-xs text-white/50 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Problem table */}
          {loading ? (
            <div className="bg-dark-card border border-dark-border rounded-xl p-8 text-center text-white/40">
              Loading problems…
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-dark-card border border-dark-border rounded-xl p-8 text-center text-white/40">
              No problems found. Try a different filter!
            </div>
          ) : (
            <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-[40px_1fr_120px_100px_80px] gap-3 px-4 py-3 border-b border-dark-border text-xs font-semibold text-white/40 uppercase tracking-wide">
                <span></span>
                <span>Title</span>
                <span className="hidden md:block">Tags</span>
                <span>Difficulty</span>
                <span className="text-right">Acceptance</span>
              </div>
              {filtered.map((p) => {
                const solved = solvedProblems.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveProblem(p)}
                    className="w-full grid grid-cols-[40px_1fr_120px_100px_80px] gap-3 px-4 py-3 border-b border-dark-border last:border-b-0 hover:bg-dark-hover transition-colors text-left items-center"
                  >
                    <span className="text-sm">{solved ? '✅' : '⬜'}</span>
                    <div className="min-w-0">
                      <div className={`text-sm font-medium truncate ${solved ? 'text-white/40' : 'text-white'}`}>{p.title}</div>
                      <div className="flex gap-1 mt-1">
                        {p.companies.slice(0, 3).map((c) => (
                          <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-[#3a3520] text-[#F59E0B] font-medium">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="hidden md:flex flex-wrap gap-1">
                      {p.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-dark-hover text-white/50">{tag}</span>
                      ))}
                    </div>
                    <div><DiffBadge difficulty={p.difficulty} /></div>
                    <span className="text-xs text-white/40 text-right">{p.acceptance}%</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="max-w-[800px] mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <Trophy className="w-12 h-12 text-[#F59E0B] mx-auto mb-3" />
            <h2 className="font-display font-extrabold text-white text-2xl mb-1">Global Leaderboard</h2>
            <p className="text-white/50 text-sm">Top solvers this month 🔥</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-[60px_1fr_1fr_80px_80px] gap-3 px-4 py-3 border-b border-dark-border text-xs font-semibold text-white/40 uppercase tracking-wide">
              <span>Rank</span>
              <span>Student</span>
              <span className="hidden md:block">College</span>
              <span className="text-right">Solved</span>
              <span className="text-right">Streak</span>
            </div>
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className="grid grid-cols-[60px_1fr_1fr_80px_80px] gap-3 px-4 py-3 border-b border-dark-border last:border-b-0 items-center"
              >
                <span className="text-sm font-bold text-white/60">
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                </span>
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    entry.rank <= 3
                      ? entry.rank === 1 ? 'bg-[#F59E0B] text-white' : entry.rank === 2 ? 'bg-[#9CA3AF] text-white' : 'bg-[#CD7F32] text-white'
                      : 'bg-green text-white'
                  }`}>
                    {entry.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <span className="text-sm font-medium text-white truncate">{entry.name}</span>
                </div>
                <span className="text-sm text-white/50 hidden md:block truncate">{entry.college}</span>
                <span className="text-sm font-bold text-green text-right">{entry.solved}</span>
                <span className="text-sm text-amber text-right">🔥 {entry.streak}d</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProblemSolver({ problem, onBack }: { problem: DBProblem; onBack: () => void }) {
  const { toggleProblemSolved, showToast } = useApp();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(problem.starter_code['javascript'] || '');
  const [result, setResult] = useState<{ status: 'accepted' | 'wrong' | null; runtime?: number; memory?: number }>({ status: null });
  const [judging, setJudging] = useState(false);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    setCode(problem.starter_code[language] || '');
  }, [language, problem.starter_code]);

  const handleRun = () => {
    setJudging(true);
    setResult({ status: null });
    setTimeout(() => {
      const accepted = Math.random() > 0.3;
      setJudging(false);
      setResult({
        status: accepted ? 'accepted' : 'wrong',
        runtime: Math.floor(Math.random() * 80) + 1,
        memory: Math.floor(Math.random() * 20) + 40,
      });
      if (accepted) {
        toggleProblemSolved(problem.id);
        showToast('Solution accepted! ✅', 'success');
      }
    }, 1200);
  };

  const languages = ['javascript', 'python', 'java', 'cpp'];

  return (
    <div className="bg-dark min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-dark-card border-b border-dark-border px-4 h-12 flex items-center justify-between">
        <button onClick={onBack} className="text-white/60 hover:text-white text-sm flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to problems
        </button>
        <Link to="/" className="text-white/60 hover:text-white text-sm">← Home</Link>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left — problem description */}
        <div className="lg:w-1/2 bg-dark-card overflow-y-auto scrollbar-dark p-6">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="font-display font-extrabold text-white text-xl">{problem.title}</h1>
            <DiffBadge difficulty={problem.difficulty} />
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {problem.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded bg-dark-hover text-white/50">{tag}</span>
            ))}
          </div>
          <pre className="text-[#C8C5BC] text-sm whitespace-pre-wrap mb-5" style={{ lineHeight: 1.8 }}>{problem.description}</pre>

          <div className="space-y-3 mb-5">
            {problem.examples.map((ex, i) => (
              <div key={i}>
                <div className="text-sm font-semibold text-white mb-2">Example {i + 1}:</div>
                <div className="bg-[#252830] rounded-lg p-3 font-mono text-sm space-y-1">
                  <div><span className="text-white/50">Input: </span><span className="text-[#C8C5BC]">{ex.input}</span></div>
                  <div><span className="text-white/50">Output: </span><span className="text-[#C8C5BC]">{ex.output}</span></div>
                  <div><span className="text-white/50">Explanation: </span><span className="text-[#C8C5BC]">{ex.explanation}</span></div>
                </div>
              </div>
            ))}
          </div>

          {problem.companies.length > 0 && (
            <div className="mb-5">
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2">Asked by</div>
              <div className="flex flex-wrap gap-1.5">
                {problem.companies.map((c) => (
                  <span key={c} className="text-xs px-2 py-1 rounded bg-[#3a3520] text-[#F59E0B] font-medium">{c}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-sm font-semibold text-amber flex items-center gap-1 hover:underline"
            >
              💡 {showHints ? 'Hide hints' : 'Show hints'}
            </button>
            {showHints && (
              <div className="mt-2 space-y-2">
                {problem.hints.map((hint, i) => (
                  <div key={i} className="text-sm text-amber/80 bg-[#2a2515] rounded-lg p-3">{hint}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — code editor + results */}
        <div className="lg:w-1/2 bg-dark flex flex-col">
          {/* Language selector */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-dark-border">
            <div className="flex gap-1.5">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    language === lang ? 'bg-green text-white' : 'bg-dark-card text-white/50 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button onClick={onBack} className="text-white/40 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Code editor */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-[#0D1020] text-[#C8C5BC] font-mono text-sm p-4 outline-none resize-none scrollbar-dark min-h-[200px]"
            spellCheck={false}
          />

          {/* Result panel */}
          {result.status && (
            <div className={`px-4 py-3 border-t ${result.status === 'accepted' ? 'bg-green/10 border-green/30' : 'bg-red/10 border-red/30'}`}>
              <div className="flex items-center gap-2">
                {result.status === 'accepted' ? (
                  <CheckCircle2 className="w-5 h-5 text-green" />
                ) : (
                  <XCircle className="w-5 h-5 text-red" />
                )}
                <span className={`text-sm font-semibold ${result.status === 'accepted' ? 'text-green' : 'text-red'}`}>
                  {result.status === 'accepted' ? '✅ Accepted' : '❌ Wrong Answer'}
                </span>
              </div>
              {result.status === 'accepted' && (
                <div className="text-xs text-white/50 mt-1">
                  Runtime: {result.runtime}ms · Memory: {result.memory}MB
                </div>
              )}
            </div>
          )}

          {/* Submit bar */}
          <div className="flex gap-2 p-3 border-t border-dark-border bg-dark-card">
            <button
              onClick={handleRun}
              disabled={judging}
              className="btn-dark disabled:opacity-50"
            >
              <Play className="w-4 h-4" /> Run
            </button>
            <button
              onClick={handleRun}
              disabled={judging}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {judging ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Judging…
                </span>
              ) : (
                <><Send className="w-4 h-4" /> Submit Solution</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
