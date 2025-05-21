"use client"

import { useState, useRef } from "react"
import type { Message } from "@/lib/data"

interface ChatBubbleProps {
  message: Message
  isSelected: boolean
  onSelect: (position: { top: number; left: number }) => void
}

export default function ChatBubble({ message, isSelected, onSelect }: ChatBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [selectedText, setSelectedText] = useState("")

  const handleMouseUp = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString())

      if (bubbleRef.current) {
        const rect = bubbleRef.current.getBoundingClientRect()
        onSelect({
          top: rect.top - 40,
          left: rect.left + rect.width / 2,
        })
      }
    }
  }

  const isCustomer = message.sender === "customer"
  const isSystem = message.sender === "system"

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm">
          {message.text}
          <span className="text-xs text-yellow-600 ml-2">{message.time}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex mb-4 ${isCustomer ? "justify-start" : "justify-end"}`} ref={bubbleRef}>
      {isCustomer && (
        <img src="/placeholder.svg?height=32&width=32" alt="Customer" className="h-8 w-8 rounded-full mr-2 mt-1" />
      )}
      <div className="max-w-[70%]">
        <div
          className={`p-3 rounded-lg ${
            isCustomer
              ? "bg-gray-100 text-gray-800"
              : "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200"
          } ${isSelected ? "ring-2 ring-blue-400" : ""}`}
          onMouseUp={handleMouseUp}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
        <div className={`text-xs text-gray-500 mt-1 ${isCustomer ? "text-left" : "text-right"}`}>
          {message.time} {!isCustomer && "• Seen"}
        </div>
      </div>
      {!isCustomer && (
        <img src="/placeholder.svg?height=32&width=32" alt="Agent" className="h-8 w-8 rounded-full ml-2 mt-1" />
      )}
    </div>
  )
}
