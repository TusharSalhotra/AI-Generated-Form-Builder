import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getFieldAnalytics } from '@/lib/analytics';
import { model } from '@/lib/gemini';

interface OptimizationResponse {
  suggestions: string[];
  optimizedFields: Array<Record<string, unknown>>;
}

function cleanJsonText(raw: string) {
  let text = raw.trim();

  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim();
  }

  return text;
}

function extractJson(raw: string) {
  const cleaned = cleanJsonText(raw);
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1) {
    return cleaned;
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const formId = body?.formId;

    if (!formId || typeof formId !== 'string') {
      return NextResponse.json({ success: false, error: 'Missing formId' }, { status: 400 });
    }

    const form = await prisma.form.findUnique({ where: { id: formId } });

    if (!form) {
      return NextResponse.json({ success: false, error: 'Form not found' }, { status: 404 });
    }

    const analytics = await getFieldAnalytics(formId);
    const prompt = `Optimize this form for better completion rate.\n\nForm schema:\n${JSON.stringify(form.schema, null, 2)}\n\nAnalytics:\n${JSON.stringify(analytics, null, 2)}\n\nSuggest:\n- reorder fields\n- remove difficult fields\n- simplify inputs\n\nReturn ONLY JSON in this format:\n{\n  suggestions: string[],\n  optimizedFields: Field[]\n}\n\nWhere Field is the same shape as existing form fields in the schema. Do not add explanation or extra text.`;

    const result: any = await model.generateContent(prompt);
    const rawText = await Promise.resolve(result?.response?.text?.());

    if (!rawText || typeof rawText !== 'string') {
      throw new Error('Invalid response from Gemini');
    }

    const jsonText = extractJson(rawText);
    const parsed = JSON.parse(jsonText) as OptimizationResponse;

    if (!Array.isArray(parsed.suggestions) || !Array.isArray(parsed.optimizedFields)) {
      throw new Error('Invalid optimization payload format');
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Optimize form error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Unable to optimize form' },
      { status: 500 }
    );
  }
}
