import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../../lib/auth';

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.split(';').map((c) => c.trim()).find((c) => c.startsWith('sf_token='));
    if (!match) return NextResponse.json({ user: null });
    const token = match.split('=')[1];
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ user: null });
    return NextResponse.json({ user: { id: payload.id, email: payload.email } });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
