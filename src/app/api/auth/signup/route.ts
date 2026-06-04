import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Missing email or password' }, { status: 400 });
    }

    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
    const usersFile = path.join(dataDir, 'users.json');
    let users: Array<any> = [];
    try {
      const raw = fs.readFileSync(usersFile, 'utf-8');
      users = JSON.parse(raw);
    } catch (e) {
      users = [];
    }

    if (users.find((u) => u.email === email)) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 409 });
    }

    const newUser = { id: `u_${Date.now()}`, email, password };
    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: String(err) }, { status: 500 });
  }
}
