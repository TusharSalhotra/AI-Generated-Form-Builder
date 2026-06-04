import { NextResponse } from 'next/server';
import { readUsers, signToken } from '../../../../../lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ message: 'Missing' }, { status: 400 });

    const users = readUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user)
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );

    const token = signToken({ id: user.id, email: user.email });
    const res = NextResponse.json({ success: true });
    res.cookies.set('sf_token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    });
    return res;
  } catch (err) {
    return NextResponse.json({ message: String(err) }, { status: 500 });
  }
}
