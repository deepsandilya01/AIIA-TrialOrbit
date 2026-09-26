import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 140px)', backgroundColor: 'var(--bg-off-white)' }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem', textAlign: 'center', borderTop: '4px solid var(--danger)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fee2e2', color: 'var(--danger)', marginBottom: '1.5rem' }}>
              <AlertTriangle size={32} />
            </div>
            
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--charcoal)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              Something went wrong
            </h2>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              An unexpected error occurred while rendering this page. Our team has been notified.
            </p>

            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/dashboard';
              }}
              className="btn btn-primary w-full"
              style={{ display: 'inline-flex', justifyContent: 'center', padding: '0.75rem' }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
