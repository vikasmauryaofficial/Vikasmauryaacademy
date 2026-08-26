import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function LiveTicker() {
  const [watching, setWatching] = useState(238);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setWatching((prev) => Math.max(200, prev + Math.floor(Math.random() * 11) - 5));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <>
      <div className="bg-green-dark text-white text-sm py-1.5 px-4 flex items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-red animate-pulseDot shrink-0" />
          <span className="truncate">
            Live now: <span className="font-semibold">Accenture Placement Prep — Mock Interview Round</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <span className="bg-white/15 rounded-full px-2.5 py-0.5 text-xs font-medium">
            {watching} watching
          </span>
          <Link
            to="/live"
            className="bg-white text-green-dark text-xs font-semibold px-3 py-1 rounded-md hover:bg-green-light transition-colors"
          >
            Join Live →
          </Link>
        </div>
      </div>
      <Link
        to="/live"
        className="md:hidden fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-red text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
      >
        <span className="w-3 h-3 rounded-full bg-white animate-pulseDot" />
      </Link>
    </>
  );
}
