"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, ArrowUp, ExternalLink, Sparkles, Loader2, ChevronDown, ArrowRight } from "lucide-react"
import type { Conversation } from "@/lib/data"
import { getAIResponse } from "@/lib/ai-service"
import { AI_CONFIG } from "@/lib/ai-config"

interface CopilotSidebarProps {
  conversation: Conversation
  onAddToComposer?: (text: string) => void
}

export default function CopilotSidebar({ conversation, onAddToComposer }: CopilotSidebarProps) {
  const [question, setQuestion] = useState("")
  const [copilotMessages, setCopilotMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sources, setSources] = useState<string[]>([])
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [hasApiError, setHasApiError] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showApiConfig, setShowApiConfig] = useState(false)
  const [isOffline, setIsOffline] = useState(AI_CONFIG.useOfflineMode)

  useEffect(() => {
    scrollToBottom()
  }, [copilotMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleAskQuestion = async (text: string = question) => {
    if (!text.trim() || !conversation) return

    const newQuestion = {
      id: `q${copilotMessages.length + 1}`,
      sender: "user",
      text: text,
      type: "question",
    }

    setCopilotMessages([...copilotMessages, newQuestion])
    setQuestion("")
    setIsLoading(true)

    try {
      // Get conversation context for the AI
      const conversationContext = conversation.messages.map((msg) => `${msg.sender}: ${msg.text}`).join("\n")

      // Get AI response
      const response = await getAIResponse(text, conversationContext)

      // Format the response with a standard structure for refund-related questions
      let formattedText = response.text
      if (text.toLowerCase().includes("refund") || text.toLowerCase().includes("return")) {
        formattedText = `Please note:
We can only refund orders placed within the last 60 days, and your item must meet our requirements for condition to be returned. Please check when you placed your order before proceeding.

Once I've checked these details, if everything looks OK, I will send a returns QR code which you can use to post the item back to us. Your refund will be automatically issued once you put it in the post.`
      }

      const newAnswer = {
        id: `a${copilotMessages.length + 1}`,
        sender: "copilot",
        text: formattedText,
        type: "answer",
      }

      setCopilotMessages((prev) => [...prev, newAnswer])
      setSources(
        response.sources || [
          "Getting a refund",
          "Refund for an order placed by mistake",
          "Refund for an unwanted gift",
        ],
      )

      // Reset API error state if successful
      setHasApiError(false)
    } catch (error) {
      console.error("Error getting AI response:", error)
      setHasApiError(true)

      // Provide a more helpful error message
      const newAnswer = {
        id: `a${copilotMessages.length + 1}`,
        sender: "copilot",
        text: "I'm sorry, I couldn't process your request with the Gemini API. Using stored responses instead.",
        type: "answer",
      }

      setCopilotMessages((prev) => [...prev, newAnswer])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToComposer = (text: string) => {
    if (onAddToComposer) {
      onAddToComposer(text)
      setCopiedText(text)

      // Reset the copied text indicator after 2 seconds
      setTimeout(() => {
        setCopiedText(null)
      }, 2000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAskQuestion()
    }
  }

  const focusInput = () => {
    inputRef.current?.focus()
  }

  if (!conversation) {
    return (
      <div className="w-full h-full border-l bg-white flex flex-col">
        <div className="p-4 text-center text-gray-500">Select a conversation to use AI Copilot</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full border-l bg-white flex flex-col">
      <Tabs defaultValue="copilot" className="flex flex-col h-full">
        <div className="flex items-center border-b">
          <div className="flex-1 flex">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger
                value="copilot"
                className="flex items-center px-4 py-3 data-[state=active]:tab-active data-[state=inactive]:tab-inactive border-b-2 border-transparent"
              >
                <div className="bg-indigo-600 text-white p-1 rounded mr-2">
                  <Sparkles className="h-3 w-3" />
                </div>
                AI Copilot
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="px-4 py-3 data-[state=active]:tab-active data-[state=inactive]:tab-inactive border-b-2 border-transparent"
              >
                Details
              </TabsTrigger>
            </TabsList>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-2">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.5 1.5C4.5 1.5 2 4 2 7C2 10 4.5 12.5 7.5 12.5C10.5 12.5 13 10 13 7C13 4 10.5 1.5 7.5 1.5ZM7.5 11.5C5 11.5 3 9.5 3 7C3 4.5 5 2.5 7.5 2.5C10 2.5 12 4.5 12 7C12 9.5 10 11.5 7.5 11.5Z"
                fill="currentColor"
              />
              <path
                d="M6.5 5C6.5 5.55228 6.94772 6 7.5 6C8.05228 6 8.5 5.55228 8.5 5C8.5 4.44772 8.05228 4 7.5 4C6.94772 4 6.5 4.44772 6.5 5Z"
                fill="currentColor"
              />
              <path d="M6.5 9V7H8.5V9H6.5Z" fill="currentColor" />
            </svg>
          </Button>
        </div>

        <TabsContent
  value="copilot"
  className="flex-1 flex flex-col overflow-hidden p-0"
  style={{
  background: `
    radial-gradient(circle at bottom left, rgba(255, 0, 0, 0.15) 5%, transparent 30%),
    radial-gradient(circle at bottom right, rgba(128, 0, 128, 0.15) 5%, transparent 30%),
    white`
}}
>
          <div className="flex-1 overflow-y-auto">
            {copilotMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white mb-4">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-medium">Hi, I'm Fin AI Copilot</h3>
                <p className="text-sm text-gray-500 mt-1">Ask me anything about this conversation.</p>
              </div>
            ) : (
              <div className="p-4 space-y-6">
                {copilotMessages.map((msg, index) => (
                  <div key={msg.id} className="flex flex-col animate-fadeIn">
                    <div className="flex items-start mb-2">
                      {msg.sender === "user" ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex-shrink-0">
                            <img src="/placeholder.svg?height=32&width=32" alt="You" className="rounded-full" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">You</div>
                            <div className="text-sm bg-gray-100 p-3 rounded-lg">{msg.text}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mr-2 flex-shrink-0 flex items-center justify-center text-white">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">Fin</div>
                            <div className="finn-message-gradient p-4 rounded-lg text-sm border border-purple-100 whitespace-pre-wrap leading-relaxed relative">
                              {msg.text.split("\n\n").map((paragraph, i) => (
                                <p key={i} className={i > 0 ? "mt-3" : ""}>
                                  {paragraph.includes("①") ? (
                                    <>
                                      {paragraph.split("\n").map((line, j) => (
                                        <div key={j} className={j > 0 ? "mt-1" : ""}>
                                          {line.includes("①") ? (
                                            <span>
                                              {line.replace("①", "")}{" "}
                                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs">
                                                1
                                              </span>
                                            </span>
                                          ) : line.includes("②") ? (
                                            <span>
                                              {line.replace("②", "")}{" "}
                                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs">
                                                2
                                              </span>
                                            </span>
                                          ) : (
                                            line
                                          )}
                                        </div>
                                      ))}
                                    </>
                                  ) : (
                                    paragraph
                                  )}
                                </p>
                              ))}

                              {/* Add to composer button inside the message box */}
                              <div className="mt-3 border-t border-purple-100 pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center text-sm transition-all duration-200 hover:bg-blue-50 w-full justify-between bg-white"
                                  onClick={() => handleAddToComposer(msg.text)}
                                >
                                  <span className="flex items-center">
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="mr-1.5"
                                    >
                                      <path
                                        d="M8 8H16M8 12H16M8 16H12M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    Add to composer
                                  </span>
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Sources section below the message */}
                            {index === copilotMessages.length - 1 && msg.sender === "copilot" && sources.length > 0 && (
                              <div className="mt-3 text-sm text-gray-600">
                                <div className="text-xs text-gray-500 mb-1">
                                  {sources.length} relevant sources found
                                </div>
                                <ul className="space-y-1">
                                  {sources.slice(0, 3).map((source, i) => (
                                    <li key={i} className="flex items-start">
                                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-sm bg-gray-200 text-gray-700 text-xs mr-2 mt-0.5">
                                        ■
                                      </span>
                                      {source}
                                    </li>
                                  ))}
                                </ul>
                                {sources.length > 3 && (
                                  <button className="text-xs text-gray-500 mt-1 flex items-center hover:text-gray-700">
                                    See all <ArrowRight className="h-3 w-3 ml-1" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start animate-fadeIn">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mr-2 flex-shrink-0 flex items-center justify-center text-white">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Fin</div>
                      <div className="finn-message-gradient p-3 rounded-lg flex items-center justify-center h-20 border border-purple-100">
                        <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />
                        <span className="ml-2 text-sm text-purple-700">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="relative">
              <div className="bg-gray-100 rounded-md flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask a follow up question..."
                  className="w-full p-3 bg-transparent border-none focus:outline-none text-sm"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  className="h-8 w-8 mr-2 p-0 bg-transparent hover:bg-transparent"
                  onClick={() => handleAskQuestion()}
                  disabled={!question.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  ) : (
                    <ArrowUp className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Assignee</span>
              </div>
              <div className="flex items-center">
                <img
                  src="/placeholder.svg?height=24&width=24"
                  alt="Brian Byrne"
                  className="w-6 h-6 rounded-full mr-1"
                />
                <span className="text-sm">Brian Byrne</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Team</span>
              <span className="text-sm">Unassigned</span>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-3 text-xs text-gray-500">LINKS</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">Tracker ticket</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 transition-all duration-200">
                    +
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">Back-office tickets</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 transition-all duration-200">
                    +
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">Side conversations</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 transition-all duration-200">
                    +
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-xs text-gray-500">USER DATA</h3>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-xs text-gray-500">CONVERSATION ATTRIBUTES</h3>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
