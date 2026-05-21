import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const session = await auth.api.getSession({
    headers: { cookie: request.headers.get('cookie') ?? '' },
  })

  if (pathname === '/') {
    return NextResponse.redirect(new URL(session ? '/notes' : '/login', request.url))
  }

  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/notes', request.url))
  }

  if (!session && pathname.startsWith('/notes')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/', '/notes/:path*', '/login', '/register'],
}
