'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { hasSupabaseEnv, supabase } from '@/lib/supabaseClient';

type AuthMode = 'login' | 'signup';

type AuthFormProps = {
  mode: AuthMode;
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      if (!supabase) return;

      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (isMounted && session) {
        router.replace('/dashboard');
      }
    };

    checkSession();

    if (!supabase) {
      return () => {
        isMounted = false;
      };
    }

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/dashboard');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const content = useMemo(
    () =>
      mode === 'login'
        ? {
            title: 'Welcome back',
            subtitle: 'Log in to continue to your dashboard.',
            button: 'Log in',
            alternateText: "Don\'t have an account?",
            alternateLink: '/signup',
            alternateLabel: 'Create one'
          }
        : {
            title: 'Create your account',
            subtitle: 'Start building your SaaS application today.',
            button: 'Create account',
            alternateText: 'Already have an account?',
            alternateLink: '/login',
            alternateLabel: 'Log in'
          },
    [mode]
  );

  const validate = () => {
    if (!email || !password) {
      return 'Email and password are required.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    if (mode === 'signup' && !confirmPassword) {
      return 'Please confirm your password.';
    }

    if (mode === 'signup' && password !== confirmPassword) {
      return 'Password and confirm password must match.';
    }

    return null;
  };


  const toFriendlyError = (message: string) => {
    const normalized = message.toLowerCase();

    if (normalized.includes('invalid api key') || normalized.includes('apikey')) {
      return 'Supabase API key is invalid. Verify NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local and restart npm run dev.';
    }

    if (normalized.includes('invalid login credentials')) {
      return 'Invalid email or password. Please try again.';
    }

    return message;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!supabase) {
      setError('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        const {
          data: { session },
          error: signUpError
        } = await supabase.auth.signUp({
          email,
          password
        });

        if (signUpError) {
          setError(toFriendlyError(signUpError.message));
          return;
        }

        if (!session) {
          setSuccess('Account created. Check your email to confirm your account before logging in.');
          return;
        }

        router.push('/dashboard');
        router.refresh();
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError(toFriendlyError(signInError.message));
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur sm:p-8">
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-white">{content.title}</h1>
        <p className="text-sm text-slate-300">{content.subtitle}</p>
      </div>

      {!hasSupabaseEnv ? (
        <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          Supabase config missing. Create a <code className="rounded bg-slate-800 px-1 py-0.5 text-xs">.env.local</code> with
          <code className="ml-1 rounded bg-slate-800 px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and
          <code className="ml-1 rounded bg-slate-800 px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
        </p>
      ) : null}

      <form className="space-y-4" onSubmit={onSubmit}>
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

        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="password">
            Password
          </label>
          <input
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
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

        {mode === 'signup' ? (
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
        ) : (
          <div className="text-right">
            <Link className="text-xs text-violet-300 hover:text-violet-200" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
        )}

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
          {isSubmitting ? 'Please wait...' : content.button}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-300">
        {content.alternateText}{' '}
        <Link className="text-violet-300 hover:text-violet-200" href={content.alternateLink}>
          {content.alternateLabel}
        </Link>
      </p>
    </div>
  );
}
