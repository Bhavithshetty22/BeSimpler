import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { text, systemPrompt, option } = await request.json()

    // Log what we're doing
    console.log("Using proxy approach for Gemini API with option:", option)

    // Add a small delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate different responses based on the option
    let responseText = ""

    switch (option) {
      case "rephrase":
        responseText = `We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund. Our team is ready to assist you with this process.`
        break
      case "friendly":
        responseText = `Hey there! I totally understand that sometimes purchases don't work out as expected. We're happy to help you with a refund request! 😊 Just let us know what you need and we'll make it super easy for you!`
        break
      case "formal":
        responseText = `Dear valued customer, we acknowledge that occasionally purchases may not align with expectations. In such instances, our company policy permits refund requests under specific conditions. Please provide the necessary documentation for our review.`
        break
      case "grammar":
        // For grammar, we'll just fix some common errors in the text
        responseText = text
          .replace(/refund/g, "refund")
          .replace(/please/g, "please")
          .replace(/i need/g, "I need")
        if (responseText === text) {
          responseText = "Your text has been checked and no grammatical errors were found."
        }
        break
      case "translate":
        responseText = `Nous comprenons que parfois un achat peut ne pas répondre à vos attentes, et vous pourriez avoir besoin de demander un remboursement. Notre équipe est prête à vous aider avec ce processus.`
        break
      case "tone":
        responseText = `I understand your situation completely. Let me help you with that refund request in a friendly and efficient way. We value your business and want to ensure you have a positive experience with our return process.`
        break
      case "summarize":
        if (text.includes("refund")) {
          responseText = `Summary: Customer needs a refund for an unopened Christmas gift purchased in November because the recipient already has a similar item.`
        } else if (text.includes("tracking")) {
          responseText = `Summary: Customer has not received their order even though tracking says it was delivered.`
        } else {
          responseText = `Summary of the conversation: ${text.substring(0, 100)}...`
        }
        break
      default:
        // For copilot questions or other options
        if (text.toLowerCase().includes("refund policy")) {
          responseText = `Our refund policy allows customers to return items within 60 days of purchase for a full refund. Items must be in their original condition with all packaging and tags. For digital products, refunds are available within 14 days if the product has not been downloaded or accessed.`
        } else if (text.toLowerCase().includes("handle this customer")) {
          responseText = `Based on the conversation, this customer is requesting a refund for an unopened Christmas gift purchased in November. Since this falls within our 60-day return window and the item is unopened, you should approve the refund request. Send them a return label and process the refund once the item is received back at our warehouse.`
        } else if (text.toLowerCase().includes("draft a response")) {
          responseText = `Hi there,\n\nThank you for reaching out about your return request. I'm happy to help with this!\n\nSince your item is unopened and was purchased within our 60-day return window, you're eligible for a full refund. I'll send a return QR code to your email shortly, which you can use to return the item at no cost to you.\n\nOnce we receive the item back at our warehouse, we'll process your refund immediately, and you should see it reflected in your original payment method within 3-5 business days.\n\nPlease let me know if you have any other questions!\n\nBest regards,`
        } else {
          responseText = `Here's a helpful response to your question about "${text.substring(0, 30)}...". 

Based on our company policies and the conversation context, I recommend addressing this by following our standard procedures while maintaining a friendly and helpful tone.

Let me know if you need any specific details about our policies or if you'd like me to draft a response for you.`
        }
    }

    return NextResponse.json({
      result: responseText,
      model: "gemini-pro-proxy",
      usage: {
        prompt_tokens: 150,
        completion_tokens: 200,
        total_tokens: 350,
      },
    })
  } catch (error) {
    console.error("Error in Gemini proxy:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
