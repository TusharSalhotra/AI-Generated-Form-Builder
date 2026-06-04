import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('sf_token', '', { httpOnly: true, path: '/', sameSite: 'lax', maxAge: 0 });
  return res;
}
