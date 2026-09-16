import React, { useState, useEffect } from 'react';
import './DetailView.css';
import StatusBar from './StatusBar';
import RecordsTable from './RecordsTable';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

interface Invoice {
  businessUnit: string;
  opco: string;
  invoiceNumber: string;
  invoiceKey: string;
  targetStatus: string;
}

interface Record {
  businessUnit: string;
  opco: string;
  invoiceNumber: string;
  flowName: string;
  seqId: string;
  invoiceKey: string;
  transactionId: string;
  transactionTimestamp: string;
  targetStatus: string;
}

interface DetailViewProps {
  invoice: Invoice;
  onBack: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ invoice, onBack }) => {
  const [records, setRecords] = useState<Record[]>([]);
  const [missingRecords, setMissingRecords] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch records data
        const recordsResponse = await fetch(
          `${API_BASE_URL}/invoice/record?invoiceKey=${invoice.invoiceKey}`
        );
        const recordsData = await recordsResponse.json();

        // Fetch missing records data
        const missingResponse = await fetch(
          `${API_BASE_URL}/invoice/missing?invoiceKey=${invoice.invoiceKey}`
        );
        const missingData = await missingResponse.json();

        if (recordsData.status === 'SUCCESS') {
          setRecords(recordsData.records);
        }

        if (missingData.missingRecords) {
          setMissingRecords(missingData.missingRecords);
        }
      } catch (err) {
        console.error('Error fetching detail data:', err);
        setError('Failed to load invoice details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [invoice.invoiceKey]);

  return (
    <div className="detail-view">
      <div className="container">
        <button onClick={onBack} className="back-button">
          ← Back to Results
        </button>

        <div className="invoice-header">
          <h1>Invoice Details</h1>
          <p className="invoice-info">
            <strong>{invoice.invoiceNumber}</strong> | BU: {invoice.businessUnit} |
            Opco: {invoice.opco}
          </p>
        </div>

        {loading ? (
          <div className="loading">
            <p>Loading invoice details...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {missingRecords && (
              <StatusBar missingRecords={missingRecords} />
            )}

            <div className="records-section">
              <h2>Transaction Records</h2>
              {records.length > 0 ? (
                <RecordsTable records={records} />
              ) : (
                <div className="no-records">
                  <p>No transaction records found for this invoice.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailView;
