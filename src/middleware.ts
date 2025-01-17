import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/_lib/session';
import { pageAccessRules } from '@/app/_lib/pageAccessRules';

// Explicitly set the runtime for middleware to Edge
export const runtime = 'experimental-edge'; // This is fine for middleware, no additional directive is needed.

/**
 * Middleware for handling authentication and authorization.
 */
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Decrypt session
  const cookie = req.cookies.get('session')?.value;
  const session = cookie && (await decrypt(cookie));
  

  // Handle login redirection for authenticated users
  if (session && path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl), { status: 303 });
  }

  // Allow unauthenticated access to `/login`
  if (!session && path.startsWith('/login')) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to `/login`
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 303 });
  }

  if (session?.exp && Date.now() > session.exp * 1000) {
    console.log('Session expired.');
    // Optionally clear the session cookie
    const response = NextResponse.redirect(new URL('/login', req.nextUrl), { status: 303 });
    response.cookies.set('session', '', { maxAge: -1, path: '/' });
    return response;
  } else {
    
  }

  // Find matching rule
  const rules = findMatchingRule(path, pageAccessRules);
  if (rules) {

    if (!session) {
      return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 303 });
    }

    try {
      const { isAdmin, stripeSubscriptionId, userId, tenantId } = session;

      if (!userId || !tenantId) {
        return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 303 });
      }

      if (rules.requiresAdmin && !isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl), { status: 303 });
      }

      if (rules.requiresSubscription && !stripeSubscriptionId) {
        return NextResponse.redirect(new URL('/settings/account', req.nextUrl), { status: 303 });
      }
    } catch (error) {
      console.log(error);
      return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 303 });
    }
  }

  return NextResponse.next();
}

// Find matching rule for a given path
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findMatchingRule(path: string, rules: Record<string, any>): any {
  // Check for an exact match
  if (rules[path]) {
    return rules[path];
  }

  // Check dynamic and wildcard patterns
  for (const rulePath in rules) {
    const isDynamic = rulePath.includes('[') && rulePath.includes(']');
    const isWildcard = rulePath.includes(':path');

    let regex: RegExp;

    if (isDynamic) {
      // Convert dynamic route pattern (e.g., "/dashboard/agents/[agentId]") to regex
      regex = new RegExp(`^${rulePath.replace(/\[.*?\]/g, '[^/]+')}$`);
    } else if (isWildcard) {
      // Convert wildcard route pattern (e.g., "/dashboard/calls/:path*") to regex
      regex = new RegExp(`^${rulePath.replace(/:path\*?/g, '.*')}$`);
    } else {
      continue; // Skip if it's neither dynamic nor wildcard
    }

    if (regex.test(path)) {
      return rules[rulePath];
    }
  }

  return null; // No matching rule found
}

// Middleware config to apply only to specific routes
export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/login'],
};
