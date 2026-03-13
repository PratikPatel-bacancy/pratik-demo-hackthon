'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { UserCard } from '@/components/UserCard';

type DashboardUser = {
  id: string;
  profile_image?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
      setUsersLoading(true);
      setUsersError(null);

      const { data, error } = await supabase
        .from('users_list')
        .select('id, profile_image, name, email, phone, address')
        .limit(15);

      if (!mounted) return;

      if (error) {
        setUsersError(error.message);
        setUsers([]);
      } else {
        setUsers((data as DashboardUser[]) ?? []);
      }

      setUsersLoading(false);
    };

    const fetchSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/login');
        setLoading(false);
        return;
      }

      if (mounted) {
        setEmail(session.user.email ?? '');
        setLoading(false);
      }

      fetchUsers();
    };

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login');
      } else if (mounted) {
        setEmail(session.user.email ?? '');
        fetchUsers();
      }
    });

    fetchSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-6 sm:p-10">
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

        <section className="mt-8 space-y-4">
          <header className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-white">Team snapshots</h2>
            <p className="text-sm text-slate-400">
              Showing up to 15 profiles from the <code className="rounded bg-slate-900 px-1 text-xs font-mono text-slate-300">users_list</code>{' '}
              table.
            </p>
          </header>

          {usersLoading ? (
            <div className="rounded-lg border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-300">
              Fetching profile cards…
            </div>
          ) : usersError ? (
            <div className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              Unable to load users: {usersError}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
