import { NextResponse } from 'next/server'
import { model } from '@/lib/gemini'

type GeneratedFormSchema = {
  title: string
  fields: Array<{
    id: string
    name: string
    type: 'text' | 'email' | 'number' | 'textarea' | 'select'
    label: string
    required: boolean
    options?: string[]
  }>
}

function cleanJsonText(raw: string) {
  let text = raw.trim()

  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim()
  }

  return text
}

function parseSchema(text: string) {
  const cleaned = cleanJsonText(text)

  try {
    return JSON.parse(cleaned) as GeneratedFormSchema
  } catch {
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start === -1 || end === -1) {
      throw new Error('Unable to locate JSON object in response')
    }

    const snippet = cleaned.slice(start, end + 1)
    return JSON.parse(snippet) as GeneratedFormSchema
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prompt = body?.prompt

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ success: false, error: 'Missing prompt' }, { status: 400 })
    }

    const fullPrompt = `Generate a JSON form schema with fields based on this request:\n${prompt}\n\nReturn ONLY valid JSON in this format:\n{\n  title: string,\n  fields: [\n    {\n      id: string,\n      name: string,\n      type: "text" | "email" | "number" | "textarea" | "select",\n      label: string,\n      required: boolean,\n      options?: string[]\n    }\n  ]\n}\n\nDo NOT add explanation. Only return JSON.`

    const result: any = await model.generateContent(fullPrompt)
    const rawText = await Promise.resolve(result?.response?.text?.())

    if (!rawText || typeof rawText !== 'string') {
      throw new Error('No response text returned from Gemini')
    }

    const parsedSchema = parseSchema(rawText)

    return NextResponse.json({ success: true, data: parsedSchema })
  } catch (err: any) {
    console.error('Generate form schema error:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Unable to generate form schema' },
      { status: 500 }
    )
  }
}
