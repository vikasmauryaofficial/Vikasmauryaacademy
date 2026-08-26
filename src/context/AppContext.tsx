import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  emoji: string;
  channel: 'VMA' | 'VCS';
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  authModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  enrolledCourses: string[];
  enroll: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  completedLessons: Record<string, string[]>;
  toggleLessonComplete: (courseId: string, lessonId: string) => void;
  solvedProblems: string[];
  toggleProblemSolved: (problemId: string) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

const ADMIN_EMAILS = ['admin@vma.edu', 'admin@gmail.com', 'vikasmauryaofficial@gmail.com'];

function deriveUserRole(email: string): 'admin' | 'student' {
  const lower = email.toLowerCase();
  if (ADMIN_EMAILS.includes(lower) || lower.includes('admin')) return 'admin';
  return 'student';
}

function deriveUserName(email: string, metadataName?: string): string {
  if (metadataName) return metadataName;
  return email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Record<string, string[]>>({});
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Load local state
    const savedEnrolled = localStorage.getItem('vm_enrolled');
    if (savedEnrolled) setEnrolledCourses(JSON.parse(savedEnrolled));
    const savedCart = localStorage.getItem('vm_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedSolved = localStorage.getItem('vm_solved');
    if (savedSolved) setSolvedProblems(JSON.parse(savedSolved));
    const savedCompleted = localStorage.getItem('vm_completed');
    if (savedCompleted) setCompletedLessons(JSON.parse(savedCompleted));

    // Restore Supabase session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const email = data.session.user.email || '';
        const name = deriveUserName(email, data.session.user.user_metadata?.name);
        setUser({
          id: data.session.user.id,
          name,
          email,
          role: deriveUserRole(email),
        });
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          const email = session.user.email || '';
          const name = deriveUserName(email, session.user.user_metadata?.name);
          setUser({
            id: session.user.id,
            name,
            email,
            role: deriveUserRole(email),
          });
        } else {
          setUser(null);
        }
      })();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw new Error(error.message);
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => setAuthModalOpen(false);

  const enroll = (courseId: string) => {
    setEnrolledCourses((prev) => {
      if (prev.includes(courseId)) return prev;
      const next = [...prev, courseId];
      localStorage.setItem('vm_enrolled', JSON.stringify(next));
      return next;
    });
  };

  const isEnrolled = (courseId: string) => enrolledCourses.includes(courseId);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      if (prev.some((c) => c.id === item.id)) return prev;
      const next = [...prev, item];
      localStorage.setItem('vm_cart', JSON.stringify(next));
      return next;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const next = prev.filter((c) => c.id !== id);
      localStorage.setItem('vm_cart', JSON.stringify(next));
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('vm_cart');
  };

  const toggleLessonComplete = (courseId: string, lessonId: string) => {
    setCompletedLessons((prev) => {
      const lessons = prev[courseId] || [];
      const next = lessons.includes(lessonId)
        ? lessons.filter((l) => l !== lessonId)
        : [...lessons, lessonId];
      const updated = { ...prev, [courseId]: next };
      localStorage.setItem('vm_completed', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleProblemSolved = (problemId: string) => {
    setSolvedProblems((prev) => {
      const next = prev.includes(problemId) ? prev.filter((p) => p !== problemId) : [...prev, problemId];
      localStorage.setItem('vm_solved', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        enrolledCourses,
        enroll,
        isEnrolled,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        completedLessons,
        toggleLessonComplete,
        solvedProblems,
        toggleProblemSolved,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
