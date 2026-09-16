import React from 'react';
import './DatadogLinks.css';

interface DatadogLinksProps {
  onBack: () => void;
}

const buildDashboardUrl = (dashboardUrl: string): string => {
  const toTimestamp = Date.now();
  const fromTimestamp = toTimestamp - 24 * 60 * 60 * 1000;
  const url = new URL(dashboardUrl);
  url.searchParams.set('from_ts', String(fromTimestamp));
  url.searchParams.set('to_ts', String(toTimestamp));
  return url.toString();
};

const DatadogLinks: React.FC<DatadogLinksProps> = ({ onBack }) => {
  const dashboards = [
    {
      businessUnit: 'USBL',
      name: 'USBL HighRadius Dashboard',
      url: buildDashboardUrl(
        'https://app.datadoghq.com/dashboard/8n5-dgj-r68/usbl-highradius-dashboard?fromUser=true&refresh_mode=sliding&from_ts=0&to_ts=0&live=true'
      ),
    },
    {
      businessUnit: 'HAWAII',
      name: 'HAWAII HighRadius Dashboard',
      url: buildDashboardUrl(
        'https://app.datadoghq.com/dashboard/fbx-si5-7t2/hawaii-highradius-dashboard?fromUser=true&refresh_mode=sliding&from_ts=0&to_ts=0&live=true'
      ),
    },
    {
      businessUnit: 'CABL',
      name: 'CABL HighRadius Dashboard',
      url: buildDashboardUrl(
        'https://app.datadoghq.com/dashboard/36u-piu-4b4/cabl-highradius-dashboard?fromUser=false&refresh_mode=sliding&from_ts=0&to_ts=0&live=true'
      ),
    },
    {
      businessUnit: 'Paragon',
      name: 'Paragon Prod - HighRadius Dashboard',
      url: buildDashboardUrl(
        'https://app.datadoghq.com/dashboard/2hb-mc3-gic/paragon-prod---highradius-dashboard?fromUser=false&refresh_mode=sliding&from_ts=0&to_ts=0&live=true'
      ),
    },
  ];

  return (
    <div className="datadog-links-page">
      <div className="datadog-links-container">
        <button type="button" onClick={onBack} className="datadog-back-button">
          ← Back to Home
        </button>
        <header className="datadog-links-header">
          <span className="datadog-title-icon" aria-hidden="true">◌</span>
          <div>
            <h1>Datadog Dashboards</h1>
            <p>Choose a dashboard by business unit.</p>
          </div>
        </header>
        <div className="dashboard-links" aria-label="Datadog dashboards by business unit">
          {dashboards.map((dashboard) => (
            <a
              className="dashboard-link"
              href={dashboard.url}
              key={dashboard.businessUnit}
              rel="noreferrer"
              target="_blank"
            >
              <span className="dashboard-business-unit">{dashboard.businessUnit}</span>
              <span className="dashboard-link-name">{dashboard.name}</span>
              <span className="dashboard-open" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatadogLinks;