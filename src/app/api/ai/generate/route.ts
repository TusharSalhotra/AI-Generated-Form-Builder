import { NextResponse } from "next/server"
import { generateText } from "../../../../lib/gemini"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prompt = body?.prompt

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ success: false, error: "Missing prompt" }, { status: 400 })
    }

    const text = await generateText(prompt)

    return NextResponse.json({ success: true, data: text })
  } catch (err: any) {
    console.error("AI generate error:", err)
    return NextResponse.json({ success: false, error: err?.message || "Unknown error" }, { status: 500 })
  }
}
