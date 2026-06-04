export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const values = body?.values;
    const version = typeof body?.version === 'string' ? body.version : 'A';

    if (!values || typeof values !== 'object') {
      return NextResponse.json(
        { success: false, message: 'values is required' },
        { status: 400 }
      );
    }

    const form = await prisma.form.findUnique({
      where: { id },
    });

    if (!form) {
      return NextResponse.json(
        { success: false, message: 'Form not found' },
        { status: 404 }
      );
    }

    await prisma.$executeRaw`
      INSERT INTO "Submission" ("id", "formId", "data", "version", "createdAt")
      VALUES (${randomUUID()}, ${id}, ${JSON.stringify(values)}::jsonb, ${version}, NOW())
    `;

    return NextResponse.json({
      success: true,
      message: 'Submission saved',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}
