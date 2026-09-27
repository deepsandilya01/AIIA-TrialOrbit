import React from 'react';
import { Lightbulb, Database, Activity, Code, ShieldCheck, Cpu } from 'lucide-react';

const UPCOMING_FEATURES = {
  ADMIN: [
    { title: 'Advanced System Analytics', desc: 'Deep insights into cross-study performance.', icon: <Activity size={18} /> },
    { title: 'Compliance Monitoring Pro', desc: 'Automated governance and risk scoring.', icon: <ShieldCheck size={18} /> },
    { title: 'Advanced Administration', desc: 'Granular user and site permission configurations.', icon: <Database size={18} /> }
  ],
  PI: [
    { title: 'Enrollment Prediction', desc: 'AI-driven recruitment forecasting.', icon: <Cpu size={18} /> },
    { title: 'Study Intelligence', desc: 'Advanced analytics for study milestones.', icon: <Lightbulb size={18} /> },
    { title: 'Treatment-Arm Analytics', desc: 'Real-time comparisons of study arms.', icon: <Activity size={18} /> }
  ],
  COORDINATOR: [
    { title: 'CRF / eCRF', desc: 'Structured digital case-report forms for standardized clinical data capture.', icon: <Code size={18} /> },
    { title: 'Structured Vitals & Lab', desc: 'Integrated capture for vitals and laboratory data.', icon: <Database size={18} /> },
    { title: 'Visit-Window Validation', desc: 'Automated scheduling compliance checks.', icon: <ShieldCheck size={18} /> }
  ],
  MONITOR: [
    { title: 'Advanced Data Quality', desc: 'Detect missing and inconsistent clinical data earlier.', icon: <Activity size={18} /> },
    { title: 'Automated Anomaly Detection', desc: 'AI-powered detection of statistical anomalies.', icon: <Cpu size={18} /> },
    { title: 'Query Prioritization', desc: 'Risk-based sorting of pending data queries.', icon: <Lightbulb size={18} /> }
  ],
  ETHICS: [
    { title: 'Richer Ethics Workflow', desc: 'Streamlined multi-stage review pipelines.', icon: <ShieldCheck size={18} /> },
    { title: 'Approval Lifecycle', desc: 'Complete tracking of initial and continuing reviews.', icon: <Activity size={18} /> },
    { title: 'Compliance Intelligence', desc: 'Automated risk scoring for protocol deviations.', icon: <Cpu size={18} /> }
  ],
  PHARMACOVIGILANCE: [
    { title: 'MedDRA / WHO Drug', desc: 'Standardized safety and medication coding.', icon: <Database size={18} /> },
    { title: 'SUSAR Workflow', desc: 'Automated regulatory submission pipelines.', icon: <Activity size={18} /> },
    { title: 'Safety Signal Detection', desc: 'AI-assisted identification of adverse event trends.', icon: <Cpu size={18} /> }
  ],
  REGULATOR: [
    { title: 'Expanded Compliance Reporting', desc: 'Comprehensive regulatory readiness reports.', icon: <ShieldCheck size={18} /> },
    { title: 'Richer Audit Views', desc: 'Advanced filtering for ALCOA+ audit trails.', icon: <Database size={18} /> },
    { title: 'Interoperability Reports', desc: 'FHIR and CDISC compliance dashboards.', icon: <Code size={18} /> }
  ]
};

const DEFAULT_FEATURES = [
  { title: 'CRF / eCRF', desc: 'Structured digital case-report forms for standardized clinical data capture.', icon: <Code size={18} /> },
  { title: 'FHIR Interoperability', desc: 'Better interoperability with healthcare and research systems.', icon: <Activity size={18} /> },
  { title: 'AI Trial Intelligence', desc: 'Risk and trend insights for study, site and safety monitoring.', icon: <Cpu size={18} /> }
];

const UpcomingFeatures = ({ role }) => {
  const features = UPCOMING_FEATURES[role] || DEFAULT_FEATURES;

  return (
    <div className="upcoming-features mt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb size={20} className="text-warning" />
          What's Coming Next
        </h3>
        <p className="text-sm text-muted">Planned improvements for upcoming TrialOrbit releases.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature, idx) => (
          <div key={idx} className="card p-4 flex flex-col justify-between" style={{ borderTop: '3px solid var(--primary-color)' }}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold flex items-center gap-2 text-sm">
                  {feature.icon}
                  {feature.title}
                </h4>
                <span className="badge badge-warning text-[0.65rem]">Coming Soon</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {feature.desc}
              </p>
            </div>
            <div className="mt-3 text-[0.65rem] font-medium text-primary">
              Planned for MVP-2
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingFeatures;
