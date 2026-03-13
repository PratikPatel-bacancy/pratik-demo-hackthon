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
        return;
      }

      setEmail(session.user.email ?? '');
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login');
      } else {
        setEmail(session.user.email ?? '');
      }
    });

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
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col p-6 sm:p-10">
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-300">Signed in as {email}</p>
          </div>
          <button
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loggingOut}
            onClick={handleLogout}
            type="button"
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </main>
  );
export default function DashboardPage() {
  return <main className="p-6">Dashboard page</main>;
}
