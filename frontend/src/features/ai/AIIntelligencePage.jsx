import React, { useState, useEffect, useRef } from 'react';
import './AIIntelligence.css';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { aiApi } from '../../services/aiApi';
import AIIntelligenceWidget from './AIIntelligenceWidget';
import {
  BrainCircuit, BookOpen, Send, Sparkles, Bot, User,
  BarChart3, Eye, ShieldCheck, Activity, Lock
} from 'lucide-react';

/* ─── Role Configuration ─────────────────────────────────────────────── */
const ROLE_CONFIG = {
  ADMIN:             { title: 'Portfolio Risk Intelligence',       desc: 'Portfolio-wide risk signals, predictive alerts, and system-wide CTMS health.',                   icon: <BarChart3 size={24} />,     badge: 'ADMIN' },
  PI:                { title: 'AI Clinical Trial Intelligence',    desc: 'Site-level compliance, recruitment trajectories, and safety risk signals.',                       icon: <BrainCircuit size={24} />,  badge: 'PRINCIPAL INVESTIGATOR' },
  COORDINATOR:       { title: 'Operational Intelligence',          desc: 'Protocol deviation alerts, query resolution risks, and visit lag signals.',                       icon: <Activity size={24} />,      badge: 'COORDINATOR' },
  MONITOR:           { title: 'Monitoring Intelligence',           desc: 'Site performance predictions and risk-based monitoring priorities.',                              icon: <Eye size={24} />,           badge: 'MONITOR' },
  ETHICS:            { title: 'Ethics Intelligence',               desc: 'Real-time safety and regulatory compliance risk signals for IEC review.',                         icon: <ShieldCheck size={24} />,   badge: 'ETHICS COMMITTEE' },
  PHARMACOVIGILANCE: { title: 'Safety Intelligence',               desc: 'Adverse event predictability, safety lag metrics, and PV risk signals.',                          icon: <ShieldCheck size={24} />,   badge: 'PHARMACOVIGILANCE' },
  REGULATOR:         { title: 'Regulatory Intelligence',           desc: 'System-wide CDSCO compliance, GCP conformance, and milestone risk overview.',                    icon: <Lock size={24} />,          badge: 'REGULATOR' },
};
const DEFAULT_CONFIG = { title: 'AI Operational Intelligence', desc: 'Data-driven operational risk signals.', icon: <BrainCircuit size={24} />, badge: 'USER' };

const SUGGESTED_QUESTIONS = [
  'What is the overall risk score of this trial?',
  'Are there any enrollment concerns I should act on?',
  'What is a protocol deviation and how serious is it?',
  'Explain what GCP means in Indian clinical trials.',
  'What are the top safety risks in this study?',
];

