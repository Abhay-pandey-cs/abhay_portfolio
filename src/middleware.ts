import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { getJwtSecret } from '@/lib/authConfig';

const publicApiMethods: Record<string, string[]> = {
  '/api/achievements': ['GET'],
  '/api/certifications': ['GET'],
  '/api/chat': ['POST'],
  '/api/community': ['GET'],
  '/api/education': ['GET'],
  '/api/experience': ['GET'],
  '/api/learning': ['GET'],
  '/api/notes': ['GET'],
  '/api/projects': ['GET'],
  '/api/settings': ['GET'],
  '/api/skills': ['GET'],
  '/api/stats/coding': ['GET'],
};

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
  }
  
  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  
  record.count++;
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime };
}

async function verifyAuth(request: NextRequest): Promise<{ authenticated: boolean; user?: any }> {
  const token = request.cookies.get('admin_token')?.value;
  
  if (!token) {
    return { authenticated: false };
  }
  
  const jwtSecret = getJwtSecret();
  if (!jwtSecret) return { authenticated: false };

  try {
    const { payload } = await jwtVerify(token, jwtSecret);
    return { authenticated: payload.role === 'admin', user: payload };
  } catch {
    return { authenticated: false };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    
    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }
  }
  
  // Rate limiting for all API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `api:${ip}:${pathname}`;
    const { allowed, remaining, resetTime } = rateLimit(rateLimitKey, 100, 60 * 1000); // 100 req/min
    
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)));
    
    if (!allowed) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { ...response.headers, 'Content-Type': 'application/json' },
      });
    }
  }
  
  // Strict rate limiting for auth endpoint
  if (pathname === '/api/auth' && request.method === 'POST') {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `auth:${ip}`;
    const { allowed, remaining, resetTime } = rateLimit(rateLimitKey, 5, 15 * 60 * 1000); // 5 req/15min
    
    response.headers.set('X-RateLimit-Limit', '5');
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)));
    
    if (!allowed) {
      return new NextResponse(JSON.stringify({ error: 'Too many login attempts. Try again later.' }), {
        status: 429,
        headers: { ...response.headers, 'Content-Type': 'application/json' },
      });
    }
  }
  
  // Keep public portfolio reads available while protecting admin operations.
  const isPublicApiRequest = publicApiMethods[pathname]?.includes(request.method) ?? false;
  if (pathname.startsWith('/api/') && pathname !== '/api/auth' && !isPublicApiRequest) {
    const { authenticated } = await verifyAuth(request);
    
    if (!authenticated) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized. Admin access required.' }), {
        status: 401,
        headers: { ...response.headers, 'Content-Type': 'application/json' },
      });
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
  ],
};