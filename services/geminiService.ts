
import { GoogleGenAI } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = "You are a friendly and practical DIY and home repair assistant named 'DIY Pro'. Provide clear, step-by-step instructions. Prioritize safety and suggest when to call a professional. Format your answers with clear headings (using **bold text**), bullet points (using *), and numbered lists where appropriate. Keep responses concise and easy to understand for beginners.";

// Helper function to convert a File object to a GoogleGenerativeAI.Part
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  const base64EncodedData = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}


export const getAdviceForText = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating text response:", error);
    return "Sorry, I couldn't get advice for that. Please try again.";
  }
};

export const getAdviceForImage = async (prompt: string, image: File): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(image);
    const textPart = { text: prompt };
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: { parts: [textPart, imagePart] },
        config: {
            systemInstruction: SYSTEM_INSTRUCTION
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating image response:", error);
    return "Sorry, I had trouble analyzing the image. Please try again.";
  }
};
