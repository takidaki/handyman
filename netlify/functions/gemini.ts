// This is a Netlify serverless function that uses the Deno runtime.
// It acts as a secure proxy to the Google Gemini API.

import { GoogleGenAI } from "https://esm.sh/@google/genai@^1.10.0";
import type { GenerateContentResponse } from "https://esm.sh/@google/genai@^1.10.0";
import type { Context } from "https://edge.netlify.com/v1/deno/ts/index.ts";

const MODEL_NAME = 'gemini-2.5-flash';
const SYSTEM_INSTRUCTION = "You are a friendly and practical DIY and home repair assistant named 'DIY Pro'. Provide clear, step-by-step instructions. Prioritize safety and suggest when to call a professional. Format your answers with clear headings (using **bold text**), bullet points (using *), and numbered lists where appropriate. Keep responses concise and easy to understand for beginners.";

// The main function handler for Netlify
export default async (req: Request, context: Context): Promise<Response> => {
  // Add CORS headers to allow requests from any origin
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Respond to preflight CORS requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  if (req.method !== 'POST') {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  // Securely access the API key from environment variables
  const API_KEY = context.env.get("API_KEY");

  if (!API_KEY) {
    // This error will be logged in the Netlify function logs
    console.error("API_KEY environment variable not set");
    return new Response(JSON.stringify({ error: "Server is not configured correctly." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const { prompt, image, mimeType } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let response: GenerateContentResponse;

    if (image && mimeType) {
      const imagePart = { inlineData: { data: image, mimeType } };
      const textPart = { text: prompt };
      response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: { parts: [textPart, imagePart] },
          config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
    } else {
      response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: prompt,
          config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
    }

    return new Response(JSON.stringify({ advice: response.text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in serverless function:", error);
    return new Response(JSON.stringify({ error: "Failed to get advice from the assistant." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};
