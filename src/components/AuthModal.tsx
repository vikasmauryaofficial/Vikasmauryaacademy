import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Spinner } from './ui';

export function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, login, signup, showToast } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState(authModalMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(authModalMode);
  }, [authModalMode]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!name.trim()) return setError('Please enter your name');
      if (password !== confirmPassword) return setError('Passwords do not match');
    }
    if (!email.trim()) return setError('Please enter your email');
    if (password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        showToast('Welcome back! 🎉', 'success');
      } else {
        await signup(name, email, password);
        showToast('Account created! 🚀', 'success');
      }
      closeAuthModal();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/55 animate-fadeIn"
      onClick={closeAuthModal}
    >
      <div
        className="bg-card rounded-xl p-9 w-full max-w-[420px] relative animate-fadeUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-faint hover:text-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-text mb-1">
          {mode === 'login' ? 'Welcome back 👋' : 'Join for free 🚀'}
        </h2>
        <p className="text-muted text-sm mb-6">
          {mode === 'login'
            ? 'Log in to continue your learning journey'
            : 'Create an account to start learning for free'}
        </p>

        {/* Tab toggle */}
        <div className="flex gap-2 mb-5 p-1 bg-bg rounded-lg">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
              mode === 'login' ? 'bg-green text-white' : 'text-muted hover:text-text'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
              mode === 'signup' ? 'bg-green text-white' : 'text-muted hover:text-text'
            }`}
          >
            Sign Up
          </button>
        </div>

        <button className="w-full border border-border rounded-lg py-2.5 text-sm font-medium text-text hover:bg-bg transition-colors flex items-center justify-center gap-2 mb-4">
          <span className="text-lg">🌐</span>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-faint">or with email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          {mode === 'signup' && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
            />
          )}
          {error && <p className="text-red text-[13px]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner size={16} color="#fff" /> Please wait…
              </span>
            ) : mode === 'login' ? (
              'Log In →'
            ) : (
              'Create Account →'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-green font-semibold hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
