import React from 'react';
import './HealthCheck.css';

interface HealthCheckProps {
  onBack: () => void;
}

const HealthCheck: React.FC<HealthCheckProps> = ({ onBack }) => (
  <div className="health-check-page">
    <button type="button" className="health-back-button" onClick={onBack}>← Back to Home</button>
    <main className="health-check-content">
      <h1>Health Check</h1>
      <p className="health-check-message">Health monitoring is not available yet.</p>
      <div className="health-summary-grid">
        <div><strong>—</strong><span>Applications</span></div>
        <div><strong>—</strong><span>Up and running</span></div>
        <div><strong>—</strong><span>Healthy</span></div>
      </div>
      <p className="last-checked">Last checked: —</p>
    </main>
  </div>
);

export default HealthCheck;