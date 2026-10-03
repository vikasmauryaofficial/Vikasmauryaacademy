import { Link } from 'react-router-dom';
import type { DBCourse } from '@/lib/supabase';
import { ChBadge, Stars, Skeleton } from './ui';
import { useApp } from '@/context/AppContext';

export function CourseCard({ course }: { course: DBCourse }) {
  const { isEnrolled, addToCart, enroll, showToast, openAuthModal, user } = useApp();
  const enrolled = isEnrolled(course.id);

  const handleAction = () => {
    if (!user && course.price > 0) {
      openAuthModal('login');
      return;
    }
    if (enrolled) return;
    if (course.price === 0) {
      enroll(course.id);
      showToast(`Enrolled in "${course.title}"! 🎉`, 'success');
    } else {
      addToCart({
        id: course.id,
        title: course.title,
        price: course.price,
        emoji: course.emoji,
        channel: course.channel,
      });
      showToast('Added to cart! 🛒', 'success');
    }
  };

  const channelColors: Record<string, string> = {
    VMA: 'bg-green-light',
    VCS: 'bg-blue-light',
  };

  return (
    <Link to={`/courses/${course.id}`} className="block">
      <div className="card-hover h-full flex flex-col">
        <div
          className={`relative h-[120px] rounded-md flex items-center justify-center text-5xl mb-4 ${channelColors[course.channel]}`}
        >
          <span>{course.emoji}</span>
          {course.badge && (
            <span className="absolute top-2 right-2 badge-amber">{course.badge}</span>
          )}
          {enrolled && (
            <span className="absolute top-2 left-2 badge-green">✓ Enrolled</span>
          )}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <ChBadge channel={course.channel} />
          <span className="text-xs text-muted">{course.tags[0]}</span>
        </div>
        <h3 className="text-[14.5px] font-semibold text-text mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-xs text-muted mb-2">
          {course.lessons} lessons · {course.hours}h · {course.students.toLocaleString()} students
        </p>
        <Stars rating={course.rating} reviews={course.reviews} />
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-extrabold text-text">
            {course.price === 0 ? 'Free' : `₹${course.price.toLocaleString()}`}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAction();
            }}
            className={
              enrolled
                ? 'btn-outline text-xs px-3 py-1.5'
                : course.price === 0
                  ? 'btn-primary text-xs px-3 py-1.5'
                  : 'btn-outline text-xs px-3 py-1.5'
            }
          >
            {enrolled ? 'Continue →' : course.price === 0 ? 'Enroll Free' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="card h-full flex flex-col">
      <Skeleton className="h-[120px] mb-4" />
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-32 mb-2" />
      <Skeleton className="h-4 w-24 mb-3" />
      <div className="flex justify-between mt-auto">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}
