import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-center shadow-2xl sm:p-8">
        <h1 className="text-xl font-semibold text-white">Reset password</h1>
        <p className="mt-3 text-sm text-slate-300">
          Update-password flow placeholder. Connect this page to Supabase update user APIs.
        </p>
        <Link className="mt-6 inline-block text-sm text-violet-300 hover:text-violet-200" href="/login">
          Back to login
        </Link>
      </div>
    </main>
  );
}
