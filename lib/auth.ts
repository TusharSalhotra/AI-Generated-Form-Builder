import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.resolve(process.cwd(), 'data', 'users.json');
const SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret';

export function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw) as Array<{ id: string; email: string; password: string }>;
  } catch (e) {
    return [];
  }
}

export function signToken(payload: Record<string, any>) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string) {
  try {
    const [header, body, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
    if (!sig || sig !== expected) return null;
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')) as any;
  } catch (e) {
    return null;
  }
}

