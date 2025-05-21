export interface Message {
  id: string
  sender: "customer" | "agent" | "system"
  text: string
  time: string
}

export interface Conversation {
  id: string
  name: string
  company?: string
  email?: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unread: boolean
  messages: Message[]
}

export type ConversationsData = {
  [key: string]: Conversation
}

export const conversationsData: ConversationsData = {
  luis: {
    id: "luis",
    name: "Luis Easton",
    company: "Github",
    email: "luis@github.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I need a refund for a product...",
    lastMessageTime: "45m",
    unread: false,
    messages: [
      {
        id: "msg1",
        sender: "customer",
        text: "I bought a product from your store in November as a Christmas gift for a member of my family. However, it turns out they have something very similar already. I was hoping you'd be able to refund me, as it is un-opened.",
        time: "10:00",
      },
      {
        id: "msg2",
        sender: "agent",
        text: "Let me just look into this for you, Luis...",
        time: "10:05",
      },
    ],
  },
  ryan: {
    id: "ryan",
    name: "Ryan",
    company: "Nike",
    email: "ryan@nike.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hi there, I have a question...",
    lastMessageTime: "2h",
    unread: true,
    messages: [
      {
        id: "msg1",
        sender: "customer",
        text: "Hi there, I have a question about my recent order. The tracking says it was delivered, but I haven't received anything yet.",
        time: "09:30",
      },
    ],
  },
  lead: {
    id: "lead",
    name: "Lead from New York",
    company: "",
    email: "lead@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Good morning, sir! How are...",
    lastMessageTime: "3h",
    unread: false,
    messages: [
      {
        id: "msg1",
        sender: "customer",
        text: "Good morning, sir! How are your products manufactured? I'm interested in bulk ordering for my company in New York.",
        time: "08:15",
      },
    ],
  },
  booking: {
    id: "booking",
    name: "Booking API problems",
    company: "Bug report",
    email: "luke@smallcrafty.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Luke - Small Crafty",
    lastMessageTime: "45m",
    unread: false,
    messages: [
      {
        id: "msg1",
        sender: "customer",
        text: "We're experiencing issues with the booking API. Our customers can't complete their reservations and we're losing business.",
        time: "09:45",
      },
    ],
  },
  miracle: {
    id: "miracle",
    name: "Miracle",
    company: "Exemplary Bank",
    email: "miracle@exemplarybank.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hey there, I'm here to...",
    lastMessageTime: "48m",
    unread: false,
    messages: [
      {
        id: "msg1",
        sender: "customer",
        text: "Hey there, I'm here to inquire about integrating your payment system with our banking platform. Do you have an API we can use?",
        time: "09:22",
      },
    ],
  },
  nikola: {
    id: "nikola",
    name: "Nikola Tesla",
    company: "Tesla Inc",
    email: "nikola@tesla.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I placed the order over 60 days ago...",
    lastMessageTime: "21m",
    unread: false,
    messages: [
      {
        id: "msg1",
        sender: "agent",
        text: "Thanks, passing you to the right team now.",
        time: "10:10",
      },
      {
        id: "msg2",
        sender: "agent",
        text: "Let me just look into this for you, Nikola.",
        time: "10:15",
      },
      {
        id: "msg3",
        sender: "agent",
        text: "We understand if your purchase didn't quite meet your expectations. To help you with a refund, please provide your order ID and proof of purchase.\n\nJust a heads-up:\nWe can only refund orders from the last 60 days.\nYour item must meet our return condition requirements.\n\nOnce confirmed, I'll send you a returns QR code for easy processing.\n\nThanks for your cooperation!",
        time: "10:20",
      },
      {
        id: "msg4",
        sender: "customer",
        text: "I placed the order over 60 days ago 😔. Could you make an exception, please?",
        time: "10:21",
      },
      {
        id: "msg5",
        sender: "system",
        text: "This customer has been waiting for 5 minutes.",
        time: "10:16",
      },
    ],
  },
}
