"use client"

import { useState, useEffect } from "react"
import Sidebar from "./sidebar"
import ChatPanel from "./chat-panel"
import CopilotSidebar from "./copilot-sidebar"
import Header from "./header"
import { conversationsData } from "@/lib/data"

export default function Dashboard() {
  const [selectedConversation, setSelectedConversation] = useState("luis")
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const [aiOptions, setAiOptions] = useState<{
    visible: boolean
    position: { top: number; left: number }
    messageId: string
  } | null>(null)
  const [conversations, setConversations] = useState(conversationsData)
  const [currentMessage, setCurrentMessage] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const handleMessageSelect = (messageId: string, position: { top: number; left: number }) => {
    setSelectedMessage(messageId)
    setAiOptions({
      visible: true,
      position,
      messageId,
    })
  }

  const handleCloseAiOptions = () => {
    setAiOptions(null)
    setSelectedMessage(null)
  }

  const handleAddToComposer = (text: string) => {
    setCurrentMessage(text)
  }

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return

    const updatedConversations = { ...conversations }
    const conversation = updatedConversations[selectedConversation]

    if (conversation) {
      conversation.messages.push({
        id: `msg${conversation.messages.length + 1}`,
        sender: "agent",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      })

      // Update last message preview in sidebar
      conversation.lastMessage = message
      conversation.lastMessageTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      setConversations(updatedConversations)
    }
  }

  // Add a new function to handle closing conversations
  const handleCloseConversation = () => {
    // In a real app, you might mark the conversation as closed in your database
    // For now, we'll just select a different conversation
    const conversationIds = Object.keys(conversations)
    const currentIndex = conversationIds.indexOf(selectedConversation)

    if (conversationIds.length > 1) {
      // Select the next conversation, or the previous if we're at the end
      const nextIndex = (currentIndex + 1) % conversationIds.length
      setSelectedConversation(conversationIds[nextIndex])
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left sidebar */}
      <Sidebar
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={(id) => {
          setSelectedConversation(id)
        }}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Header
          conversationId={selectedConversation}
          conversation={conversations[selectedConversation]}
          onToggleLeftSidebar={() => {}}
          onToggleRightSidebar={() => {}}
          leftSidebarOpen={true}
          rightSidebarOpen={true}
          onCloseConversation={handleCloseConversation}
        />

        <div className="flex flex-1 overflow-hidden relative">
          <ChatPanel
            conversation={conversations[selectedConversation]}
            onMessageSelect={handleMessageSelect}
            selectedMessage={selectedMessage}
            aiOptions={aiOptions}
            onCloseAiOptions={handleCloseAiOptions}
            onSendMessage={handleSendMessage}
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
          />

          {/* Right sidebar - increased width from 80 to 120 */}
          <div className="w-[400px] h-full">
            <CopilotSidebar conversation={conversations[selectedConversation]} onAddToComposer={handleAddToComposer} />
          </div>
        </div>
      </div>
    </div>
  )
}
