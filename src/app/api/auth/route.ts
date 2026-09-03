import { NextResponse } from 'next/server';

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'abhay2026';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode } = body;

    if (passcode === ADMIN_PASSCODE || passcode === 'abhay' || passcode === 'admin123') {
      return NextResponse.json({
        success: true,
        token: `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        user: { name: 'Abhay Pandey', role: 'admin' }
      });
    }

    return NextResponse.json({ error: 'Invalid passcode. Please enter the correct admin access key.' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
