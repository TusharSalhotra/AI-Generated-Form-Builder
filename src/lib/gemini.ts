import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY!

const genAI = new GoogleGenerativeAI(apiKey)

export const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite"
})

export async function generateText(prompt: string) {
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured")

  const result = await model.generateContent(prompt)
  const response = result.response

  const text = await response.text()
  return text
}
