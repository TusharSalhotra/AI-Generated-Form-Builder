export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const forms = await prisma.form.findMany();
    return NextResponse.json({ message: 'API working', forms });
  } catch (error) {
    return NextResponse.json(
      { message: 'API working', error: String(error) },
      { status: 500 }
    );
  }
}
