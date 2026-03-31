// OpenRouter API service for LearnerBot
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ApiResponse {
  message: string;
  error?: string;
}

class OpenRouterApiService {
  private apiKey: string;
  private hfApiKey: string;
  private baseUrl: string = "https://openrouter.ai/api/v1";
  private siteUrl: string;
  private siteName: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";
    this.hfApiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY || "";
    this.siteUrl = import.meta.env.VITE_SITE_URL || "https://learnerbot.ai";
    this.siteName = import.meta.env.VITE_SITE_NAME || "LearnerBot AI Assistant";

    if (!this.apiKey) {
      console.warn("OpenRouter API key not found. Please set VITE_OPENROUTER_API_KEY in your .env file");
    }
    if (!this.hfApiKey) {
      console.warn("Hugging Face API key not found. Please set VITE_HUGGING_FACE_API_KEY in your .env file to enable image analysis.");
    }
  }





  async sendMessage(
    message: string,
    conversationHistory: ChatMessage[] = [],
    imageDataUrl?: string
  ): Promise<ApiResponse> {
    if (!this.apiKey) {
      return {
        message: `🌿 Hello there, botanical friend! Welcome to Plant Doctor! 

I'm your personal AI plant health expert, here to help you identify diseases, diagnose plant problems, and provide cure methods.

**To get me fully working, you'll need to:**
1. Get an API key from [OpenRouter](https://openrouter.ai)
2. Create a \`.env\` file in your project root
3. Add: \`VITE_OPENROUTER_API_KEY=your_api_key_here\`

What plant problem can I help you with today?`,
        error: "API key not configured",
      };
    }

    try {
      const systemPrompt = `You are Plant Doctor, an expert AI botanical assistant specializing in plant disease detection, diagnosis, and treatment. Your mission is to help gardeners and plant enthusiasts identify plant problems and provide effective solutions.

Your personality:
- Friendly, encouraging mentor with relevant emojis
- Patient, thorough, and positive

Your expertise:
- Identify plant diseases/pests from descriptions and images
- Provide accurate treatment (organic/chemical) and cure methods
- Advise on soil health, watering, and nutrition

When answering:
- If an image is provided, analyze it carefully for any signs of disease, pests, or nutrient deficiencies
- Ask clarifying questions about symptoms if needed
- Provide specific, actionable treatment recommendations
- Include preventive measures and use clear language

Keep responses engaging but concise. Use markdown formatting.`;

      let userContent: any = message || "I've uploaded a photo of my plant.";
      
      if (imageDataUrl) {
        userContent = [
          {
            type: "text",
            text: message || "Analyze this plant image for health issues and diseases."
          },
          {
            type: "image_url",
            image_url: {
              url: imageDataUrl
            }
          }
        ];
      }

      const messages: any[] = [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: userContent }
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "HTTP-Referer": this.siteUrl,
          "X-Title": this.siteName,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: messages,
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);

        let errorMessage = `API request failed with status ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error?.message || errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Could not parse error response:", parseError);
          errorMessage = errorText || errorMessage;
        }

        // Handle specific error cases
        if (response.status === 401) {
          errorMessage = "Invalid API key. Please check your OpenRouter API key.";
        } else if (response.status === 429) {
          errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
        } else if (response.status === 402) {
          errorMessage = "Insufficient credits. Please check your OpenRouter account balance.";
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("API Response received:", data);

      // Validate response structure
      if (!data || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        console.error("Invalid response structure:", data);
        throw new Error("Invalid response format from OpenRouter API");
      }

      const choice = data.choices[0];
      if (!choice || !choice.message || typeof choice.message.content !== 'string') {
        console.error("Invalid choice structure:", choice);
        throw new Error("Invalid message format in API response");
      }

      return {
        message: choice.message.content.trim(),
      };

    } catch (error) {
      console.error("OpenRouter API Error:", error);

      let errorMessage = "An unexpected error occurred";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Return user-friendly error messages
      const friendlyMessage = `Oops! I'm having trouble connecting to my brain right now! 🧠 

**Error:** ${errorMessage}

**Don't worry though!** Here are some things you can try:
- Check your internet connection 🌐
- Make sure your API key is valid 🔑
- Try asking me something else in a moment ⏰

I'm still excited to help you learn amazing things! 🚀✨`;

      return {
        message: friendlyMessage,
        error: errorMessage,
      };
    }
  }

  // Test the API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.sendMessage("Hello, are you working?");
      return !response.error;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }

  // Get available models
  async getAvailableModels(): Promise<any[]> {
    if (!this.apiKey) {
      console.warn("No API key available for fetching models");
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "HTTP-Referer": this.siteUrl,
          "X-Title": this.siteName,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching models:", error);
      return [];
    }
  }
}

export const apiService = new OpenRouterApiService();