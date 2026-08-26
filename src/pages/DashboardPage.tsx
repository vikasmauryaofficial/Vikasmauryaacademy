import { Link } from 'react-router-dom';
import { courses } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { EmptyState, SectionHead, ChBadge } from '@/components/ui';

const quickAccess = [
  { icon: '💻', label: 'Code Arena', to: '/arena' },
  { icon: '📄', label: 'PDF Notes', to: '/notes' },
  { icon: '🔴', label: 'Live Classes', to: '/live' },
  { icon: '🏆', label: 'Certificates', to: '/certificates' },
  { icon: '💼', label: 'Jobs', to: '/jobs' },
  { icon: '✍️', label: 'Tech Blog', to: '/blog' },
];

export function DashboardPage() {
  const { user, logout, openAuthModal, enrolledCourses, completedLessons, solvedProblems } = useApp();

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

  const enrolled = courses.filter((c) => enrolledCourses.includes(c.id));
  const initials = user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const totalCompleted = Object.values(completedLessons).reduce((sum, arr) => sum + arr.length, 0);

  const stats = [
    { icon: '📚', value: enrolled.length, label: 'Courses Enrolled' },
    { icon: '✅', value: totalCompleted, label: 'Lessons Completed' },
    { icon: '💻', value: solvedProblems.length, label: 'Problems Solved' },
    { icon: '🔥', value: 7, label: 'Day Streak' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Welcome header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-[60px] h-[60px] rounded-full bg-green text-white font-display font-extrabold text-xl flex items-center justify-center">
            {initials}
          </div>
          <div>
            <h1 className="font-display font-extrabold text-text text-xl">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted">{user.email}</span>
              <span className={user.role === 'admin' ? 'badge-purple' : 'badge-green'}>
                {user.role === 'admin' ? 'Admin' : 'Student'}
              </span>
            </div>
          </div>
        </div>
        <button onClick={logout} className="btn-outline">Logout</button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="card flex items-center gap-3">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <div className="font-display font-extrabold text-2xl text-green">{stat.value}</div>
              <div className="text-xs text-muted">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* My Courses */}
      <div className="mb-10">
        <SectionHead
          title="My Courses"
          right={<Link to="/courses" className="text-sm font-semibold text-green hover:underline">Browse more →</Link>}
        />
        {enrolled.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No courses enrolled yet"
            subtitle="Browse courses and start learning today"
            action={<Link to="/courses" className="btn-primary">Browse Courses →</Link>}
          />
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {enrolled.map((course) => {
              const completed = completedLessons[course.id] || [];
              const progress = course.syllabus.length > 0
                ? Math.round((completed.length / course.syllabus.length) * 100)
                : 0;
              return (
                <Link key={course.id} to={`/courses/${course.id}`} className="card-hover">
                  <div className={`h-[80px] rounded-lg flex items-center justify-center text-3xl mb-3 ${course.channel === 'VMA' ? 'bg-green-light' : 'bg-blue-light'}`}>
                    {course.emoji}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <ChBadge channel={course.channel} />
                  </div>
                  <h3 className="text-sm font-semibold text-text mb-3 line-clamp-1">{course.title}</h3>
                  <div className="h-2 bg-bg rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-green rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">{progress}% complete</span>
                    <span className="text-green font-semibold">Continue →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Access */}
      <div>
        <SectionHead title="Quick Access" />
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
          {quickAccess.map((item) => (
            <Link key={item.label} to={item.to} className="card-hover flex flex-col items-center text-center py-6">
              <span className="text-3xl mb-2">{item.icon}</span>
              <span className="text-sm font-semibold text-text">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
