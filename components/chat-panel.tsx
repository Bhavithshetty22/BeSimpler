"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Smile, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatBubble from "./chat-bubble"
import AiOptionsPopup from "./ai-options-popup"
import FloatingToolbar from "./floating-toolbar"
import { processWithAI } from "@/lib/ai-service"
import type { Conversation } from "@/lib/data"

interface ChatPanelProps {
  conversation: Conversation
  onMessageSelect: (messageId: string, position: { top: number; left: number }) => void
  selectedMessage: string | null
  aiOptions: {
    visible: boolean
    position: { top: number; left: number }
    messageId: string
  } | null
  onCloseAiOptions: () => void
  onSendMessage: (message: string) => void
  currentMessage: string
  setCurrentMessage: (message: string) => void
}

export default function ChatPanel({
  conversation,
  onMessageSelect,
  selectedMessage,
  aiOptions,
  onCloseAiOptions,
  onSendMessage,
  currentMessage,
  setCurrentMessage,
}: ChatPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [summary, setSummary] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [processingOption, setProcessingOption] = useState<string | null>(null)
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false)
  const [floatingToolbarPosition, setFloatingToolbarPosition] = useState({ top: 0, left: 0 })
  const [selectedText, setSelectedText] = useState("")
  const [selectionStart, setSelectionStart] = useState(0)
  const [selectionEnd, setSelectionEnd] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (currentMessage.trim() === "") return

    setIsSending(true)
    // Simulate network delay for a more realistic experience
    await new Promise((resolve) => setTimeout(resolve, 300))

    onSendMessage(currentMessage)
    setCurrentMessage("")
    setIsSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const processWithAIOption = async (option: string) => {
    if (!selectedMessage || !conversation) return

    const selectedMessageObj = conversation.messages.find((msg) => msg.id === selectedMessage)
    if (!selectedMessageObj) return

    setIsProcessing(true)
    setProcessingOption(option)

    try {
      if (option === "summarize") {
        const result = await processWithAI(
          conversation.messages.map((m) => `${m.sender}: ${m.text}`).join("\n"),
          "summarize",
        )
        setSummary(result.result)
        setShowSummary(true)
        onCloseAiOptions()
      } else {
        const result = await processWithAI(selectedMessageObj.text, option)
        setCurrentMessage(result.result)
      }
      onCloseAiOptions()
    } catch (error) {
      console.error("Error processing with AI:", error)
      // Show a toast or notification about the error
      alert("There was an error processing your request. Using fallback responses instead.")
    } finally {
      setIsProcessing(false)
      setProcessingOption(null)
    }
  }

  const handleTextSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd

      if (start !== end) {
        const selection = currentMessage.substring(start, end)
        setSelectedText(selection)
        setSelectionStart(start)
        setSelectionEnd(end)

        // Calculate position for the floating toolbar
        const textarea = textareaRef.current
        const textBeforeSelection = currentMessage.substring(0, start)
        const lines = textBeforeSelection.split("\n")
        const lineNumber = lines.length - 1
        const lineHeight = 24 // Approximate line height in pixels

        const rect = textarea.getBoundingClientRect()
        const scrollTop = textarea.scrollTop

        // Calculate the position of the selection
        const top = rect.top + lineNumber * lineHeight - scrollTop
        const left = rect.left + 150 // Approximate horizontal position

        setFloatingToolbarPosition({ top, left })
        setShowFloatingToolbar(true)
      } else {
        setShowFloatingToolbar(false)
      }
    }
  }

  const handleFormatText = (formattedText: string, format: string) => {
    if (textareaRef.current) {
      const newMessage =
        currentMessage.substring(0, selectionStart) + formattedText + currentMessage.substring(selectionEnd)

      setCurrentMessage(newMessage)
      setShowFloatingToolbar(false)

      // Focus back on textarea and set cursor position after the formatted text
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          const newCursorPosition = selectionStart + formattedText.length
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
        }
      }, 0)
    }
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-white">
      {showSummary && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-10 max-w-md border border-gray-200">
          <h3 className="font-medium mb-2">Conversation Summary</h3>
          <p className="text-sm text-gray-600">{summary}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowSummary(false)}>
            Close
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 relative" ref={chatContainerRef}>
        {conversation.messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isSelected={selectedMessage === msg.id}
            onSelect={(position) => onMessageSelect(msg.id, position)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {aiOptions && aiOptions.visible && (
        <AiOptionsPopup
          position={aiOptions.position}
          onClose={onCloseAiOptions}
          onSelectOption={processWithAIOption}
          isProcessing={isProcessing}
          processingOption={processingOption}
        />
      )}

      {showFloatingToolbar && (
        <FloatingToolbar
          position={floatingToolbarPosition}
          selectedText={selectedText}
          onClose={() => setShowFloatingToolbar(false)}
          onFormatText={handleFormatText}
        />
      )}

      <div className=" p-4 ">
        <div className="flex items-center space-x-2">
          <div className="flex-1 border rounded-md shadow-sm bg-white">
            <div className="flex items-center px-3 py-2 bg-gray-50 text-xs text-gray-500 border-b">
              <span className="mr-3 text-base font-bold">Chat</span>

            </div>
            <textarea
              ref={textareaRef}
              className="w-full p-3 focus:outline-none resize-none min-h-[100px]"
              placeholder="Type your message..."
              rows={3}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onMouseUp={handleTextSelection}
              onKeyUp={handleTextSelection}
              disabled={isSending || isProcessing}
            />
            <div className="flex items-center justify-between p-2 border-t">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Save draft
                </Button>
                <Button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  disabled={currentMessage.trim() === "" || isSending || isProcessing}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
