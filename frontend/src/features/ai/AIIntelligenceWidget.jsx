import React, { useState, useEffect } from 'react';
import './AIIntelligence.css';
import { aiApi } from '../../services/aiApi';
import {
  Sparkles, AlertTriangle, RefreshCw, Activity,
  ShieldAlert, BookOpen, MapPin, Database, ExternalLink, TrendingUp
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useNavigate, useLocation } from 'react-router-dom';

/* ─── Risk level styles (using CSS var tokens) ───────────────────────── */
const RISK = {
  CRITICAL: { text: '#b91c1c', bg: '#fef2f2', border: '#fecaca', dot: '#ef4444' },
  HIGH:     { text: '#c2410c', bg: '#fff7ed', border: '#fed7aa', dot: '#f97316' },
  MEDIUM:   { text: '#b45309', bg: '#fefce8', border: '#fde68a', dot: '#eab308' },
  LOW:      { text: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', dot: '#22c55e' },
};

const getRisk = (lvl) => RISK[lvl] || { text: 'var(--text-secondary)', bg: 'var(--bg-secondary)', border: 'var(--border-color)', dot: 'var(--text-muted)' };

/* ─── Component meta ─────────────────────────────────────────────────── */
const COMPONENTS = [
  { key: 'enrollment',   label: 'Enrollment',   Icon: TrendingUp  },
  { key: 'dataQuality',  label: 'Data Quality', Icon: Database    },
  { key: 'safety',       label: 'Safety',       Icon: Activity    },
  { key: 'site',         label: 'Sites',        Icon: MapPin      },
  { key: 'deviations',   label: 'Deviations',   Icon: ShieldAlert },
  { key: 'regulatory',   label: 'Regulatory',   Icon: BookOpen    },
];

/* ─── Component ──────────────────────────────────────────────────────── */
const AIIntelligenceWidget = ({ studyId }) => {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [explanation,   setExp]     = useState(null);
  const [explaining, setExplaining] = useState(false);
  const [expError,   setExpError]   = useState(null);

  const navigate  = useNavigate();
  const location  = useLocation();
  const isDedicated = location.pathname.includes('/ai-intelligence');

  const fetchData = async () => {
    try {
      setLoading(true); setError(null);
      setData(await aiApi.getStudyIntelligence(studyId));
    } catch { setError('Unable to load AI intelligence. Please refresh.'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { if (studyId) fetchData(); }, [studyId]);

  const handleExplain = async () => {
    try {
      setExplaining(true); setExpError(null);
      setExp(await aiApi.generateAIExplanation(studyId));
    } catch { setExpError('AI explanation temporarily unavailable.'); }
    finally  { setExplaining(false); }
  };

  /* ── Loading ── */
  if (loading && !data) {
    return (
      <div className="ai-state-box" style={{ minHeight: 260 }}>
        <div className="ai-spinner">
          <div className="ai-spinner-track" />
          <div className="ai-spinner-fill" />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Analyzing study data…</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error && !data) {
    return (
      <div className="ai-error-box" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 18px' }}>
        <AlertTriangle size={18} /> {error}
      </div>
    );
  }

  if (!data) return null;

  const risk = getRisk(data.overallRiskLevel);
  const scoreColor = data.overallRiskScore > 60 ? '#ef4444' : data.overallRiskScore > 35 ? '#f97316' : '#22c55e';
  const circumference = 2 * Math.PI * 40; // r=40
  const dash = `${(data.overallRiskScore / 100) * circumference} ${circumference}`;

  return (
    <div className="ai-widget-card">
      <div className="ai-widget-accent-bar" />

      {/* ── Widget Header ── */}
      <div className="ai-widget-header">
        <div>
          <h2 className="ai-widget-title">
            <Sparkles size={16} color="var(--accent-color)" />
            AI Clinical Trial Intelligence
          </h2>
          <p className="ai-widget-meta">
            Deterministic risk analysis ·{' '}
            {new Date(data.generatedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isDedicated && (
            <button className="ai-icon-btn" onClick={() => navigate('/ai-intelligence')}>
              Full Workspace <ExternalLink size={11} />
            </button>
          )}
          <button
            className="ai-icon-btn"
            onClick={fetchData}
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw size={13} style={loading ? { animation: 'aiSpin 1s linear infinite' } : {}} />
          </button>
        </div>
      </div>

      {/* ── Score + Components ── */}
      <div className="ai-widget-grid">

        {/* Donut */}
        <div className="ai-score-section">
          <p className="ai-score-label">Overall Operational Risk</p>
          <div style={{ position: 'relative', width: 110, height: 110 }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border-color)" strokeWidth="12" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke={scoreColor} strokeWidth="12"
                strokeDasharray={dash} strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{data.overallRiskScore}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
            </div>
          </div>
          <div className="ai-risk-badge" style={{ background: risk.bg, color: risk.text, borderColor: risk.border }}>
            {data.overallRiskLevel} RISK
          </div>
          <p className="ai-methodology">{data.methodologyVersion}</p>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Component Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {COMPONENTS.map(({ key, label, Icon }) => {
              const comp = data.components[key];
              if (!comp) return null;
              const s = getRisk(comp.riskLevel);
              return (
                <span key={key} className="ai-component-badge" style={{ background: s.bg, color: s.text, borderColor: s.border }}>
                  <Icon size={11} />
                  {label}
                </span>
              );
            })}
          </div>

          {/* Drivers */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <AlertTriangle size={13} color="var(--warning)" /> Top Risk Drivers
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {data.topDrivers.map((d, i) => (
                <div key={i} className="ai-driver-item">
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--warning)', marginTop: 5, flexShrink: 0 }} />
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Explanation ── */}
      <div style={{ padding: '18px 22px 22px', borderTop: '1px solid var(--border-subtle)', marginTop: 18 }}>
        {explanation ? (
          <div className="ai-explanation-box">
            <div className="ai-explanation-header">
              <Sparkles size={14} /> {explanation.explanationStatus === 'DETERMINISTIC_FALLBACK' ? 'Operational Analysis' : 'AI-Assisted Explanation'}
            </div>
            {['SUCCESS', 'AI_GENERATED', 'DETERMINISTIC_FALLBACK'].includes(explanation.explanationStatus) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {explanation.explanation?.summary && (
                  <div>
                    <p className="ai-explanation-section-label">Summary</p>
                    <p className="ai-explanation-text">{explanation.explanation.summary}</p>
                  </div>
                )}
                {explanation.explanation?.keyDrivers?.length > 0 && (
                  <div>
                    <p className="ai-explanation-section-label">Key Drivers</p>
                    <ul className="ai-explanation-list">
                      {explanation.explanation.keyDrivers.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>
                )}
                {explanation.explanation?.key_factors?.length > 0 && (
                  <div>
                    <p className="ai-explanation-section-label">Key Factors</p>
                    <ul className="ai-explanation-list">
                      {explanation.explanation.key_factors.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>
                )}
                {explanation.explanation?.operationalActions?.length > 0 && (
                  <div>
                    <p className="ai-explanation-section-label">Recommended Actions</p>
                    <ul className="ai-explanation-list">
                      {explanation.explanation.operationalActions.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                )}
                {explanation.explanation?.limitations?.length > 0 && (
                  <div className="ai-limitations-box">
                    <strong>Limitations:</strong> {explanation.explanation.limitations.join(' ')}
                  </div>
                )}
                <p className="ai-disclaimer">
                  {explanation.explanationStatus === 'DETERMINISTIC_FALLBACK'
                    ? 'Deterministic operational insight. Verify against source records before acting.'
                    : 'AI-generated operational insight. Verify against source records before acting.'}
                </p>
              </div>
            ) : (
              <p style={{ color: 'var(--warning)', fontSize: '0.85rem' }}>
                Operational explanation temporarily unavailable. Risk analysis remains active.
              </p>
            )}
          </div>
        ) : expError ? (
          <div className="ai-error-box">{expError}</div>
        ) : (
          <Button onClick={handleExplain} isLoading={explaining} variant="outline" className="w-full" icon={<Sparkles size={14} />}>
            {explaining ? 'Generating Explanation…' : 'Explain with AI'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AIIntelligenceWidget;
