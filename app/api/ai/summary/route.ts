import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY", // Replace with your actual API key in .env.local
})

export async function POST(request: Request) {
  try {
    const { conversation } = await request.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Summarize this conversation for an agent to catch up quickly.",
        },
        {
          role: "user",
          content: conversation,
        },
      ],
    })

    return NextResponse.json({ result: completion.choices[0].message.content })
  } catch (error) {
    console.error("Error in summary API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
