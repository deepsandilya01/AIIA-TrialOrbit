import React, { useEffect, useState, useRef } from 'react';
import './Preloader.css';

const Preloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Connecting to AIIA Central Research Node...');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const totalDuration = 2600; // 2.6 seconds continuous count to 100%
    const startTime = performance.now();

    const updateCounter = (now) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.floor((elapsed / totalDuration) * 100));

      setProgress(pct);

      if (pct < 25) {
        setStatusMessage('Connecting to AIIA Central Research Node...');
      } else if (pct < 50) {
        setStatusMessage('Verifying 21 CFR Part 11 Audit Trail Modules...');
      } else if (pct < 75) {
        setStatusMessage('Calibrating CTCAE v5.0 & SAE Safety Surveillance...');
      } else if (pct < 98) {
        setStatusMessage('Synchronizing Multi-Centre Site Protocols...');
      } else {
        setStatusMessage('Clinical Trial Workspace Initialized • Ready');
      }

      if (pct < 100) {
        animFrameRef.current = requestAnimationFrame(updateCounter);
      } else {
        // Reached 100%! Hold briefly so user sees the 100%, then fade out smoothly
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 380);
        }, 320);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateCounter);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
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
