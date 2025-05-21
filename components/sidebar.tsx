"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ConversationsData } from "@/lib/data"

interface SidebarProps {
  conversations: ConversationsData
  selectedConversation: string
  onSelectConversation: (id: string) => void
}

export default function Sidebar({ conversations, selectedConversation, onSelectConversation }: SidebarProps) {
  return (
    <div className="w-64 border-r bg-white flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Your inbox</h2>
      </div>

      <div className="px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center h-7 text-xs">
            <span>5 Open</span>
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" className="flex items-center h-7 text-xs">
            <span>Waiting longest</span>
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {Object.values(conversations).map((conversation) => {
          // Determine avatar color based on conversation ID
          let avatarClass = "inbox-avatar-blue"
          if (conversation.id === "ivan") avatarClass = "inbox-avatar-red"
          if (conversation.id === "lead") avatarClass = "inbox-avatar-green"
          if (conversation.id === "booking") avatarClass = "inbox-avatar-gray"
          if (conversation.id === "miracle") avatarClass = "inbox-avatar-purple"

          return (
            <div
              key={conversation.id}
              className={`inbox-item ${selectedConversation === conversation.id ? "active" : ""}`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-start">
                <div className={`inbox-avatar ${avatarClass} mr-3`}>{conversation.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-sm">
                      {conversation.name.split(" ")[0]} - {conversation.company}
                    </div>
                    <div className="text-xs text-gray-400">{conversation.lastMessageTime}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{conversation.lastMessage}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
