import { AI_CONFIG } from "./ai-config"

// Process text with Gemini API
export async function processWithGemini(text: string, systemPrompt: string) {
  try {
    const apiKey = AI_CONFIG.api.keys.gemini
    const apiUrl = `${AI_CONFIG.api.endpoints.gemini}?key=${apiKey}`

    console.log("Calling Gemini API at:", apiUrl.split("?")[0]) // Log the endpoint without the API key

    // Simplified request format
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }, { text: text }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Gemini API error:", errorData)
      throw new Error(`Gemini API request failed with status ${response.status}: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    console.log("Gemini API response:", JSON.stringify(data).substring(0, 200) + "...") // Log a preview of the response

    // Extract the response text from Gemini's response format
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response."

    return { result }
  } catch (error) {
    console.error("Error processing with Gemini:", error)
    throw error
  }
}

// Get AI response for customer questions using Gemini
export async function getGeminiResponse(question: string, conversationContext: string) {
  try {
    const apiKey = AI_CONFIG.api.keys.gemini
    const apiUrl = `${AI_CONFIG.api.endpoints.gemini}?key=${apiKey}`

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

    console.log("Calling Gemini API with question:", question.substring(0, 50) + "...")

    // Simplified request format
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }, { text: question }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Gemini API error:", errorData)
      throw new Error(`Gemini API request failed with status ${response.status}: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()

    // Extract the response text from Gemini's response format
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response."

    // Generate relevant sources based on the question and response
    const sources = generateRelevantSources(question, result)

    return {
      text: result,
      sources,
    }
  } catch (error) {
    console.error("Error getting Gemini response:", error)
    throw error
  }
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
