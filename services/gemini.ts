
import { GoogleGenAI, Type } from "@google/genai";

export const getGeminiResponse = async (prompt: string, context?: string) => {
  // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  try {
    /*
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are MFITIA, an advanced AI assistant for professional personal trainers.
        User prompt: ${prompt}
        ${context ? `Additional Context: ${context}` : ''}
        Provide concise, professional fitness advice in Portuguese.
      `,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1000,
      }
    });

    return response.text;
    */
    return "Serviço temporariamente desativado.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, tive um problema ao processar sua solicitação. Tente novamente mais tarde.";
  }
};
