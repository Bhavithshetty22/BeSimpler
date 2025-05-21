"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { WifiOff, Sparkles, AlertTriangle, Settings } from "lucide-react"
import { AI_CONFIG } from "@/lib/ai-config"

interface AIModeToggleProps {
  hasError?: boolean
  onConfigureAI?: () => void
}

export default function AIModeToggle({ hasError = false, onConfigureAI }: AIModeToggleProps) {
  const [isOffline, setIsOffline] = useState(AI_CONFIG.useOfflineMode)

  useEffect(() => {
    // Update the config when the toggle changes
    AI_CONFIG.useOfflineMode = isOffline
    // Also update the provider to match the mode
    AI_CONFIG.api.provider = isOffline ? "mock" : "gemini"
  }, [isOffline])

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 text-xs ${
          isOffline ? "text-gray-500" : hasError ? "text-amber-500" : "text-green-600"
        }`}
        onClick={() => setIsOffline(!isOffline)}
        title={
          isOffline
            ? "Switch to online mode (use Gemini API)"
            : hasError
              ? "API error occurred, using fallback responses"
              : "Switch to offline mode (use local responses)"
        }
      >
        {isOffline ? (
          <>
            <WifiOff className="h-3 w-3" /> Offline Mode
          </>
        ) : hasError ? (
          <>
            <AlertTriangle className="h-3 w-3" /> API Error
          </>
        ) : (
          <>
            <Sparkles className="h-3 w-3" /> Gemini API
          </>
        )}
      </Button>
      {onConfigureAI && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-gray-500"
          onClick={onConfigureAI}
          title="Configure AI settings"
        >
          <Settings className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
