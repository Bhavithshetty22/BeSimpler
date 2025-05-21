import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY", // Replace with your actual API key in .env.local
})

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a grammar correcting assistant. Fix any errors in the user input.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    })

    return NextResponse.json({ result: completion.choices[0].message.content })
  } catch (error) {
    console.error("Error in grammar API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
