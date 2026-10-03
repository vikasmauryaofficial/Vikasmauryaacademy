import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { fetchCourses, fetchProblems, fetchYouTubeVideos, type DBCourse, type DBProblem, type YouTubeVideoItem } from '@/lib/supabase';
import { EmptyState, SectionHead, ChBadge, Stars, Skeleton } from '@/components/ui';
import { BookOpen, CheckCircle2, Code2, Flame, TrendingUp, Award, Play, ArrowRight, Clock, Target, Zap, Trophy, Briefcase, FileText, Radio, PenLine, LogOut, Sparkles, BarChart3, ChevronRight } from 'lucide-react';

const quickAccess = [
  { icon: Code2, label: 'Code Arena', to: '/arena', color: 'bg-green-light text-green-dark' },
  { icon: FileText, label: 'PDF Notes', to: '/notes', color: 'bg-blue-light text-blue-dark' },
  { icon: Radio, label: 'Live Classes', to: '/live', color: 'bg-red-light text-red-dark' },
  { icon: Trophy, label: 'Certificates', to: '/certificates', color: 'bg-amber-light text-amber-dark' },
  { icon: Briefcase, label: 'Jobs', to: '/jobs', color: 'bg-purple-light text-purple-dark' },
  { icon: PenLine, label: 'Tech Blog', to: '/blog', color: 'bg-green-light text-green-dark' },
];

const achievementsList = [
  { id: 'first-course', icon: '🎯', title: 'First Course', desc: 'Enrolled in your first course', requirement: 1 },
  { id: 'three-courses', icon: '📚', title: 'Bookworm', desc: 'Enrolled in 3 courses', requirement: 3 },
  { id: 'five-problems', icon: '💻', title: 'Code Starter', desc: 'Solved 5 problems', requirement: 5 },
  { id: 'ten-problems', icon: '🧩', title: 'Problem Solver', desc: 'Solved 10 problems', requirement: 10 },
  { id: 'ten-lessons', icon: '✅', title: 'Quick Learner', desc: 'Completed 10 lessons', requirement: 10 },
  { id: 'streak-7', icon: '🔥', title: 'On Fire', desc: '7-day learning streak', requirement: 7 },
];

