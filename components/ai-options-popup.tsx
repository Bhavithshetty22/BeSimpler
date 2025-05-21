"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Heart, BookText, CheckCircle, Languages, FileText, Loader2 } from "lucide-react"

interface AiOptionsPopupProps {
  position: { top: number; left: number }
  onClose: () => void
  onSelectOption: (option: string) => void
  isProcessing: boolean
  processingOption: string | null
}

export default function AiOptionsPopup({
  position,
  onClose,
  onSelectOption,
  isProcessing,
  processingOption,
}: AiOptionsPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)

  const options = [
    { id: "rephrase", label: "Rephrase", icon: RefreshCw },
    { id: "friendly", label: "Make it friendlier", icon: Heart },
    { id: "formal", label: "Make it more formal", icon: BookText },
    { id: "grammar", label: "Fix grammar", icon: CheckCircle },
    { id: "translate", label: "Translate", icon: Languages },
    { id: "summarize", label: "Summarize", icon: FileText },
  ]

  useEffect(() => {
    // Function to handle clicks outside the popup
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      ref={popupRef}
      className="absolute z-10 bg-white rounded-lg shadow-lg p-2 border"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%)",
      }}
    >
      <div className="flex flex-wrap gap-1 w-64">
        {options.map((option) => (
          <Button
            key={option.id}
            variant="outline"
            size="sm"
            className="flex items-center justify-start w-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
            onClick={() => onSelectOption(option.id)}
            disabled={isProcessing}
          >
            {isProcessing && processingOption === option.id ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <option.icon className="h-4 w-4 mr-2" />
            )}
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
