// AI Configuration
export const AI_CONFIG = {
  // Set to true to use offline mode by default (more reliable)
  useOfflineMode: true,

  // API settings
  api: {
    // Available providers: 'openai', 'deepseek', 'gemini', 'mock'
    provider: "mock",

    // API endpoints
    endpoints: {
      openai: "https://api.openai.com/v1/chat/completions",
      deepseek: "https://api.deepinfra.com/v1/openai/chat/completions",
      // Try a completely different endpoint format for Gemini
      gemini: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent",
    },

    // Default models
    models: {
      openai: "gpt-3.5-turbo",
      deepseek: "deepseek-coder",
      gemini: "gemini-1.5-pro-latest", // Try a different model version
    },

    // API keys
    keys: {
      gemini: "AIzaSyBuz2CEYmqXLIVojUiSzRN-LzCJBXJ9dwM",
    },
  },

  // Mock response delay in ms (to simulate network latency)
  mockDelay: 800,
}
