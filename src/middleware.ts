'use server'
import 'server-only'

import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/_lib/session';

// Explicitly set the runtime for middleware to Edge
export const runtime = 'experimental-edge'; // Separate the runtime key



export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  

  // Decrypt the session from the cookie
  const cookie = req.cookies.get('session')?.value;  
  const session = cookie && await decrypt(cookie);

  // If a session exists and the path is login, redirect to the dashboard
  if (session && path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl), { status: 303 });
  }

  // Check if the session does not exist and it's the login path
  if (!session && path.startsWith('/login')) {
    return NextResponse.next();
  }

  // Redirect to login if session is not present
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 303 });
  }

  // Handle unauthenticated users
  if (session.isAuth === false) {
    return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 303 });
  }

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/login',], // Routes that require authorization
};
