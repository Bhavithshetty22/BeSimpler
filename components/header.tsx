"use client"

import { MoreHorizontal, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Conversation } from "@/lib/data"

interface HeaderProps {
  conversationId: string
  conversation: Conversation
  onToggleLeftSidebar: () => void
  onToggleRightSidebar: () => void
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  onCloseConversation: () => void
}

export default function Header({ conversationId, conversation, onCloseConversation }: HeaderProps) {
  if (!conversation) return null

  return (
    <div className="h-14 border-b bg-white flex items-center justify-between px-4">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">{conversation.name}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Moon className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="bg-gray-900 text-white hover:bg-gray-800 h-8 px-3"
          onClick={onCloseConversation}
        >
          Close
        </Button>
      </div>
    </div>
  )
}