export function DashboardPage() {
  const { user, logout, openAuthModal, enrolledCourses, completedLessons, solvedProblems } = useApp();
  const [allCourses, setAllCourses] = useState<DBCourse[]>([]);
  const [dbProblems, setDbProblems] = useState<DBProblem[]>([]);
  const [ytVideos, setYtVideos] = useState<YouTubeVideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetchCourses().then(setAllCourses).catch(() => {}),
      fetchProblems().then(setDbProblems).catch(() => {}),
      fetchYouTubeVideos(undefined, 4).then(setYtVideos).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <EmptyState
          icon="🔒"
          title="Please log in"
          subtitle="Log in to view your dashboard and track your progress"
          action={<button onClick={() => openAuthModal('login')} className="btn-primary">Log In →</button>}
        />
      </div>
    );
  }

  const enrolled = allCourses.filter((c) => enrolledCourses.includes(c.id));
  const initials = user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const totalCompleted = Object.values(completedLessons).reduce((sum, arr) => sum + arr.length, 0);
  const streak = 7;

  const stats = [
    { icon: BookOpen, value: enrolled.length, label: 'Courses Enrolled', color: 'text-green', bg: 'bg-green-light' },
    { icon: CheckCircle2, value: totalCompleted, label: 'Lessons Completed', color: 'text-blue', bg: 'bg-blue-light' },
    { icon: Code2, value: solvedProblems.length, label: 'Problems Solved', color: 'text-amber', bg: 'bg-amber-light' },
    { icon: Flame, value: streak, label: 'Day Streak', color: 'text-red', bg: 'bg-red-light' },
  ];

  const recommended = allCourses
    .filter((c) => !enrolledCourses.includes(c.id))
    .slice(0, 3);

  const unlockedAchievements = achievementsList.filter((a) => {
    if (a.id === 'first-course') return enrolled.length >= 1;
    if (a.id === 'three-courses') return enrolled.length >= 3;
    if (a.id === 'five-problems') return solvedProblems.length >= 5;
    if (a.id === 'ten-problems') return solvedProblems.length >= 10;
    if (a.id === 'ten-lessons') return totalCompleted >= 10;
    if (a.id === 'streak-7') return streak >= 7;
    return false;
  });

  const overallProgress = enrolled.length > 0
    ? Math.round(enrolled.reduce((sum, c) => {
        const completed = completedLessons[c.id] || [];
        return sum + (c.syllabus.length > 0 ? (completed.length / c.syllabus.length) * 100 : 0);
      }, 0) / enrolled.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero welcome banner */}
      <div className="relative overflow-hidden rounded-2xl mb-8" style={{ background: 'linear-gradient(135deg, #1D9E75 0%, #178A65 50%, #0F6B52 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/8 blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
        <div className="relative p-6 md:p-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-[64px] h-[64px] rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white font-display font-extrabold text-2xl shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display font-extrabold text-white text-xl md:text-2xl">Welcome back, {user.name.split(' ')[0]}!</h1>
                <span className="text-2xl">👋</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white/70 text-sm">{user.email}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-amber/20 text-amber-200 border border-amber/30' : 'bg-white/15 text-white border border-white/20'}`}>
                  {user.role === 'admin' ? 'Admin' : 'Student'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link to="/admin" className="inline-flex items-center gap-2 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-all">
                <Sparkles className="w-4 h-4" /> Admin Panel
              </Link>
            )}
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-all">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="card relative overflow-hidden group"
            style={{ animation: `fadeUp 0.4s ease ${i * 0.05}s both` }}
          >
            <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full ${stat.bg} opacity-50 blur-xl group-hover:opacity-80 transition-opacity`} />
            <div className="relative flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl text-text">{stat.value}</div>
                <div className="text-xs text-muted">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall progress + Activity feed */}
      <div className="grid md:grid-cols-[1.5fr_1fr] gap-5 mb-8">
        {/* Overall progress card */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-5 h-5 text-green" />
            <h3 className="font-display font-bold text-text text-lg">Learning Progress</h3>
          </div>
          {enrolled.length > 0 ? (
            <>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <span className="text-4xl font-display font-extrabold text-green">{overallProgress}%</span>
                  <span className="text-muted text-sm ml-2">overall completion</span>
                </div>
                <span className="text-xs text-muted">{enrolled.length} active {enrolled.length === 1 ? 'course' : 'courses'}</span>
              </div>
              <div className="h-3 bg-bg rounded-full overflow-hidden mb-5">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${overallProgress}%`, background: 'linear-gradient(90deg, #1D9E75, #34D399)' }}
                />
              </div>
              <div className="space-y-3">
                {enrolled.slice(0, 3).map((course) => {
                  const completed = completedLessons[course.id] || [];
                  const progress = course.syllabus.length > 0
                    ? Math.round((completed.length / course.syllabus.length) * 100)
                    : 0;
                  return (
                    <Link key={course.id} to={`/courses/${course.id}`} className="flex items-center gap-3 group">
                      <span className="text-xl shrink-0">{course.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-text truncate group-hover:text-green transition-colors">{course.title}</span>
                          <span className="text-xs text-muted shrink-0 ml-2">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                          <div className="h-full bg-green rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <EmptyState
              icon="📊"
              title="No progress yet"
              subtitle="Enroll in a course to start tracking your learning progress"
              action={<Link to="/courses" className="btn-primary text-sm">Browse Courses →</Link>}
            />
          )}
        </div>

        {/* Activity feed */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-5 h-5 text-amber" />
            <h3 className="font-display font-bold text-text text-lg">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {enrolled.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-light flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text">Enrolled in <span className="font-semibold">{enrolled[enrolled.length - 1]?.title || 'a course'}</span></p>
                  <p className="text-xs text-faint mt-0.5">Keep up the momentum!</p>
                </div>
              </div>
            )}
            {solvedProblems.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-light flex items-center justify-center shrink-0">
                  <Code2 className="w-4 h-4 text-amber" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text">Solved <span className="font-semibold">{solvedProblems.length} coding {solvedProblems.length === 1 ? 'problem' : 'problems'}</span></p>
                  <p className="text-xs text-faint mt-0.5">Keep practicing in the Arena</p>
                </div>
              </div>
            )}
            {totalCompleted > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-light flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text">Completed <span className="font-semibold">{totalCompleted} {totalCompleted === 1 ? 'lesson' : 'lessons'}</span></p>
                  <p className="text-xs text-faint mt-0.5">Great progress!</p>
                </div>
              </div>
            )}
            {enrolled.length === 0 && solvedProblems.length === 0 && totalCompleted === 0 && (
              <div className="text-center py-6">
                <p className="text-3xl mb-2">🚀</p>
                <p className="text-sm text-muted mb-3">Your activity will appear here once you start learning</p>
                <Link to="/courses" className="text-sm font-semibold text-green hover:underline">Start learning →</Link>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-light flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 text-red" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text"><span className="font-semibold">{streak}-day streak</span> — you're on fire!</p>
                <p className="text-xs text-faint mt-0.5">Come back tomorrow to keep it going</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="mb-8">
        <SectionHead
          title="My Courses"
          right={<Link to="/courses" className="text-sm font-semibold text-green hover:underline">Browse more →</Link>}
        />
        {loading ? (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card">
                <Skeleton className="h-[80px] mb-3" />
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-2 w-full mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        ) : enrolled.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No courses enrolled yet"
            subtitle="Browse courses and start learning today"
            action={<Link to="/courses" className="btn-primary">Browse Courses →</Link>}
          />
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {enrolled.map((course) => {
              const completed = completedLessons[course.id] || [];
              const progress = course.syllabus.length > 0
                ? Math.round((completed.length / course.syllabus.length) * 100)
                : 0;
              return (
                <Link key={course.id} to={`/courses/${course.id}`} className="card-hover group">
                  <div className={`h-[80px] rounded-lg flex items-center justify-center text-3xl mb-3 ${course.channel === 'VMA' ? 'bg-green-light' : 'bg-blue-light'} group-hover:scale-[1.02] transition-transform`}>
                    {course.emoji}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <ChBadge channel={course.channel} />
                  </div>
                  <h3 className="text-sm font-semibold text-text mb-3 line-clamp-1">{course.title}</h3>
                  <div className="h-2 bg-bg rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #1D9E75, #34D399)' }} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">{progress}% complete</span>
                    <span className="text-green font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Continue <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="mb-8">
        <SectionHead title="Achievements" subtitle="Unlock badges as you learn and practice" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievementsList.map((a) => {
            const unlocked = unlockedAchievements.some((u) => u.id === a.id);
            return (
              <div
                key={a.id}
                className={`card text-center p-4 transition-all ${unlocked ? 'border-green-mid bg-green-light/30' : 'opacity-50 grayscale'}`}
              >
                <div className="text-3xl mb-2">{a.icon}</div>
                <div className="text-xs font-bold text-text mb-1">{a.title}</div>
                <div className="text-[10px] text-muted leading-tight">{a.desc}</div>
                {unlocked && <div className="mt-2 text-[10px] text-green font-semibold">Unlocked!</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended courses */}
      {!loading && recommended.length > 0 && (
        <div className="mb-8">
          <SectionHead
            title="Recommended for You"
            subtitle="Based on your activity"
            right={<Link to="/courses" className="text-sm font-semibold text-green hover:underline">View all →</Link>}
          />
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {recommended.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`} className="card-hover group">
                <div className={`h-[80px] rounded-lg flex items-center justify-center text-3xl mb-3 ${course.channel === 'VMA' ? 'bg-green-light' : 'bg-blue-light'} group-hover:scale-[1.02] transition-transform`}>
                  {course.emoji}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <ChBadge channel={course.channel} />
                </div>
                <h3 className="text-sm font-semibold text-text mb-1 line-clamp-1">{course.title}</h3>
                <p className="text-xs text-muted mb-2 line-clamp-1">{course.description}</p>
                <Stars rating={course.rating} reviews={course.reviews} />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-extrabold text-text">{course.price === 0 ? 'Free' : `₹${course.price.toLocaleString()}`}</span>
                  <span className="text-xs text-green font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    {course.price === 0 ? 'Enroll Free' : 'Learn More'} <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Latest YouTube + Quick Access */}
      <div className="grid md:grid-cols-[1.5fr_1fr] gap-5">
        {/* Latest videos */}
        <div>
          <SectionHead
            title="Latest Videos"
            right={<Link to="/videos" className="text-sm font-semibold text-green hover:underline">All videos →</Link>}
          />
          {ytVideos.length > 0 ? (
            <div className="space-y-3">
              {ytVideos.slice(0, 3).map((v) => (
                <Link key={v.videoId} to="/videos" className="card flex items-center gap-3 group">
                  <div className="relative w-[100px] h-[56px] rounded-lg overflow-hidden shrink-0 bg-dark">
                    <img
                      src={`https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-dark/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <ChBadge channel={v.channel} />
                    </div>
                    <p className="text-sm font-medium text-text truncate group-hover:text-green transition-colors">{v.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card text-center py-6 text-muted text-sm">No videos available</div>
          )}
        </div>

        {/* Quick Access */}
        <div>
          <SectionHead title="Quick Access" />
          <div className="grid grid-cols-3 gap-3">
            {quickAccess.map((item) => (
              <Link key={item.label} to={item.to} className="card-hover flex flex-col items-center text-center py-5 group">
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-text">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
