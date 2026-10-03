import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courses } from '@/data/mockData';
import { ChBadge } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, CheckCircle2, Download, Play, Pause, Volume2, Maximize, Settings } from 'lucide-react';

export function VideoPlayerPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { isEnrolled, completedLessons, toggleLessonComplete, showToast } = useApp();
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);

  const course = courses.find((c) => c.id === courseId);
  if (!course || !courseId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-2">Course not found</h1>
        <Link to="/courses" className="btn-primary mt-4">← Back to courses</Link>
      </div>
    );
  }

  const enrolled = isEnrolled(course.id);
  const lessonIndex = course.syllabus.findIndex((l) => l.title === lessonId);
  const lesson = lessonIndex >= 0 ? course.syllabus[lessonIndex] : undefined;

  if (!lesson || !lessonId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-2">Lesson not found</h1>
        <Link to={`/courses/${courseId}`} className="btn-primary mt-4">← Back to course</Link>
      </div>
    );
  }

  const isLocked = !lesson.free && !enrolled;
  const completedList = completedLessons[courseId!] || [];
  const isCompleted = completedList.includes(lesson.title) || completed;

  const handleComplete = () => {
    if (!completed) {
      toggleLessonComplete(courseId!, lesson.title);
      setCompleted(true);
      showToast('Lesson marked as complete! ✅', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link to={`/courses/${courseId}`} className="text-sm text-muted hover:text-green transition-colors mb-4 inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to course
      </Link>
      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Video panel */}
        <div>
          <div className="bg-dark rounded-xl overflow-hidden">
            <div className="relative aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-3">{course.emoji}</div>
                {isLocked ? (
                  <div className="text-white/60 text-sm">🔒 Enroll to unlock this lesson</div>
                ) : (
                  <button
                    onClick={() => setPlaying(!playing)}
                    className="w-16 h-16 rounded-full bg-green/90 hover:bg-green flex items-center justify-center transition-colors"
                  >
                    {playing ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-1" />}
                  </button>
                )}
              </div>
            </div>
            {/* Controls bar */}
            <div className="px-4 py-3 flex items-center gap-3 bg-dark-card">
              <button onClick={() => setPlaying(!playing)} className="text-white/80 hover:text-white">
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <div className="flex-1 h-1.5 bg-dark-border rounded-full overflow-hidden">
                <div className="h-full bg-green rounded-full" style={{ width: '0%' }} />
              </div>
              <span className="text-xs text-white/60 font-mono">00:00 / {lesson.duration}</span>
              <Volume2 className="w-4 h-4 text-white/60" />
              <Settings className="w-4 h-4 text-white/60" />
              <Maximize className="w-4 h-4 text-white/60" />
            </div>
          </div>

          {/* Below video */}
          <div className="mt-5">
            <h1 className="font-display font-bold text-lg text-text mb-4">{lesson.title}</h1>
            <div className="flex gap-3">
              <button
                onClick={handleComplete}
                disabled={isLocked}
                className={`btn-primary disabled:opacity-50 ${isCompleted ? 'opacity-60' : ''}`}
              >
                {isCompleted ? '✓ Completed' : 'Mark as Complete'}
              </button>
              <button
                onClick={() => showToast('Downloading notes PDF…', 'success')}
                className="btn-outline"
              >
                <Download className="w-4 h-4" /> Download Notes PDF
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-[120px] h-fit">
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2 mb-1">
                <ChBadge channel={course.channel} />
              </div>
              <h3 className="font-semibold text-text text-sm">{course.title}</h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
              {course.syllabus.map((l, i) => {
                const lCompleted = completedList.includes(l.title);
                const lLocked = !l.free && !enrolled;
                const isCurrent = l.title === lesson.title;
                return (
                  <button
                    key={i}
                    onClick={() => navigate(`/learn/${courseId!}/${l.title}`)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-border last:border-b-0 transition-colors ${
                      isCurrent ? 'bg-green-light' : 'hover:bg-bg'
                    }`}
                  >
                    <span className="text-sm shrink-0">
                      {lCompleted ? '✅' : lLocked ? '🔒' : isCurrent ? <span className="w-2 h-2 rounded-full bg-green animate-pulseDot inline-block" /> : <span className="text-muted">{i + 1}.</span>}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm truncate ${lCompleted ? 'text-muted' : 'text-text'}`}>{l.title}</div>
                      <div className="text-xs text-faint">{l.duration}</div>
                    </div>
                    {l.free && !enrolled && <span className="text-xs text-green font-semibold">Free</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
