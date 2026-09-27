import { Mistral } from '@mistralai/mistralai';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * MistralProvider
 * ───────────────
 * Wraps @mistralai/mistralai with:
 *  - A global serial request queue (guarantees ≥ 2s between calls on the free tier)
 *  - Automatic retry with exponential backoff on 429 / 503
 */
class MistralProvider {
  constructor() {
    this.apiKey = process.env.AI_API_KEY || '';
    this.model  = process.env.AI_MODEL  || 'mistral-small-latest';

    if (this.apiKey) {
      this.client = new Mistral({ apiKey: this.apiKey });
    }

    // Serial queue: ensures only one Mistral call runs at a time
    // and enforces a minimum gap between consecutive calls.
    this._queue      = Promise.resolve();
    this._minGapMs   = 2500; // free tier: 1 req/sec → we use 2.5s to be safe
    this._lastCallAt = 0;
  }

  /** Serialise all API calls through a single promise chain */
  _enqueue(fn) {
    this._queue = this._queue.then(async () => {
      const now   = Date.now();
      const since = now - this._lastCallAt;
      if (since < this._minGapMs) {
        await sleep(this._minGapMs - since);
      }
      this._lastCallAt = Date.now();
      return fn();
    });
    return this._queue;
  }

  /** Retry wrapper — retries on 429 / 503 with exponential back-off */
  async _withRetry(fn, maxRetries = 3) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        const msg = err.message || '';
        const isRateLimit = msg.includes('429') || msg.includes('rate_limited') || msg.includes('Rate limit') || err.status === 429;
        const isServerErr = msg.includes('503') || msg.includes('overloaded') || err.status === 503;

        if (isRateLimit) {
           // Immediately fallback for rate limits, don't stall the UI
           console.warn(`[Mistral] Rate limited (429). Bypassing retry to use deterministic fallback.`);
           throw err;
        }

        if (isServerErr && attempt < maxRetries) {
          const delay = 1500 * Math.pow(2, attempt - 1);
          console.warn(`[Mistral] Provider overloaded (503). Retrying in ${delay / 1000}s…`);
          await sleep(delay);
          lastError = err;
        } else {
          throw err;
        }
      }
    }
    throw lastError;
  }

  /** Generate a structured JSON explanation */
  async generateExplanation(systemPrompt, userPrompt) {
    if (!this.client) throw new Error('Mistral client not initialized. Missing API key.');

    return this._enqueue(() =>
      this._withRetry(async () => {
        const response = await this.client.chat.complete({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: userPrompt   },
          ],
          temperature: 0.2,
          responseFormat: { type: 'json_object' },
        });

        const content = response.choices[0].message.content;
        try {
          return JSON.parse(content);
        } catch {
          throw new Error('Mistral returned non-JSON response for explanation');
        }
      })
    );
  }

  /** Conversational chat — plain text response */
  async chat(systemPrompt, userPrompt) {
    if (!this.client) throw new Error('Mistral client not initialized. Missing API key.');

    return this._enqueue(() =>
      this._withRetry(async () => {
        const response = await this.client.chat.complete({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: userPrompt   },
          ],
          temperature: 0.45,
          maxTokens:   1024,
        });

        return response.choices[0].message.content;
      })
    );
  }
}

export default new MistralProvider();
