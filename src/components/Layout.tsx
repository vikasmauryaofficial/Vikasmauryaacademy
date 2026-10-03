import { Outlet } from 'react-router-dom';
import { LiveTicker } from './LiveTicker';
import { Navbar } from './Navbar';
import { AuthModal } from './AuthModal';
import { ToastContainer } from './Toast';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <LiveTicker />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
      <ToastContainer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-dark text-white/80 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-green flex items-center justify-center text-lg">🎓</div>
            <div>
              <div className="font-display font-extrabold text-white text-[15px]">Vikas Maurya</div>
              <div className="text-[10px] text-white/50">Academy & Coding School</div>
            </div>
          </div>
          <p className="text-sm text-white/60 max-w-xs mb-4">
            Learn, practice, and get placed with India's most comprehensive ed-tech platform.
          </p>
          <div className="flex gap-2">
            <a
              href="https://www.youtube.com/@VikasMauryaAcademy"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center hover:border-red hover:text-red transition-colors"
              title="Vikas Maurya Academy on YouTube"
            >
              📺
            </a>
            <a
              href="https://www.youtube.com/@VikasCodingSchool"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center hover:border-blue hover:text-blue transition-colors"
              title="Vikas Coding School on YouTube"
            >
              💻
            </a>
            <a
              href="https://anatomy-class.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center hover:border-green hover:text-green transition-colors"
              title="Anatomy Class"
            >
              🫀
            </a>
            <a
              href="https://algorithmclass.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center hover:border-amber hover:text-amber transition-colors"
              title="Algorithm Class"
            >
              🧮
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm mb-3">Platform</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="/courses" className="hover:text-green transition-colors">Courses</a></li>
            <li><a href="/arena" className="hover:text-green transition-colors">Code Arena</a></li>
            <li><a href="/live" className="hover:text-green transition-colors">Live Classes</a></li>
            <li><a href="/notes" className="hover:text-green transition-colors">PDF Notes</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="/placement" className="hover:text-green transition-colors">Placement Prep</a></li>
            <li><a href="/jobs" className="hover:text-green transition-colors">Jobs Board</a></li>
            <li><a href="/blog" className="hover:text-green transition-colors">Tech Blog</a></li>
            <li><a href="/certificates" className="hover:text-green transition-colors">Certificates</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm mb-3">Connect</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>
              <a href="https://www.youtube.com/@VikasMauryaAcademy" target="_blank" rel="noopener noreferrer" className="hover:text-red transition-colors flex items-center gap-1.5">
                📺 VMA YouTube
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@VikasCodingSchool" target="_blank" rel="noopener noreferrer" className="hover:text-red transition-colors flex items-center gap-1.5">
                💻 VCS YouTube
              </a>
            </li>
            <li>
              <a href="https://anatomy-class.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-green transition-colors flex items-center gap-1.5">
                🫀 Anatomy Class
              </a>
            </li>
            <li>
              <a href="https://algorithmclass.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-green transition-colors flex items-center gap-1.5">
                🧮 Algorithm Class
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-dark-border py-5 text-center text-sm text-white/40">
        © 2026 Vikas Maurya Academy & Coding School. All rights reserved.
      </div>
    </footer>
  );
}
