import type { Channel, Difficulty } from '@/data/mockData';

export function ChBadge({ channel }: { channel: Channel }) {
  return channel === 'VMA' ? (
    <span className="badge-green">📚 VMA</span>
  ) : (
    <span className="badge-blue">💻 VCS</span>
  );
}

export function DiffBadge({ difficulty }: { difficulty: Difficulty }) {
  if (difficulty === 'Easy') return <span className="badge-green">Easy</span>;
  if (difficulty === 'Medium') return <span className="badge-amber">Medium</span>;
  return <span className="badge-red">Hard</span>;
}

export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[#F59E0B] text-sm">{'★'.repeat(Math.round(rating))}</span>
      <span className="text-[#F59E0B] text-sm">{'☆'.repeat(5 - Math.round(rating))}</span>
      <span className="text-sm font-semibold text-text ml-1">{rating}</span>
      {reviews !== undefined && <span className="text-xs text-muted">({reviews})</span>}
    </div>
  );
}

export function SectionHead({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        <h2 className="text-2xl font-bold text-text">{title}</h2>
        {subtitle && <p className="text-muted text-sm mt-1">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={`skeleton ${className || ''}`} />;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-text mb-2">{title}</h3>
      {subtitle && <p className="text-muted text-sm mb-6 max-w-sm">{subtitle}</p>}
      {action}
    </div>
  );
}

export function Spinner({ size = 20, color = '#1D9E75' }: { size?: number; color?: string }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-transparent"
      style={{
        width: size,
        height: size,
        borderTopColor: color,
        borderRightColor: color,
      }}
    />
  );
}
