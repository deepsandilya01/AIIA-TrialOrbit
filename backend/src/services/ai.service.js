import env from '../config/env.js';
import AuditLog from '../models/AuditLog.js';
import riskEngine from './risk-engine.service.js';
import aiProviderFactory from './ai-provider.service.js';

class AIService {
  constructor() {
    this.promptVersion = "trialorbit-ai-v2";
    this.enabled = process.env.AI_ENABLED === 'true';
  }

  async _checkIDOR(studyId, user) {
    if (user.role === 'ADMIN' || user.role === 'REGULATOR') return;

    const Study = (await import('../models/Study.js')).default;
    const study = await Study.findById(studyId);
    if (!study) {
      const error = new Error('Study not found');
      error.status = 404;
      throw error;
    }

    if (user.role === 'PI' && study.pi_id.toString() !== user.id) {
      const error = new Error('Forbidden: User does not have access to this study');
      error.status = 403;
      throw error;
    }
  }

  async getStudyOverview(studyId, user) {
    await this._checkIDOR(studyId, user);
    // Deterministic intelligence analysis
    const deterministicAnalysis = await riskEngine.calculateOverallStudyRisk(studyId);
    
    await this._logAIAudit(user, 'AI_QUERY', studyId, 'deterministic');

    return deterministicAnalysis;
  }

  async generateExplanation(studyId, user) {
    await this._checkIDOR(studyId, user);
    // 1. Gather the deterministic facts first
    const analysis = await riskEngine.calculateOverallStudyRisk(studyId);
    
    // 2. Log that an explanation was requested
    await this._logAIAudit(user, 'AI_QUERY', studyId, 'llm');

    // 3. Check if AI is enabled
    if (!this.enabled) {
      return {
        aiAvailable: false,
        explanationStatus: "UNAVAILABLE",
        deterministicAnalysis: analysis,
        explanation: null
      };
    }

    // 4. Construct safe prompt without PII
    const prompt = this._buildPrompt(analysis);
    const systemPrompt = this._getSystemPrompt();

    // 5. Call LLM Provider
    try {
      const explanation = await aiProviderFactory.generateExplanation(systemPrompt, prompt);
      
      // Basic validation of structured output
      if (!explanation || !explanation.summary) {
        throw new Error("Invalid structured output from AI provider");
      }

      return {
        aiAvailable: true,
        explanationStatus: "SUCCESS",
        explanation,
        promptVersion: this.promptVersion
      };
    } catch (error) {
      console.error("AI Provider Error:", error.message);
      const msg = error.message || '';
      const isRateLimit = msg.includes('429') || msg.includes('rate_limited') || msg.includes('Rate limit') || error.status === 429;
      
      return {
        aiAvailable: false,
        explanationStatus: isRateLimit ? "RATE_LIMITED" : "UNAVAILABLE",
        deterministicAnalysis: analysis,
        explanation: null
      };
    }
  }

  async askAI(studyId, question, user) {
    console.log(`[askAI] studyId=${studyId}, user.role=${user?.role}`);
    await this._checkIDOR(studyId, user);

    const analysis = await riskEngine.calculateOverallStudyRisk(studyId);
    await this._logAIAudit(user, 'AI_ASK', studyId, 'chat');

    if (!this.enabled) {
      return { answer: 'AI explanations are currently disabled. The deterministic risk analysis above is still available.' };
    }

    const context = this._buildChatContext(analysis);
    const systemPrompt = this._getChatSystemPrompt(context, user.role);

    try {
      const answer = await aiProviderFactory.chat(systemPrompt, question);
      console.log('[askAI] Got response from AI provider.');
      return { answer };
    } catch (error) {
      const msg = error.message || '';
      console.error('[askAI] AI Provider Chat Error:', msg);
      const isRateLimit = msg.includes('429') || msg.includes('rate_limited') || msg.includes('Rate limit');
      return {
        answer: isRateLimit
          ? 'Mistral AI is currently rate-limited (free tier quota). Please wait 30–60 seconds and try again. The risk analysis data above is accurate and always available.'
          : 'I am temporarily unavailable due to an AI provider issue. Please try again in a moment.'
      };
    }
  }

  _getSystemPrompt() {
    return `You are an operational clinical-trial intelligence assistant for AIIA TrialOrbit.

Your task is to explain structured operational risk information supplied by the TrialOrbit risk engine.

Rules:

1. Use ONLY the supplied structured data.
2. Never invent facts.
3. Never invent metrics.
4. Never provide diagnosis.
5. Never recommend treatment.
6. Never make autonomous clinical decisions.
7. Never determine causality.
8. Never override PI, Ethics Committee, Pharmacovigilance Officer, Monitor, Coordinator or Regulator decisions.
9. Clearly state when data is insufficient.
10. Provide operational observations and review suggestions only.
11. Keep explanations concise and evidence-linked.
12. Do not expose personal identifiers.
13. Do not claim regulatory compliance unless explicitly present in supplied data.

Return ONLY the requested structured response.`;
  }

