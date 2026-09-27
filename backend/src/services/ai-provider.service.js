import env from '../config/env.js';
import mistralProvider from './providers/mistral.provider.js';
import openaiProvider from './providers/openai.provider.js';
import geminiProvider from './providers/gemini.provider.js';

class AIProviderFactory {
  constructor() {
    this.providerName = process.env.AI_PROVIDER || 'mistral';
  }

  getProvider() {
    switch (this.providerName.toLowerCase()) {
      case 'gemini':
        return geminiProvider;
      case 'mistral':
        return mistralProvider;
      case 'openai':
        return openaiProvider;
      default:
        console.warn(`Unsupported AI_PROVIDER: ${this.providerName}. Falling back to Mistral.`);
        return mistralProvider;
    }
  }

  async generateExplanationWithFallback(systemPrompt, userPrompt) {
    let lastError;
    const primary = this.providerName.toLowerCase();
    const secondary = primary === 'mistral' ? 'gemini' : (primary === 'gemini' ? 'mistral' : 'gemini');

    const getProviderInstance = (name) => {
      if (name === 'gemini') return geminiProvider;
      if (name === 'mistral') return mistralProvider;
      if (name === 'openai') return openaiProvider;
      return null;
    };

    const providersToTry = [
      { name: primary, instance: getProviderInstance(primary) },
      { name: secondary, instance: getProviderInstance(secondary) }
    ];

    for (const p of providersToTry) {
      if (!p.instance) continue;
      try {
        // If API key is empty, the provider usually throws instantly
        const explanation = await p.instance.generateExplanation(systemPrompt, userPrompt);
        return { explanation, provider: p.name };
      } catch (error) {
        console.warn(`[AIProviderFactory] ${p.name} failed: ${error.message}`);
        lastError = error;
      }
    }
    throw lastError;
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
