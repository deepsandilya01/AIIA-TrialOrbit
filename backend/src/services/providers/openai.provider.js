import env from '../../config/env.js';

class OpenAIProvider {
  constructor() {
    this.apiKey = process.env.AI_API_KEY || '';
    this.model = process.env.AI_MODEL || 'gpt-4o-mini';
  }

  async generateExplanation(systemPrompt, userPrompt) {
    if (!this.apiKey) {
      throw new Error("OpenAI API key not initialized.");
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const err = new Error(`OpenAI API error: ${response.statusText}`);
        err.status = response.status;
        throw err;
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      const newErr = new Error(`OpenAI API Error: ${error.message}`);
      if (error.status) newErr.status = error.status;
      throw newErr;
    }
  }
}

export default new OpenAIProvider();
