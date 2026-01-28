
import { GoogleGenAI } from "@google/genai";
import { AspectRatio, GemModel } from "../types";

// 1. General Chat / Fast Response
export const generateChatResponse = async (
  prompt: string, 
  history: {role: string, parts: {text: string}[]}[],
  useFastModel: boolean = false
): Promise<string> => {
  try {
    // Always instantiate GoogleGenAI right before making an API call to ensure use of the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
    const modelId = useFastModel ? GemModel.FAST : GemModel.CHAT;
    
    // Use generateContent with model name and contents for text-based tasks.
    const response = await ai.models.generateContent({
        model: modelId,
        contents: [
            ...history.map(h => ({ role: h.role, parts: h.parts })),
            { role: 'user', parts: [{ text: prompt }] }
        ]
    });
    // Extract text from GenerateContentResponse using the .text property.
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

// 2. Search Grounding
export const generateSearchResponse = async (prompt: string): Promise<{text: string, sources: {uri: string, title: string}[]}> => {
    try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: GemModel.SEARCH,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        // Extract grounding sources from groundingChunks when using Google Search tool.
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
            ?.map((chunk: any) => chunk.web)
            .filter((web: any) => web)
            .map((web: any) => ({ uri: web.uri, title: web.title })) || [];

        return {
            text: response.text || "I found some information.",
            sources
        };
    } catch (error) {
        console.error("Gemini Search Error:", error);
        throw error;
    }
};

// 3. Image Generation
export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: GemModel.IMAGE,
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: "1K" // Defaulting to 1K resolution for gemini-3-pro-image-preview
        }
      },
    });

    // Iterate through candidates and parts to find the image data.
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned.");
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};

// 4. Audio Transcription
export const transcribeAudio = async (base64Audio: string, mimeType: string = 'audio/wav'): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: GemModel.AUDIO,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio
            }
          },
          {
            text: "Please transcribe this audio accurately."
          }
        ]
      }
    });
    return response.text || "Could not transcribe audio.";
  } catch (error) {
    console.error("Gemini Audio Error:", error);
    throw error;
  }
};
// 5. Spatial Discovery (Native Spatial Agentic)
export const generateSpatialDiscovery = async (prompt: string, imageBase64?: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
    const modelId = imageBase64 ? GemModel.CHAT : GemModel.CHAT; // Both support multimodal
    
    const parts: any[] = [{ text: `You are the AI Native Spatial Agentic for WSP Stream. 
    Your goal is to discover movies, TV shows, and anime based on visual or textual context.
    Context: ${prompt}` }];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64
        }
      });
    }

    const response = await ai.models.generateContent({
        model: modelId,
        contents: [{ role: 'user', parts }]
    });
    
    return response.text || "I couldn't identify any specific media from this context.";
  } catch (error) {
    console.error("Spatial Discovery Error:", error);
    throw error;
  }
};
