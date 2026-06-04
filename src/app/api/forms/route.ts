export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import { demoForms } from '@/lib/demo-forms';
import { verifyToken } from '../../../../lib/auth';

function getTokenFromCookie(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('sf_token='));
  return match ? match.split('=')[1] : null;
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromCookie(request.headers.get('cookie'));
    const payload = token ? verifyToken(token) : null;

    if (!payload?.id) {
      return NextResponse.json({ success: true, data: demoForms });
    }

    const forms = await prisma.form.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: forms });
  } catch {
    return NextResponse.json({
      success: true,
      data: demoForms,
      isDemo: true,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromCookie(request.headers.get('cookie'));
    const payload = token ? verifyToken(token) : null;

    if (!payload?.id) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { title, schema } = await request.json();

    if (!title || !schema) {
      return NextResponse.json(
        { success: false, message: 'Title and schema are required' },
        { status: 400 }
      );
    }

    const form = await prisma.form.create({
      data: {
        title,
        schema,
        userId: payload.id,
      },
    });

    await Promise.all(
      ['A', 'B'].map(
        (label) =>
          prisma.$executeRaw`
          INSERT INTO "FormVersion" ("id", "formId", "schema", "label", "createdAt")
          VALUES (${randomUUID()}, ${form.id}, ${JSON.stringify(schema)}::jsonb, ${label}, NOW())
          ON CONFLICT ("formId", "label") DO NOTHING
        `
      )
    );

    return NextResponse.json({ success: true, data: form }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}
