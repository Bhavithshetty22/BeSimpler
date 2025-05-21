"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface TextFormatPopupProps {
  position: { top: number; left: number }
  onClose: () => void
  onSelectOption: (option: string) => void
  isProcessing: boolean
  processingOption: string | null
}

export default function TextFormatPopup({
  position,
  onClose,
  onSelectOption,
  isProcessing,
  processingOption,
}: TextFormatPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)

  const options = [
    { id: "rephrase", label: "Rephrase" },
    { id: "tone", label: "My tone of voice" },
    { id: "friendly", label: "More friendly" },
    { id: "formal", label: "More formal" },
    { id: "grammar", label: "Fix grammar & spelling" },
    { id: "translate", label: "Translate..." },
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
      }}
    >
      <div className="flex flex-col gap-1 w-64">
        {options.map((option) => (
          <Button
            key={option.id}
            variant="ghost"
            size="sm"
            className="flex items-center justify-start w-full h-10 px-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
            onClick={() => onSelectOption(option.id)}
            disabled={isProcessing}
          >
            {isProcessing && processingOption === option.id ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              option.label
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
