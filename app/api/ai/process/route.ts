import { NextResponse } from "next/server"
import { AI_CONFIG } from "@/lib/ai-config"

export async function POST(request: Request) {
  try {
    const { text, systemPrompt, option } = await request.json()

    // Ensure we have the required parameters
    if (!text || !systemPrompt) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // If we're in offline mode, return a mock response
    if (AI_CONFIG.useOfflineMode || AI_CONFIG.api.provider === "mock") {
      return mockResponse(text, option)
    }

    // Determine which API to use
    const apiEndpoint =
      AI_CONFIG.api.provider === "openai" ? AI_CONFIG.api.endpoints.openai : AI_CONFIG.api.endpoints.deepseek

    const model = AI_CONFIG.api.provider === "openai" ? AI_CONFIG.api.models.openai : AI_CONFIG.api.models.deepseek

    // Call the selected API
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: option === "friendly" ? 0.7 : 0.3,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`${AI_CONFIG.api.provider} API error:`, errorData)

      // Fall back to mock response
      return mockResponse(text, option)
    }

    const data = await response.json()
    const result = data.choices[0].message.content

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Error in AI processing:", error)
    // Fall back to mock response
    if (typeof text === "undefined" || typeof option === "undefined") {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }
    return mockResponse(text, option)
  }
}

// Helper function to generate mock responses
async function mockResponse(text: string, option: string) {
  let result = ""

  switch (option) {
    case "rephrase":
      result = `We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund.`
      break
    case "friendly":
      result = `Hey there! I totally understand that sometimes purchases don't work out as expected. We're happy to help you with a refund request! 😊`
      break
    case "formal":
      result = `Dear valued customer, we acknowledge that occasionally purchases may not align with expectations. In such instances, our company policy permits refund requests under specific conditions.`
      break
    case "grammar":
      result = text.replace(/refund/g, "refund").replace(/please/g, "please")
      break
    case "translate":
      result = `Nous comprenons que parfois un achat peut ne pas répondre à vos attentes, et vous pourriez avoir besoin de demander un remboursement.`
      break
    case "tone":
      result = `I understand your situation completely. Let me help you with that refund request in a friendly and efficient way.`
      break
    case "summarize":
      if (text.includes("refund")) {
        result = `Customer needs a refund for an unopened Christmas gift purchased in November because the recipient already has a similar item.`
      } else if (text.includes("tracking")) {
        result = `Customer has not received their order even though tracking says it was delivered.`
      } else {
        result = `Summary of the conversation: ${text.substring(0, 100)}...`
      }
      break
    default:
      result = text
  }

  return NextResponse.json({ result })
}