  /**
   * Builds the full system prompt for conversational AI chat.
   * Handles BOTH general clinical-trial knowledge questions AND
   * study-specific questions grounded in live risk data.
   */
  _getChatSystemPrompt(studyContext, userRole) {
    return `You are TrialOrbit AI, an expert clinical trial operations assistant embedded in AIIA TrialOrbit — a Smart India Hackathon 2026 CTMS built for Indian clinical research under CDSCO, ICMR, and Schedule Y guidelines.

You have two modes of answering:

## MODE 1 — GENERAL KNOWLEDGE
When the user asks general questions about clinical trials, regulations, terminology, or best practices (e.g. "What is GCP?", "Explain protocol deviation", "What is an SAE?", "How does IPSCTM work?", "What is ICH E6?"), answer clearly and accurately using your clinical research knowledge. Be educational, concise, and relevant to the Indian regulatory context.

## MODE 2 — STUDY-SPECIFIC ANALYSIS
When the user asks about THIS specific trial's data, metrics, risks, or performance (e.g. "What is the risk score?", "How is enrollment going?", "Are there any safety concerns?"), answer using ONLY the live study data provided below. Do not invent metrics.

## LIVE STUDY DATA (deterministic, real-time):
${studyContext}

## YOUR IDENTITY & ROLE:
- You assist users with the role: ${userRole}
- You operate under CDSCO, Schedule Y, ICH GCP E6(R2), and ICMR ethical guidelines
- You are a tool for operational support — NOT a regulatory authority, clinician, or decision-maker

## ABSOLUTE RULES (never violate):
1. Never invent study metrics — if asking about this trial, use only the data above
2. Never provide individual patient diagnoses or treatment recommendations
3. Never override or contradict PI, Ethics Committee, or Regulator decisions
4. Never expose or guess patient identifiers
5. Never claim regulatory approval on behalf of the system
6. If unsure, say so clearly and recommend consulting the appropriate authority
7. Keep responses concise — max 4–5 sentences unless the user asks for detail
8. Always respond in plain English (not JSON, not markdown)

You are helpful, professional, and operationally focused. Respond directly to what was asked.`;
  }

  _buildChatContext(analysis) {
    const c = analysis.components;
    return `- Overall Risk Score: ${analysis.overallRiskScore}/100 (${analysis.overallRiskLevel} RISK)
- Top Drivers: ${analysis.topDrivers.join('; ')}
- Enrollment: ${c.enrollment.riskLevel} risk (${(c.enrollment.progress || 0).toFixed(1)}% enrolled)
- Sites: ${c.site.riskLevel} risk (${c.site.metrics.inactiveCount} inactive, ${c.site.metrics.lowEnrollingCount} with zero enrollment)
- Data Quality: ${c.dataQuality.riskLevel} risk (${c.dataQuality.metrics.openQueries} open queries, ${c.dataQuality.metrics.highSevQueries} high-severity)
- Protocol Deviations: ${c.deviations.riskLevel} risk (${c.deviations.metrics.openDeviations} open, ${c.deviations.metrics.majorDeviations} major)
- Safety: ${c.safety.riskLevel} risk (${c.safety.metrics.seriousAEs} serious AEs, ${c.safety.metrics.unresolvedAEs} unresolved)
- Regulatory Milestones: ${c.regulatory.riskLevel} risk (${c.regulatory.metrics.overdueCount} overdue milestones)`;
  }

  _buildPrompt(analysis) {
    return `
STUDY OPERATIONAL RISK DATA:
Overall Risk Score: ${analysis.overallRiskScore}/100
Overall Risk Level: ${analysis.overallRiskLevel}

DRIVERS:
${analysis.topDrivers.join('\n')}

COMPONENTS:
- Enrollment Risk: ${analysis.components.enrollment.riskLevel} (${analysis.components.enrollment.progress.toFixed(1)}% progress)
- Site Risk: ${analysis.components.site.riskLevel} (${analysis.components.site.metrics.inactiveCount} inactive, ${analysis.components.site.metrics.lowEnrollingCount} zero enrollment)
- Data Quality Risk: ${analysis.components.dataQuality.riskLevel} (${analysis.components.dataQuality.metrics.openQueries} open queries, ${analysis.components.dataQuality.metrics.highSevQueries} high severity)
- Protocol Deviations: ${analysis.components.deviations.riskLevel} (${analysis.components.deviations.metrics.openDeviations} open, ${analysis.components.deviations.metrics.majorDeviations} major)
- Safety Risk: ${analysis.components.safety.riskLevel} (${analysis.components.safety.metrics.seriousAEs} serious SAEs, ${analysis.components.safety.metrics.unresolvedAEs} unresolved AEs)
- Regulatory Risk: ${analysis.components.regulatory.riskLevel} (${analysis.components.regulatory.metrics.overdueCount} overdue milestones)

Respond strictly in JSON format matching this schema:
{
  "summary": "...",
  "keyDrivers": [ "...", "..." ],
  "operationalActions": [ "...", "..." ],
  "limitations": [ "..." ]
}
    `;
  }

  async _logAIAudit(user, action, studyId, type) {
    try {
      await AuditLog.create({
        actorId: user.id || user._id,
        actorRole: user.role,
        action: action,
        entityType: 'Study',
        entityId: studyId.toString(),
        reason: `User initiated safe AI query (${type}) for study ${studyId}`
      });
    } catch (logErr) {
      // Non-blocking — audit failure must not break AI response
      console.warn('AI audit log failed (non-blocking):', logErr.message);
    }
  }
}

export default new AIService();
