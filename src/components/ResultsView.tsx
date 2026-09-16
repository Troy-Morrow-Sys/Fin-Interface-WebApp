import React, { useEffect, useMemo, useState } from 'react';
import './ResultsView.css';

const RECORDS_PER_PAGE = 10;

interface Invoice {
  businessUnit: string;
  opco: string;
  invoiceNumber: string;
  invoiceKey: string;
  targetStatus: string;
}

interface ResultsViewProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  onBack: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({
  invoices,
  onSelectInvoice,
  onBack,
}) => {
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredInvoices = useMemo(() => {
    const searchTerm = invoiceSearch.trim().toLowerCase();

    if (!searchTerm) {
      return invoices;
    }

    return invoices.filter((invoice) =>
      invoice.invoiceNumber.toLowerCase().includes(searchTerm)
    );
  }, [invoices, invoiceSearch]);

  const totalPages = Math.ceil(filteredInvoices.length / RECORDS_PER_PAGE);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [invoiceSearch, invoices]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'COMPLETED':
        return 'status-completed';
      case 'PENDING':
        return 'status-pending';
      case 'FAILED':
        return 'status-failed';
      default:
        return 'status-unknown';
    }
  };

  return (
    <div className="results-view">
      <div className="container">
        <div className="results-header">
          <button onClick={onBack} className="back-button">
            ← Back to Search
          </button>
          <h1>Invoice Results</h1>
          <p className="results-count">
            Found {filteredInvoices.length} invoice(s)
          </p>
        </div>

        <div className="invoice-search">
          <label htmlFor="invoiceSearch">Search by invoice number</label>
          <input
            id="invoiceSearch"
            type="search"
            value={invoiceSearch}
            onChange={(event) => setInvoiceSearch(event.target.value)}
            placeholder="Enter invoice number"
            list="invoice-number-options"
          />
          <datalist id="invoice-number-options">
            {invoices
              .filter((invoice) =>
                invoice.invoiceNumber
                  .toLowerCase()
                  .includes(invoiceSearch.trim().toLowerCase())
              )
              .map((invoice) => (
                <option key={invoice.invoiceKey} value={invoice.invoiceNumber} />
              ))}
          </datalist>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="no-results">
            <p>Invoice does not exist</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Invoice Number</th>
                    <th>Business Unit</th>
                    <th>Operating Company</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInvoices.map((invoice) => (
                    <tr key={invoice.invoiceKey} className="table-row">
                      <td className="invoice-cell">
                        <button
                          onClick={() => onSelectInvoice(invoice)}
                          className="invoice-link"
                          title="Click to view details"
                        >
                          {invoice.invoiceNumber}
                        </button>
                      </td>
                      <td>{invoice.businessUnit}</td>
                      <td>{invoice.opco}</td>
                      <td>
                        <span
                          className={`status-badge ${getStatusColor(
                            invoice.targetStatus
                          )}`}
                        >
                          {invoice.targetStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <nav className="pagination" aria-label="Invoice results pages">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => page - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => page + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsView;
