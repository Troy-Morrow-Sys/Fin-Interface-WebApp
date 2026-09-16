import React from 'react';
import './HomePage.css';
import syscoLogo from '../images/sysco-logo.png';

interface HomePageProps {
  onOpenInvoiceSearch: () => void;
  onOpenDatadog: () => void;
  onOpenHealthCheck: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onOpenInvoiceSearch, onOpenDatadog, onOpenHealthCheck }) => {
  return (
    <div className="home-page">
      <header className="home-header">
        <img className="brand-mark" src={syscoLogo} alt="Sysco" />
        <h1>Finance Integration Ops Portal</h1>
        <div className="user-summary" aria-label="Current user">
          <span className="user-icon" aria-hidden="true">♙</span>
          <span>Welcome</span>
        </div>
      </header>

      <main className="home-content">
        <div className="home-intro">
          <p>Select an application to continue.</p>
        </div>

        <div className="application-grid">
          <button className="application-card invoice-card" onClick={onOpenInvoiceSearch}>
            <span className="application-icon invoice-icon" aria-hidden="true">▣</span>
            <span className="application-name">Invoice Search</span>
            <span className="application-description">
              Search invoices by business unit and operating company, then review transaction details.
            </span>
            <span className="application-action">Open Invoice Search <span aria-hidden="true">→</span></span>
          </button>

          <button className="application-card datadog-card" onClick={onOpenDatadog}>
            <span className="application-icon datadog-icon" aria-hidden="true">◌</span>
            <span className="application-name">Datadog</span>
            <span className="application-description">
              Monitor service performance and operational dashboards.
            </span>
            <span className="application-action">Open Datadog <span aria-hidden="true">→</span></span>
          </button>

          <button className="application-card disabled-card" onClick={onOpenHealthCheck}>
            <span className="application-icon health-icon" aria-hidden="true">♥</span>
            <span className="application-name">Health Check</span>
            <span className="application-description">
              View application availability, health status, and the last service check time.
            </span>
            <span className="application-action">Coming soon</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;