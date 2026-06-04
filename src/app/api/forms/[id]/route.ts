export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import { getDemoFormById } from '@/lib/demo-forms';

interface FormVersionRecord {
  id: string;
  formId: string;
  schema: unknown;
  label: string;
  createdAt: Date;
}

async function ensureDefaultVersions(formId: string, schema: unknown) {
  const versions = await prisma.$queryRaw<FormVersionRecord[]>`
    SELECT "id", "formId", "schema", "label", "createdAt"
    FROM "FormVersion"
    WHERE "formId" = ${formId}
    ORDER BY "label" ASC
  `;

  const labels = new Set(versions.map((version) => version.label));
  const missingLabels = ['A', 'B'].filter((label) => !labels.has(label));

  if (missingLabels.length > 0) {
    await Promise.all(
      missingLabels.map(
        (label) =>
          prisma.$executeRaw`
          INSERT INTO "FormVersion" ("id", "formId", "schema", "label", "createdAt")
          VALUES (${randomUUID()}, ${formId}, ${JSON.stringify(schema)}::jsonb, ${label}, NOW())
          ON CONFLICT ("formId", "label") DO NOTHING
        `
      )
    );

    return prisma.$queryRaw<FormVersionRecord[]>`
      SELECT "id", "formId", "schema", "label", "createdAt"
      FROM "FormVersion"
      WHERE "formId" = ${formId}
      ORDER BY "label" ASC
    `;
  }

  return versions;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const form = await prisma.form.findUnique({
      where: { id },
    });

    if (!form) {
      const demoForm = getDemoFormById(id);

      if (demoForm) {
        return NextResponse.json({ success: true, data: demoForm });
      }

      return NextResponse.json(
        { success: false, message: 'Form not found' },
        { status: 404 }
      );
    }

    const versions = await ensureDefaultVersions(id, form.schema);

    return NextResponse.json({
      success: true,
      data: {
        ...form,
        versions,
      },
    });
  } catch {
    const { id } = await params;
    const demoForm = getDemoFormById(id);

    if (demoForm) {
      return NextResponse.json({
        success: true,
        data: demoForm,
        isDemo: true,
      });
    }

    return NextResponse.json({
      success: true,
      data: null,
      isDemo: true,
      message: 'Database unavailable and no demo form matched this id.',
    });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { schema } = await request.json();

    if (!schema || !Array.isArray(schema.fields)) {
      return NextResponse.json(
        { success: false, message: 'Schema with fields is required' },
        { status: 400 }
      );
    }

    const updatedForm = await prisma.form.update({
      where: { id },
      data: {
        schema,
      },
    });

    await prisma.$executeRaw`
      DELETE FROM "FormVersion"
      WHERE "formId" = ${id}
    `;

    await Promise.all(
      ['A', 'B'].map(
        (label) =>
          prisma.$executeRaw`
          INSERT INTO "FormVersion" ("id", "formId", "schema", "label", "createdAt")
          VALUES (${randomUUID()}, ${id}, ${JSON.stringify(schema)}::jsonb, ${label}, NOW())
          ON CONFLICT ("formId", "label") DO NOTHING
        `
      )
    );

    return NextResponse.json({ success: true, data: updatedForm });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}
