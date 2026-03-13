'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { hasSupabaseEnv, supabase } from '@/lib/supabaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError('Email is required.');
      return;
    }

    if (!supabase) {
      setError('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.');
      return;
    }

    setIsSubmitting(true);

    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess('Password reset email sent. Please check your inbox.');
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl sm:p-8">
        <h1 className="text-center text-2xl font-semibold text-white">Forgot password</h1>
        <p className="mt-2 text-center text-sm text-slate-300">
          Enter your email and we&apos;ll send you a password reset link.
        </p>

        {!hasSupabaseEnv ? (
          <p className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
            Supabase config missing. Add valid keys in <code className="rounded bg-slate-800 px-1 py-0.5 text-xs">.env.local</code>.
          </p>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="email">
              Email
            </label>
            <input
              autoComplete="email"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-violet-500"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          {success ? (
            <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {success}
            </p>
          ) : null}

          <button
            className="inline-flex w-full items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting || !hasSupabaseEnv}
            type="submit"
          >
            {isSubmitting ? 'Sending...' : 'Send reset email'}
          </button>
        </form>

        <Link className="mt-5 inline-block text-sm text-violet-300 hover:text-violet-200" href="/login">
          Back to login
        </Link>
      </div>
    </main>
  );
}