/* ─── Component ──────────────────────────────────────────────────────── */
const AIIntelligencePage = () => {
  const { user } = useAuth();
  const rc = ROLE_CONFIG[user?.role] || DEFAULT_CONFIG;

  const [studies, setStudies]           = useState([]);
  const [selectedStudyId, setSelected]  = useState('');
  const [loading, setLoading]           = useState(true);
  const [chatInput, setChatInput]       = useState('');
  const [chatHistory, setChatHistory]   = useState([]);
  const [isAsking, setIsAsking]         = useState(false);

  const chatEndRef = useRef(null);
  const inputRef   = useRef(null);

  /* fetch studies on mount */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await api.getStudies();
        setStudies(data);
        if (data?.length > 0) setSelected(data[0].id);
      } catch (e) {
        console.error('AI page: failed to load studies', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* reset chat when study changes */
  useEffect(() => { setChatHistory([]); setChatInput(''); }, [selectedStudyId]);

  /* auto-scroll chat */
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory, isAsking]);

  /* send message */
  const handleSend = async (e) => {
    e.preventDefault();
    const q = chatInput.trim();
    if (!q || !selectedStudyId || isAsking) return;

    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: q }]);
    setIsAsking(true);

    try {
      const res = await aiApi.askAI(selectedStudyId, q);
      setChatHistory(prev => [...prev, { role: 'ai', text: res?.answer || 'No response received.' }]);
    } catch (err) {
      const msg = err?.response?.status === 403
        ? 'You do not have permission to use the AI assistant.'
        : 'AI is temporarily unavailable. Please try again in a moment.';
      setChatHistory(prev => [...prev, { role: 'ai', text: msg, isError: true }]);
    } finally {
      setIsAsking(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  /* ── render ── */
  return (
    <div className="ai-page">

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="ai-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div className="ai-header-icon">{rc.icon}</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
              <h1 className="ai-header-title">{rc.title}</h1>
              <span className="ai-role-badge">{rc.badge}</span>
            </div>
            <p className="ai-header-desc">{rc.desc}</p>
          </div>
        </div>

        {!loading && studies.length > 0 && (
          <div className="ai-study-selector">
            <label>Study Context</label>
            <div style={{ position: 'relative' }}>
              <BookOpen size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)', pointerEvents: 'none' }} />
              <select value={selectedStudyId} onChange={e => setSelected(e.target.value)}>
                {studies.map(s => (
                  <option key={s.id} value={s.id}>{s.protocolId} — {s.title}</option>
                ))}
              </select>
              <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* ─── Body ───────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="ai-state-box">
          <div className="ai-spinner">
            <div className="ai-spinner-track" />
            <div className="ai-spinner-fill" />
          </div>
          <p className="ai-state-title" style={{ fontWeight: 500 }}>Initializing Intelligence Workspace…</p>
        </div>

      ) : studies.length === 0 ? (
        <div className="ai-state-box">
          <div className="ai-state-icon"><BrainCircuit size={32} /></div>
          <p className="ai-state-title">No Active Studies</p>
          <p className="ai-state-desc">You don't have access to any active studies. Access is governed by your role authorization.</p>
        </div>

      ) : selectedStudyId ? (
        <div className="ai-main-grid">

          {/* Left — Risk Widget */}
          <AIIntelligenceWidget studyId={selectedStudyId} />

          {/* Right — Chat Panel */}
          <div className="ai-chat-panel">

            {/* Chat Header */}
            <div className="ai-chat-header">
              <div className="ai-chat-header-icon">
                <Sparkles size={17} color="#fff" />
              </div>
              <div>
                <p className="ai-chat-header-title">Ask Trial AI</p>
                <p className="ai-chat-header-sub">
                  <span className="ai-online-dot" />
                  Powered by TrialOrbit AI · Grounded in trial data
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="ai-chat-messages">
              {chatHistory.length === 0 ? (
                <div className="ai-chat-empty">
                  <div className="ai-chat-empty-icon"><Bot size={26} /></div>
                  <p className="ai-chat-empty-title">Ask about this trial</p>
                  <p className="ai-chat-empty-desc">I can answer questions about enrollment, risk drivers, data quality, and more — grounded in live study data.</p>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button key={i} className="ai-chip-btn" onClick={() => setChatInput(q)}>{q}</button>
                  ))}
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div key={i} className={`ai-msg-row ${msg.role}`}>
                    <div className={`ai-msg-avatar ai-${msg.role === 'user' ? 'user' : 'bot'}`}>
                      {msg.role === 'ai' ? <Bot size={13} color="#fff" /> : <User size={13} color="var(--text-muted)" />}
                    </div>
                    <div className={`ai-msg-bubble ai-${msg.role === 'user' ? 'user' : msg.isError ? 'error' : 'bot'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}

              {isAsking && (
                <div className="ai-msg-row ai">
                  <div className="ai-msg-avatar ai-bot"><Bot size={13} color="#fff" /></div>
                  <div className="ai-typing">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <div key={i} className="ai-typing-dot" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="ai-chat-footer">
              <form className="ai-chat-form" onSubmit={handleSend}>
                <input
                  ref={inputRef}
                  className="ai-chat-input"
                  type="text"
                  placeholder="Ask about risk, enrollment, safety…"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  disabled={isAsking}
                />
                <button type="submit" className="ai-send-btn" disabled={!chatInput.trim() || isAsking}>
                  <Send size={15} />
                </button>
              </form>
              <p className="ai-chat-disclaimer">AI responses are grounded in trial data. Always verify before acting.</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AIIntelligencePage;
