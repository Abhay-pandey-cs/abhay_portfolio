import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { getJwtSecret } from '@/lib/authConfig';
import { isValidAdminPasscodeHash, verifyAdminPasscode } from '@/lib/adminPasscode';

const ADMIN_PASSCODE_HASH = process.env.ADMIN_PASSCODE_HASH;
const JWT_SECRET = getJwtSecret();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode } = body;

    if (!passcode || typeof passcode !== 'string') {
      return NextResponse.json({ error: 'Passcode is required' }, { status: 400 });
    }

    if (!ADMIN_PASSCODE_HASH || !isValidAdminPasscodeHash(ADMIN_PASSCODE_HASH) || !JWT_SECRET) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const isValid = await verifyAdminPasscode(passcode, ADMIN_PASSCODE_HASH);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 });
    }

    const token = await new SignJWT({ role: 'admin', name: 'Abhay Pandey' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: new URL(request.url).protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: { name: 'Abhay Pandey', role: 'admin' }
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  return NextResponse.json({ success: true });
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (!JWT_SECRET) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== 'admin') {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, user: payload });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
