import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*']
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}
