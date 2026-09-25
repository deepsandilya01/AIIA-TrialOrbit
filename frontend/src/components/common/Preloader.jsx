import React, { useEffect, useState } from 'react';
import './Preloader.css';

const Preloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState('Connecting to AIIA Central Research Node...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Medical-grade initialisation sequence with clear status stages
    const timer1 = setTimeout(() => {
      setProgress(38);
      setStatusMessage('Verifying 21 CFR Part 11 Audit Trail Modules...');
    }, 450);

    const timer2 = setTimeout(() => {
      setProgress(65);
      setStatusMessage('Calibrating CTCAE v5.0 & SAE Safety Surveillance...');
    }, 1050);

    const timer3 = setTimeout(() => {
      setProgress(88);
      setStatusMessage('Synchronizing Multi-Centre Site Protocols...');
    }, 1650);

    const timer4 = setTimeout(() => {
      setProgress(100);
      setStatusMessage('Clinical Trial Workspace Initialized • Ready');
    }, 2150);

    const timer5 = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 400);
    }, 2550);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onFinish]);

  return (
    <aside
      className={`preloader-overlay ${isFadingOut ? 'fade-out' : ''}`}
      aria-live="polite"
      aria-label="Loading clinical trial workspace"
    >
      <div className="preloader-content">
        {/* Official AIIA Trial-Orbit Crest Logo */}
        <div className="preloader-emblem">
          <img
            src="/logo.png"
            alt="AIIA TrialOrbit"
            className="preloader-logo-img"
          />
        </div>

        <div className="preloader-brand">
          <div className="preloader-title">AIIA TrialOrbit</div>
          <div className="preloader-subtitle">Real-Time Clinical Trial Management System</div>
        </div>

        <div className="preloader-progress-box">
          <div className="preloader-progress-bar">
            <div
              className="preloader-progress-fill"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <div className="preloader-status-text">
            <span>{statusMessage}</span>
            <span className="preloader-pct">{progress}%</span>
          </div>
        </div>

        <div className="preloader-institution">
          <span>All India Institute of Ayurveda • Ministry of Ayush, Govt. of India</span>
          <div style={{ marginTop: '4px', fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 600 }}>
            Smart India Hackathon 2026 (SIH 2026)
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Preloader;
