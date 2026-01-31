
import { GoogleGenAI, Type } from "@google/genai";

export const getGeminiResponse = async (prompt: string, context?: string) => {
  const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{
          text: `
            You are MFITIA, an advanced AI assistant for professional personal trainers.
            User prompt: ${prompt}
            ${context ? `Additional Context: ${context}` : ''}
            Provide concise, professional fitness advice in Portuguese.
          `
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1000,
      }
    });

    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, tive um problema ao processar sua solicitação. Tente novamente mais tarde.";
  }
};
