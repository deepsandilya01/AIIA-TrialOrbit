import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiProvider {
  constructor() {
    this.apiKey = process.env.AI_API_KEY || '';
    this.model = process.env.AI_MODEL || 'gemini-3.8-flash';
    
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  async generateExplanation(systemPrompt, userPrompt) {
    if (!this.genAI) throw new Error('Gemini client not initialized. Missing API key.');

    try {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        }
      });

      const result = await model.generateContent(userPrompt);
      const text = result.response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('[GeminiProvider] generateExplanation Error:', error.message);
      throw error;
    }
  }

  async chat(systemPrompt, userPrompt) {
    if (!this.genAI) throw new Error('Gemini client not initialized. Missing API key.');

    try {
      const model = this.genAI.getGenerativeModel({
        model: this.model,
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: 0.45,
          maxOutputTokens: 1024,
        }
      });

      const result = await model.generateContent(userPrompt);
      return result.response.text();
    } catch (error) {
      console.error('[GeminiProvider] chat Error:', error.message);
      throw error;
    }
  }
}

export default new GeminiProvider();
