import { useState } from 'react';
import { certificates as mockCerts } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { EmptyState, SectionHead } from '@/components/ui';

export function CertificatesPage() {
  const { user, showToast, openAuthModal } = useApp();
  const [code, setCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; course?: string; name?: string } | null>(null);

  const handleVerify = () => {
    if (!code.trim()) return;
    const cert = mockCerts.find((c) => c.code === code.trim().toUpperCase());
    if (cert) {
      setVerifyResult({ valid: true, course: cert.course, name: 'Vikas Maurya' });
    } else {
      setVerifyResult({ valid: false });
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16 px-4" style={{ background: 'linear-gradient(135deg, #EEEDF8 0%, #F5F0FF 100%)' }}>
        <h1 className="font-display font-extrabold text-text" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>Certificates</h1>
        <p className="text-muted text-lg mt-2">Earn and verify course completion certificates</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-[1.5fr_1fr] gap-8">
        {/* My Certificates */}
        <div>
          <SectionHead title="My Certificates" />
          {!user ? (
            <EmptyState
              icon="🔒"
              title="Log in to see your certificates"
              subtitle="Complete courses to earn certificates"
              action={<button onClick={() => openAuthModal('login')} className="btn-primary">Log In →</button>}
            />
          ) : mockCerts.length === 0 ? (
            <EmptyState
              icon="🏆"
              title="No certificates yet"
              subtitle="Complete a course to earn your first certificate"
              action={<button onClick={() => showToast('Browse courses to get started!', 'success')} className="btn-primary">Browse Courses →</button>}
            />
          ) : (
            <div className="space-y-4">
              {mockCerts.map((cert) => (
                <div key={cert.id} className="card-hover flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-purple-light flex items-center justify-center text-2xl shrink-0">
                    {cert.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text text-sm mb-1">{cert.course}</h3>
                    <p className="text-xs text-muted mb-1">Issued: {cert.date}</p>
                    <p className="text-xs font-mono text-faint">{cert.code}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => showToast('Opening certificate…', 'success')} className="btn-purple text-xs px-3 py-1.5">View</button>
                    <button onClick={() => showToast('Downloading certificate…', 'success')} className="btn-outline text-xs px-3 py-1.5 border-purple text-purple hover:bg-purple-light">⬇️ Download</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verify section */}
        <div>
          <SectionHead title="Verify a Certificate" />
          <div className="card">
            <p className="text-muted text-sm mb-4" style={{ lineHeight: 1.7 }}>
              Enter a certificate code below to verify its authenticity. Each certificate has a unique code printed on it.
            </p>
            <input
              type="text"
              placeholder="e.g. VMA-DSA-2026-8F3A2B"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="input mb-3 font-mono"
            />
            <button onClick={handleVerify} className="btn-primary w-full">Verify Certificate</button>
            {verifyResult && (
              <div className={`mt-4 p-4 rounded-lg ${verifyResult.valid ? 'bg-green-light' : 'bg-red-light'}`}>
                {verifyResult.valid ? (
                  <div>
                    <p className="text-green-dark font-semibold text-sm mb-1">✅ Valid certificate</p>
                    <p className="text-xs text-muted">Course: {verifyResult.course}</p>
                    <p className="text-xs text-muted">Issued to: {verifyResult.name}</p>
                  </div>
                ) : (
                  <p className="text-red font-semibold text-sm">❌ Certificate not found. Please check the code and try again.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
