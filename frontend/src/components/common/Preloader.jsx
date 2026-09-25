import React, { useEffect, useState } from 'react';
import './Preloader.css';

const Preloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(15);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Smooth, professional loading sequence (quick and respectful of user's time)
    const timer1 = setTimeout(() => setProgress(45), 150);
    const timer2 = setTimeout(() => setProgress(82), 350);
    const timer3 = setTimeout(() => setProgress(100), 550);
    const timer4 = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 350);
    }, 750);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
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
            <span>Initializing Clinical Trial Workspace...</span>
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
