import React, { useState } from 'react';
import './App.css';
import HomePage from './components/HomePage';
import InvoiceSearch from './components/InvoiceSearch';
import HealthCheck from './components/HealthCheck';
import DatadogLinks from './components/DatadogLinks';
import ResultsView from './components/ResultsView';
import DetailView from './components/DetailView';

interface Invoice {
  businessUnit: string;
  opco: string;
  invoiceNumber: string;
  invoiceKey: string;
  targetStatus: string;
}

type ViewType = 'home' | 'invoiceSearch' | 'datadog' | 'healthCheck' | 'results' | 'detail';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (businessUnit: string, opco: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/invoice?businessUnit=${encodeURIComponent(businessUnit)}&opco=${encodeURIComponent(opco)}`
      );

      const data = await response.json();

      if (data.status === 'SUCCESS') {
        setInvoices(data.records);
        setCurrentView('results');
      } else {
        alert('No records found. Please try different filters.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error connecting to the API. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('detail');
  };

  const handleBackToResults = () => {
    setCurrentView('results');
  };

  const handleBackToLanding = () => {
    setCurrentView('invoiceSearch');
  };

  return (
    <div className="App">
      {currentView === 'home' && (
        <HomePage
          onOpenInvoiceSearch={() => setCurrentView('invoiceSearch')}
          onOpenDatadog={() => setCurrentView('datadog')}
          onOpenHealthCheck={() => setCurrentView('healthCheck')}
        />
      )}
      {currentView === 'invoiceSearch' && (
        <InvoiceSearch
          onSearch={handleSearch}
          onBack={() => setCurrentView('home')}
          loading={loading}
        />
      )}
      {currentView === 'healthCheck' && (
        <HealthCheck onBack={() => setCurrentView('home')} />
      )}
      {currentView === 'datadog' && (
        <DatadogLinks onBack={() => setCurrentView('home')} />
      )}
      {currentView === 'results' && (
        <ResultsView
          invoices={invoices}
          onSelectInvoice={handleSelectInvoice}
          onBack={handleBackToLanding}
        />
      )}
      {currentView === 'detail' && selectedInvoice && (
        <DetailView
          invoice={selectedInvoice}
          onBack={handleBackToResults}
        />
      )}
    </div>
  );
};

export default App;
