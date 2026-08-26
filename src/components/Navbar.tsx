import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { navDropdowns } from '@/data/mockData';

const navItems = [
  { icon: '📚', label: 'Courses', to: '/courses', key: 'Courses' },
  { icon: '🔴', label: 'Live Classes', to: '/live', key: 'Live' },
  { icon: '💻', label: 'Code Arena', to: '/arena', key: 'Arena' },
  { icon: '📄', label: 'Notes', to: '/notes', key: 'Notes' },
  { icon: '🏢', label: 'Placement', to: '/placement', key: 'Placement' },
  { icon: '🏆', label: 'Certificates', to: '/certificates', key: 'Certificates' },
  { icon: '💼', label: 'Jobs', to: '/jobs', key: 'Jobs' },
  { icon: '🎬', label: 'Videos', to: '/videos', key: 'Videos' },
  { icon: '✍️', label: 'Tech Blog', to: '/blog', key: 'Blog' },
  { icon: '⊕', label: 'More', to: '#', key: 'More' },
];

export function Navbar() {
  const { user, logout, cart, openAuthModal } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setMobileOpen(false);
    }
  };

  const handleNavHover = (key: string) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHoveredNav(key);
  };

  const handleNavLeave = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setHoveredNav(null), 160);
  };

  const initials = user?.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '';

  return (
    <nav className="sticky top-0 z-40 bg-card/90 backdrop-blur-[14px] border-b border-border">
      {/* Top row */}
      <div className="h-[58px] px-4 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-green flex items-center justify-center text-lg">
            🎓
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-extrabold text-[15px] leading-tight text-text">
              Vikas Maurya
            </div>
            <div className="text-[10px] text-faint leading-tight">Academy & Coding School</div>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, topics, problems…"
              className="w-full rounded-lg bg-bg border border-border pl-10 pr-4 py-2 text-sm outline-none focus:border-green focus:bg-card transition-colors"
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {user?.role === 'admin' && (
            <Link to="/admin" className="badge-purple hidden sm:inline-flex">Admin</Link>
          )}
          <Link to="/cart" className="relative p-2 hover:bg-bg rounded-lg transition-colors">
            <ShoppingCart className="w-5 h-5 text-text" />
            {cart.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green text-white text-xs font-bold flex items-center justify-center">
                  {initials}
                </div>
                <span className="text-sm font-medium text-text hidden sm:block">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={logout}
                className="btn-outline text-xs px-3 py-1.5 hidden sm:inline-flex"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="btn-outline text-xs px-3 py-1.5 hidden sm:inline-flex"
              >
                Login
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="btn-primary text-xs px-3 py-1.5"
              >
                Start Free →
              </button>
            </div>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 hover:bg-bg rounded-lg"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Bottom row - desktop nav */}
      <div className="hidden lg:flex h-[42px] border-t border-border px-4 items-center">
        {navItems.map((item) => (
          <div
            key={item.key}
            className="relative"
            onMouseEnter={() => handleNavHover(item.key)}
            onMouseLeave={handleNavLeave}
          >
            <Link
              to={item.to}
              className={`flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium transition-colors rounded-md ${
                location.pathname === item.to
                  ? 'text-green'
                  : 'text-muted hover:text-text'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </Link>
            {hoveredNav === item.key && navDropdowns[item.key] && (
              <div
                className="absolute top-full left-0 pt-1"
                onMouseEnter={() => handleNavHover(item.key)}
                onMouseLeave={handleNavLeave}
              >
                <div className="bg-card border border-border rounded-lg shadow-lg p-2 min-w-[200px]">
                  {navDropdowns[item.key].map((dropdownItem, idx) => {
                    const isExternal = dropdownItem.to?.startsWith('http');
                    return isExternal ? (
                      <a
                        key={idx}
                        href={dropdownItem.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-bg transition-colors text-sm text-text"
                      >
                        <span className="w-7 h-7 rounded-md bg-bg flex items-center justify-center text-sm">
                          {dropdownItem.emoji}
                        </span>
                        {dropdownItem.label}
                      </a>
                    ) : (
                      <Link
                        key={idx}
                        to={dropdownItem.to || '#'}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-bg transition-colors text-sm text-text"
                      >
                        <span className="w-7 h-7 rounded-md bg-bg flex items-center justify-center text-sm">
                          {dropdownItem.emoji}
                        </span>
                        {dropdownItem.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card px-4 py-3 max-h-[70vh] overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isExternal = item.to.startsWith('http');
              return isExternal ? (
                <a
                  key={item.key}
                  href={item.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-bg text-sm text-text"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.key}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-bg text-sm text-text"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
          {user && (
            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              className="btn-outline w-full mt-3"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
