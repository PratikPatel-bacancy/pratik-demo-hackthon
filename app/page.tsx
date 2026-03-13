import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-8 p-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">SaaS Starter</h1>
      <p className="max-w-xl text-slate-300">
        Starter template with Next.js App Router, TypeScript, Tailwind CSS, and Supabase.
      </p>
      <div className="flex gap-4">
        <Link
          className="rounded-md bg-emerald-500 px-4 py-2 font-medium text-slate-950 hover:bg-emerald-400"
          href="/login"
        >
          Login
        </Link>
        <Link
          className="rounded-md border border-slate-700 px-4 py-2 font-medium hover:bg-slate-900"
          href="/signup"
        >
          Signup
        </Link>
      </div>
    </main>
  );
}
