"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Bold, Italic, Code2, Link, Heading1, Heading2, ImageIcon } from "lucide-react"
import { processWithAI } from "@/lib/ai-service"

interface FloatingToolbarProps {
  position: { top: number; left: number }
  selectedText: string
  onClose: () => void
  onFormatText: (formattedText: string, format: string) => void
}

export default function FloatingToolbar({ position, selectedText, onClose, onFormatText }: FloatingToolbarProps) {
  const [showAIOptions, setShowAIOptions] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingOption, setProcessingOption] = useState<string | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const aiOptionsRef = useRef<HTMLDivElement>(null)

  const aiOptions = [
    { id: "rephrase", label: "Rephrase" },
    { id: "grammar", label: "Fix Grammar" },
    { id: "summarize", label: "Summarize" },
    { id: "formal", label: "Formal Tone" },
    { id: "friendly", label: "Friendly Tone" },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node) &&
        aiOptionsRef.current &&
        !aiOptionsRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const handleAIOption = async (option: string) => {
    if (!selectedText.trim()) return

    setIsProcessing(true)
    setProcessingOption(option)

    try {
      const result = await processWithAI(selectedText, option)
      onFormatText(result.result, option)
      setShowAIOptions(false)
    } catch (error) {
      console.error("Error processing with AI:", error)
    } finally {
      setIsProcessing(false)
      setProcessingOption(null)
    }
  }

  const handleFormat = (format: string) => {
    let formattedText = selectedText

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        break
      case "italic":
        formattedText = `*${selectedText}*`
        break
      case "code":
        formattedText = `\`${selectedText}\``
        break
      case "link":
        formattedText = `[${selectedText}](url)`
        break
      case "h1":
        formattedText = `# ${selectedText}`
        break
      case "h2":
        formattedText = `## ${selectedText}`
        break
      default:
        break
    }

    onFormatText(formattedText, format)
  }

  return (
    <>
      <div
        ref={toolbarRef}
        className="absolute z-50 bg-white rounded-md shadow-md flex items-center p-1 border border-gray-200"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: "translate(-50%, -100%)",
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          className={`p-1.5 h-8 w-8 ${showAIOptions ? "bg-blue-100" : ""}`}
          onClick={() => setShowAIOptions(!showAIOptions)}
        >
          <Sparkles className="h-4 w-4 text-blue-600" />
        </Button>
        <div className="w-px h-5 bg-gray-200 mx-1"></div>
        <Button variant="ghost" size="sm" className="p-1.5 h-8 w-8" onClick={() => handleFormat("bold")}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="p-1.5 h-8 w-8" onClick={() => handleFormat("italic")}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="p-1.5 h-8 w-8" onClick={() => handleFormat("code")}>
          <Code2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="p-1.5 h-8 w-8" onClick={() => handleFormat("link")}>
          <Link className="h-4 w-4" />
        </Button>
        <div className="w-px h-5 bg-gray-200 mx-1"></div>
        <Button variant="ghost" size="sm" className="p-1.5 h-8 w-8" onClick={() => handleFormat("h1")}>
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="p-1.5 h-8 w-8" onClick={() => handleFormat("h2")}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="p-1.5 h-8 w-8">
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>

      {showAIOptions && (
        <div
          ref={aiOptionsRef}
          className="absolute z-50 bg-white rounded-md shadow-md p-1 border border-gray-200 w-48"
          style={{
            top: `${position.top - 40}px`,
            left: `${position.left}px`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="py-1">
            {aiOptions.map((option) => (
              <Button
                key={option.id}
                variant="ghost"
                size="sm"
                className="flex items-center justify-start w-full h-9 px-3 hover:bg-blue-50"
                onClick={() => handleAIOption(option.id)}
                disabled={isProcessing}
              >
                {isProcessing && processingOption === option.id ? (
                  <div className="h-4 w-4 mr-2 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                ) : (
                  <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
                )}
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
