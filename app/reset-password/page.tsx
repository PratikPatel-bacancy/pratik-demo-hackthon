'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecoveryReady, setIsRecoveryReady] = useState(false);

  useEffect(() => {
    const initRecoverySession = async () => {
      setError(null);

      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hash);
      const hashError = hashParams.get('error_description') ?? hashParams.get('error');

      if (hashError) {
        setError(decodeURIComponent(hashError));
        setIsLoadingSession(false);
        setIsRecoveryReady(false);
        return;
      }

      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (sessionError) {
          setError('Invalid or expired reset link. Please request a new password reset email.');
          setIsRecoveryReady(false);
          setIsLoadingSession(false);
          return;
        }
      }

      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session) {
        setError('Invalid or expired reset token. Please request a new password reset email.');
        setIsRecoveryReady(false);
        setIsLoadingSession(false);
        return;
      }

      setIsRecoveryReady(true);
      setIsLoadingSession(false);
    };

    initRecoverySession();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and confirm password must match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password
      });

      if (updateError) {
        if (updateError.message.toLowerCase().includes('weak')) {
          setError('Weak password. Please choose a stronger password with at least 6 characters.');
        } else {
          setError(updateError.message);
        }

        return;
      }

      setSuccess('Password updated successfully. You can now log in with your new password.');
      setPassword('');
      setConfirmPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl sm:p-8">
        <h1 className="text-center text-2xl font-semibold text-white">Reset password</h1>
        <p className="mt-2 text-center text-sm text-slate-300">
          Enter your new password to complete account recovery.
        </p>

        {isLoadingSession ? (
          <p className="mt-6 rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-slate-200">
            Validating your reset link...
          </p>
        ) : null}

        {!isLoadingSession && isRecoveryReady ? (
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-slate-300" htmlFor="password">
                New password
              </label>
              <input
                autoComplete="new-password"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-violet-500"
                id="password"
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                type="password"
                value={password}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                autoComplete="new-password"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-violet-500"
                id="confirmPassword"
                minLength={6}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                required
                type="password"
                value={confirmPassword}
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
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Updating...' : 'Update password'}
            </button>
          </form>
        ) : null}

        {!isLoadingSession && !isRecoveryReady && error ? (
          <p className="mt-6 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex items-center justify-between gap-3 text-sm">
          <Link className="text-violet-300 hover:text-violet-200" href="/forgot-password">
            Request a new reset link
          </Link>
          <Link className="text-violet-300 hover:text-violet-200" href="/login">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
