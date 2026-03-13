'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/login');
        setLoading(false);
        return;
      }

      setEmail(session.user.email ?? '');
      setLoading(false);
    };

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login');
      } else {
        setEmail(session.user.email ?? '');
      }
    });

    getSession();

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
    setLoggingOut(false);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-xl border border-white/10 bg-slate-900/70 px-6 py-4 text-sm text-slate-200">
          Loading your dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 p-6 sm:p-10">
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur sm:p-8">
        <nav className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Dashboard</p>
            <p className="text-sm text-slate-300">Signed in as {email}</p>
          </div>
          <button
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loggingOut}
            onClick={handleLogout}
            type="button"
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </nav>

        <section className="mt-6 space-y-4 text-sm text-slate-300">
          <p>Welcome back! Your Supabase session is active until you log out.</p>
          <p>Use the navigation drawer to explore the secure areas of the app.</p>
        </section>
      </div>
    </main>
  );
}
