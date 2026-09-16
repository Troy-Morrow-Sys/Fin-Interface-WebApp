import React, { useState, useEffect } from 'react';
import './InvoiceSearch.css';

interface InvoiceSearchProps { onSearch: (businessUnit: string, opco: string) => void; onBack: () => void; loading: boolean; }
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const InvoiceSearch: React.FC<InvoiceSearchProps> = ({ onSearch, onBack, loading }) => {
  const [businessUnits, setBusinessUnits] = useState<string[]>([]);
  const [opcoOptions, setOpcoOptions] = useState<string[]>([]);
  const [businessUnit, setBusinessUnit] = useState('');
  const [opco, setOpco] = useState('');
  const [error, setError] = useState<string>('');
  const [loadingBusinessUnits, setLoadingBusinessUnits] = useState(true);

  useEffect(() => {
    const fetchBusinessUnits = async () => {
      try {
        setError('');
        const response = await fetch(`${API_BASE_URL}/invoice/businessUnit`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('API did not return a list/array');
        setBusinessUnits(data);
      } catch (err) {
        setError(err instanceof TypeError ? `Unable to connect to the invoice service at ${API_BASE_URL}.` : err instanceof Error ? err.message : 'Unable to load business units');
      } finally { setLoadingBusinessUnits(false); }
    };
    fetchBusinessUnits();
  }, []);

  useEffect(() => {
    const fetchOpcos = async () => {
      if (!businessUnit) { setOpcoOptions([]); setOpco(''); return; }
      try {
        setError('');
        const response = await fetch(`${API_BASE_URL}/invoice/opco?businessUnit=${encodeURIComponent(businessUnit)}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('API did not return a list/array');
        setOpcoOptions(data); setOpco('');
      } catch (err) { setError(err instanceof Error ? err.message : 'Unable to load OPCOs'); setOpcoOptions([]); setOpco(''); }
    };
    fetchOpcos();
  }, [businessUnit]);

  return (
    <div className="invoice-search-page">
      <div className="container">
        <button type="button" onClick={onBack} className="invoice-back-button">← Back to Home</button>
        <div className="invoice-search-content">
          <div className="invoice-header"><h1>Invoice Search</h1><p>Invoice Management System</p></div>
          <div className="search-panel">
            <h2>Search Invoices</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group"><label htmlFor="businessUnit">Business Unit</label><select id="businessUnit" value={businessUnit} onChange={(e) => setBusinessUnit(e.target.value)} className="dropdown" disabled={loadingBusinessUnits}><option value="">{loadingBusinessUnits ? 'Loading Business Units...' : '-- Select Business Unit --'}</option>{businessUnits.map((item, index) => <option key={`${item}-${index}`} value={item}>{item}</option>)}</select></div>
            <div className="form-group"><label htmlFor="opco">Operating Company</label><select id="opco" value={opco} onChange={(e) => setOpco(e.target.value)} className="dropdown" disabled={!businessUnit || opcoOptions.length === 0}><option value="">-- Select Opco --</option>{opcoOptions.map((item, index) => <option key={`${item}-${index}`} value={item}>{item}</option>)}</select></div>
            <button onClick={() => businessUnit && opco && onSearch(businessUnit, opco)} disabled={loading || !businessUnit || !opco} className="search-button">{loading ? 'Searching...' : 'Search'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSearch;