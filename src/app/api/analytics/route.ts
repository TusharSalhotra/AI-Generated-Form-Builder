import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import { getDemoAnalytics, getFieldAnalytics } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const { formId, fieldId, timeSpent, version = 'A' } = await request.json();

    if (!formId || !fieldId || typeof timeSpent !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Invalid analytics payload' },
        { status: 400 }
      );
    }

    const [analytics] = await prisma.$queryRaw<
      Array<{
        id: string;
        formId: string;
        fieldId: string;
        timeSpent: number;
        version: string;
        createdAt: Date;
      }>
    >`
      INSERT INTO "Analytics" ("id", "formId", "fieldId", "timeSpent", "version", "createdAt")
      VALUES (${randomUUID()}, ${formId}, ${fieldId}, ${timeSpent}, ${version}, NOW())
      RETURNING "id", "formId", "fieldId", "timeSpent", "version", "createdAt"
    `;

    return NextResponse.json({ success: true, data: analytics });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const formId = request.nextUrl.searchParams.get('formId');

  if (!formId) {
    return NextResponse.json(
      { success: false, message: 'formId query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const analytics = await getFieldAnalytics(formId);
    return NextResponse.json({ success: true, data: analytics });
  } catch {
    return NextResponse.json({
      success: true,
      data: getDemoAnalytics(),
    });
  }
}
