import { NextResponse } from "next/server"
import { AI_CONFIG } from "@/lib/ai-config"

export async function POST(request: Request) {
  try {
    const { question, conversationContext } = await request.json()

    // Ensure we have the required parameters
    if (!question) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // If we're in offline mode, return a mock response
    if (AI_CONFIG.useOfflineMode || AI_CONFIG.api.provider === "mock") {
      return mockResponse(question, conversationContext)
    }

    // Create a comprehensive system prompt for the AI copilot
    const systemPrompt = `You are Fin AI Copilot, an advanced AI assistant for customer service agents.

Your primary goal is to help agents provide excellent customer service by:
1. Answering questions about company policies, products, and procedures
2. Suggesting responses to customer inquiries
3. Providing relevant information based on the conversation context
4. Offering actionable next steps

Current conversation context:
${conversationContext || "No context provided"}

Company policies to keep in mind:
- Refunds are available for items returned within 60 days of purchase
- Items must be in original condition with packaging
- Shipping typically takes 3-5 business days for standard, 1-2 days for express
- Exchanges can be processed within 30 days of purchase

Respond in a clear, concise, and helpful manner. Format your response with proper paragraphs and bullet points when appropriate.`

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
            content: question,
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`${AI_CONFIG.api.provider} API error:`, errorData)

      // Fall back to mock response
      return mockResponse(question, conversationContext)
    }

    const data = await response.json()
    const result = data.choices[0].message.content

    // Generate relevant sources based on the question and response
    const sources = generateRelevantSources(question, result)

    return NextResponse.json({
      text: result,
      sources,
    })
  } catch (error) {
    console.error("Error in AI Copilot:", error)
    // Fall back to mock response
    return mockResponse(question, conversationContext)
  }
}

// Helper function to generate mock responses
async function mockResponse(question: string, conversationContext: string) {
  let response = ""
  const sources = ["Getting a refund", "Refund for an order placed by mistake", "Refund for an unwanted gift"]

  if (question.toLowerCase().includes("refund")) {
    response = `Please note:
We can only refund orders placed within the last 60 days, and your item must meet our requirements for condition to be returned. Please check when you placed your order before proceeding.

Once I've checked these details, if everything looks OK, I will send a returns QR code which you can use to post the item back to us. Your refund will be automatically issued once you put it in the post.`
  } else if (question.toLowerCase().includes("shipping") || question.toLowerCase().includes("delivery")) {
    response = `For shipping inquiries, we need to verify a few details:

1. Order number
2. Shipping address
3. Date of purchase

Standard shipping typically takes 3-5 business days, while express shipping is 1-2 business days. If your package shows as delivered but you haven't received it, we recommend checking with neighbors and your local delivery office first.`
  } else if (question.toLowerCase().includes("exchange")) {
    response = `For exchanges, our policy allows you to exchange items within 30 days of purchase. The item must be in its original condition with all tags and packaging. 

To process an exchange:
1. Provide your order number
2. Specify which item you want to exchange and for what
3. We'll send you a return label for the original item`
  } else {
    response = `I'm here to help with your customer service needs. Based on the conversation, I can assist with:

1. Processing refunds or returns
2. Tracking orders and shipments
3. Answering product questions
4. Handling account issues

Please provide more details about your specific question, and I'll be happy to assist further.`
  }

  return NextResponse.json({
    text: response,
    sources,
  })
}

// Helper function to generate relevant sources based on the question and response
function generateRelevantSources(question: string, response: string) {
  const lowerQuestion = question.toLowerCase()
  const lowerResponse = response.toLowerCase()

  let sources = ["Company policies", "Customer service guidelines", "Product information"]

  if (lowerQuestion.includes("refund") || lowerResponse.includes("refund")) {
    sources = ["Refund policy", "Return process", "Payment refunds"]
  } else if (
    lowerQuestion.includes("shipping") ||
    lowerQuestion.includes("delivery") ||
    lowerResponse.includes("shipping") ||
    lowerResponse.includes("delivery")
  ) {
    sources = ["Shipping policy", "Delivery timeframes", "Tracking information"]
  } else if (
    lowerQuestion.includes("exchange") ||
    lowerQuestion.includes("return") ||
    lowerResponse.includes("exchange") ||
    lowerResponse.includes("return")
  ) {
    sources = ["Exchange policy", "Return process", "Product exchanges"]
  } else if (
    lowerQuestion.includes("order") ||
    lowerQuestion.includes("purchase") ||
    lowerResponse.includes("order") ||
    lowerResponse.includes("purchase")
  ) {
    sources = ["Order management", "Purchase history", "Order tracking"]
  } else if (
    lowerQuestion.includes("account") ||
    lowerQuestion.includes("login") ||
    lowerResponse.includes("account") ||
    lowerResponse.includes("login")
  ) {
    sources = ["Account management", "Login help", "Password reset"]
  }

  return sources
}
