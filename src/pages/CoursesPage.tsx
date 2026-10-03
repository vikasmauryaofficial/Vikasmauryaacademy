import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCourses, type DBCourse } from '@/lib/supabase';
import { CourseCard, CourseCardSkeleton } from '@/components/CourseCard';
import { EmptyState } from '@/components/ui';

export function CoursesPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [priceFilter, setPriceFilter] = useState('All');
  const [sort, setSort] = useState('popular');
  const [displayCourses, setDisplayCourses] = useState<DBCourse[]>([]);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    fetchCourses()
      .then(setDisplayCourses)
      .catch((e) => console.error('Failed to load courses:', e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = displayCourses.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))) return false;
    if (priceFilter === 'Free' && c.price !== 0) return false;
    if (priceFilter === 'Paid' && c.price === 0) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'price-low') return a.price - b.price;
    if (sort === 'price-high') return b.price - a.price;
    return b.students - a.students;
  });

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16 px-4" style={{ background: 'linear-gradient(135deg, #1D9E75 0%, #185FA5 100%)' }}>
        <h1 className="font-display font-extrabold text-white mb-3" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>
          All Courses
        </h1>
        <p className="text-white/80 text-lg">
          {displayCourses.length} courses · {displayCourses.filter((c) => c.price === 0).length} free
        </p>
      </section>

      {/* Filter bar */}
      <div className="max-w-[780px] mx-auto px-4 -mt-8 relative z-10">
        <div className="flex gap-3 flex-wrap items-center bg-card border border-border rounded-xl p-3 shadow-soft">
          <input
            type="text"
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1 min-w-[200px]"
          />
          <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="input w-auto min-w-[120px]">
            <option value="All">All Prices</option>
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-auto min-w-[150px]">
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-sm text-muted mb-6">
          Showing {sorted.length} course{sorted.length !== 1 ? 's' : ''}
        </p>
        {loading ? (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No courses found"
            subtitle="Try adjusting your filters or search query"
            action={<button onClick={() => { setSearch(''); setPriceFilter('All'); }} className="btn-primary">Clear filters</button>}
          />
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {sorted.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        )}
      </div>
    </div>
  );
}
