import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { CoursesPage } from '@/pages/CoursesPage';
import { CourseDetailPage } from '@/pages/CourseDetailPage';
import { VideoPlayerPage } from '@/pages/VideoPlayerPage';
import { ArenaPage } from '@/pages/ArenaPage';
import { LivePage } from '@/pages/LivePage';
import { NotesPage } from '@/pages/NotesPage';
import { PlacementPage } from '@/pages/PlacementPage';
import { CertificatesPage } from '@/pages/CertificatesPage';
import { JobsPage } from '@/pages/JobsPage';
import { VideosPage } from '@/pages/VideosPage';
import { BlogPage } from '@/pages/BlogPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AdminPage } from '@/pages/AdminPage';
import { CartPage } from '@/pages/CartPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/learn/:courseId/:lessonId" element={<VideoPlayerPage />} />
            <Route path="/arena" element={<ArenaPage />} />
            <Route path="/live" element={<LivePage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/placement" element={<PlacementPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
