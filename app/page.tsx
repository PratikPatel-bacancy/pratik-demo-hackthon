import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center p-6">
      <section className="w-full rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center shadow-2xl sm:p-14">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-violet-300">SaaS Starter</p>
        <h1 className="text-3xl font-semibold text-white sm:text-5xl">Build your product faster</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
          Next.js + Supabase authentication starter with polished UI components, built for modern SaaS products.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            className="rounded-lg bg-violet-600 px-5 py-2.5 font-medium text-white transition hover:bg-violet-500"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="rounded-lg border border-slate-700 px-5 py-2.5 font-medium text-slate-100 transition hover:bg-slate-800"
            href="/signup"
          >
            Signup
          </Link>
        </div>
      </section>
    </main>
  );
}
