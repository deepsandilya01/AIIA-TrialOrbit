import env from '../config/env.js';
import mistralProvider from './providers/mistral.provider.js';
import openaiProvider from './providers/openai.provider.js';

class AIProviderFactory {
  constructor() {
    this.providerName = process.env.AI_PROVIDER || 'mistral';
  }

  getProvider() {
    switch (this.providerName.toLowerCase()) {
      case 'mistral':
        return mistralProvider;
      case 'openai':
        return openaiProvider;
      default:
        console.warn(`Unsupported AI_PROVIDER: ${this.providerName}. Falling back to Mistral.`);
        return mistralProvider;
    }
  }

  async generateExplanation(systemPrompt, userPrompt) {
    const provider = this.getProvider();
    return await provider.generateExplanation(systemPrompt, userPrompt);
  }

  async chat(systemPrompt, userPrompt) {
    const provider = this.getProvider();
    if (!provider.chat) {
      throw new Error(`Chat not supported by provider ${this.providerName}`);
    }
    return await provider.chat(systemPrompt, userPrompt);
  }
}

export default new AIProviderFactory();
