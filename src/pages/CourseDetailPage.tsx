import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchCourses, type DBCourse } from '@/lib/supabase';
import { ChBadge, Stars } from '@/components/ui';
import { useApp } from '@/context/AppContext';

export function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isEnrolled, enroll, addToCart, showToast, openAuthModal, user } = useApp();
  const [tab, setTab] = useState<'overview' | 'syllabus' | 'reviews'>('overview');
  const [course, setCourse] = useState<DBCourse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses()
      .then((courses) => {
        const found = courses.find((c) => c.id === id);
        setCourse(found || null);
      })
      .catch((e) => console.error('Failed to load course:', e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-muted">Loading course…</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-2">Course not found</h1>
        <Link to="/courses" className="btn-primary mt-4">← Back to courses</Link>
      </div>
    );
  }

  const enrolled = isEnrolled(course.id);

  const handleAction = () => {
    if (!user && course.price > 0) {
      openAuthModal('login');
      return;
    }
    if (enrolled) {
      navigate(`/learn/${course.id}/${course.syllabus[0]?.title}`);
      return;
    }
    if (course.price === 0) {
      enroll(course.id);
      showToast(`Enrolled in "${course.title}"! 🎉`, 'success');
    } else {
      addToCart({ id: course.id, title: course.title, price: course.price, emoji: course.emoji, channel: course.channel });
      showToast('Added to cart! 🛒', 'success');
    }
  };

  const channelColors: Record<string, string> = { VMA: 'bg-green-light', VCS: 'bg-blue-light' };

  return (
    <div className="bg-card">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Left */}
          <div>
            <Link to="/courses" className="text-sm text-muted hover:text-green transition-colors mb-4 inline-block">
              ← Back to courses
            </Link>
            <div className="flex items-center gap-2 mb-3">
              <ChBadge channel={course.channel} />
              {course.badge && <span className="badge-amber">{course.badge}</span>}
            </div>
            <h1 className="font-display font-extrabold text-text mb-3" style={{ fontSize: '30px' }}>{course.title}</h1>
            <p className="text-muted text-[15px] mb-4" style={{ lineHeight: 1.7 }}>{course.description}</p>
            <div className="flex items-center gap-4 mb-4">
              <Stars rating={course.rating} reviews={course.reviews} />
              <span className="text-sm text-muted">
                {course.students.toLocaleString()} students · {course.lessons} lessons · {course.hours}h
              </span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-full bg-green text-white font-bold flex items-center justify-center">
                VM
              </div>
              <div>
                <div className="font-semibold text-text text-sm">Vikas Maurya</div>
                <div className="text-xs text-muted">{course.channel === 'VMA' ? 'Vikas Maurya Academy' : 'Vikas Coding School'}</div>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex gap-1 border-b border-border">
              {(['overview', 'syllabus', 'reviews'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2.5 text-sm font-semibold capitalize border-b-2 transition-colors ${
                    tab === t ? 'border-green text-green' : 'border-transparent text-muted hover:text-text'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="py-6">
              {tab === 'overview' && (
                <div>
                  <h3 className="font-bold text-text mb-4">What you'll learn</h3>
                  <div className="grid sm:grid-cols-2 gap-3 mb-8">
                    {course.what_you_wll_learn.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-green mt-0.5">✓</span>
                        <span className="text-sm text-muted">{item}</span>
                      </div>
                    ))}
                  </div>
                  <h3 className="font-bold text-text mb-3">About this course</h3>
                  <p className="text-muted text-sm" style={{ lineHeight: 1.7 }}>{course.about}</p>
                </div>
              )}
              {tab === 'syllabus' && (
                <div>
                  <h3 className="font-bold text-text mb-2">Course content</h3>
                  <p className="text-sm text-muted mb-4">{course.syllabus.length} lessons</p>
                  <div className="border border-border rounded-lg overflow-hidden">
                    {course.syllabus.map((lesson, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-border' : ''} hover:bg-bg transition-colors`}
                      >
                        <span className="text-sm">{lesson.free ? '▶️' : '🔒'}</span>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-text">{lesson.title}</span>
                          {lesson.free && !enrolled && (
                            <span className="ml-2 text-xs text-green font-semibold">Free preview</span>
                          )}
                        </div>
                        <span className="text-xs text-faint">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab === 'reviews' && (
                <div>
                  <div className="flex items-center gap-6 mb-6 p-5 border border-border rounded-lg">
                    <div className="text-center">
                      <div className="text-4xl font-extrabold text-text">{course.rating}</div>
                      <div className="text-[#F59E0B] text-sm mt-1">{'★'.repeat(Math.round(course.rating))}</div>
                      <div className="text-xs text-muted mt-1">Course rating</div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs text-muted w-3">{star}</span>
                          <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden">
                            <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${star === 5 ? 82 : star === 4 ? 14 : star === 3 ? 3 : 1}%` }} />
                          </div>
                          <span className="text-xs text-muted w-10">{star === 5 ? 730 : star === 4 ? 125 : star === 3 ? 28 : 7}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {[
                    { name: 'Rahul Verma', rating: 5, text: 'One of the best courses I have taken. The explanations are crystal clear and the practice problems are excellent.' },
                    { name: 'Sneha Patel', rating: 5, text: 'Highly recommend this course. Vikas sir explains every concept with real-world examples. Worth every rupee.' },
                    { name: 'Amit Kumar', rating: 4, text: 'Great course overall. Would love to see more advanced topics covered in future updates.' },
                  ].map((review, i) => (
                    <div key={i} className="border-t border-border py-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-green text-white text-xs font-bold flex items-center justify-center">
                          {review.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-text">{review.name}</div>
                          <div className="text-[#F59E0B] text-xs">{'★'.repeat(review.rating)}</div>
                        </div>
                      </div>
                      <p className="text-muted text-sm">{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — sticky sidebar */}
          <div className="lg:sticky lg:top-[120px] h-fit">
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <div className={`h-[140px] ${channelColors[course.channel]} flex items-center justify-center text-5xl`}>
                {course.emoji}
              </div>
              <div className="p-5">
                <div className="font-display font-extrabold text-text mb-1" style={{ fontSize: '30px' }}>
                  {course.price === 0 ? 'Free' : `₹${course.price.toLocaleString()}`}
                </div>
                {course.price > 0 && <p className="text-xs text-muted mb-4">One-time · Lifetime access</p>}
                <button
                  onClick={handleAction}
                  className="btn-primary w-full mb-3"
                >
                  {enrolled ? 'Continue Learning →' : course.price === 0 ? 'Enroll Free →' : 'Add to Cart →'}
                </button>
                {course.price > 0 && !enrolled && (
                  <button onClick={() => showToast('Redirecting to Razorpay…', 'success')} className="btn-outline w-full mb-4">
                    Buy with Razorpay
                  </button>
                )}
                <div className="space-y-2.5 pt-4 border-t border-border">
                  {[
                    `📺 ${course.lessons} video lessons`,
                    `⏱️ ${course.hours}h total`,
                    '📄 PDF notes included',
                    '🏆 Certificate on completion',
                    '📱 Mobile access',
                  ].map((feature) => (
                    <div key={feature} className="text-sm text-muted flex items-center gap-2">
                      <span className="text-green">✓</span> {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
