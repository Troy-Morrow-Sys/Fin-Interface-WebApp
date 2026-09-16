import React from 'react';
import './RecordsTable.css';

interface InvoiceRecord {
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

interface RecordsTableProps {
  records: InvoiceRecord[];
}

const RecordsTable: React.FC<RecordsTableProps> = ({ records }) => {
  const sortedRecords = [...records].sort((a, b) => {
    const aTime = new Date(a.transactionTimestamp).getTime();
    const bTime = new Date(b.transactionTimestamp).getTime();
    return aTime - bTime;
  });

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

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="records-table-container">
      <table className="records-table">
        <thead>
          <tr>
            <th>Sequence</th>
            <th>Flow Name</th>
            <th>Transaction ID</th>
            <th>Timestamp</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedRecords.map((record: InvoiceRecord, index: number) => (
            <tr key={`${record.seqId}-${record.transactionId}-${index}`}>
              <td className="sequence-number">{record.seqId}</td>
              <td className="flow-name">{record.flowName}</td>
              <td className="transaction-id">{record.transactionId}</td>
              <td className="timestamp">
                {formatTimestamp(record.transactionTimestamp)}
              </td>
              <td>
                <span
                  className={`status-badge ${getStatusColor(record.targetStatus)}`}
                >
                  {record.targetStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTable;
