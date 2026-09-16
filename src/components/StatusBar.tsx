import React, { useState } from 'react';
import './StatusBar.css';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

interface StatusBarProps {
  missingRecords: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ missingRecords }) => {
  const [selectedSeq, setSelectedSeq] = useState<number | null>(null);
  const [healthResults, setHealthResults] = useState<Record<number, string>>({});

  const sequences = [
    { id: 1, name: 'Flow_StgToRDS_AR' },
    { id: 2, name: 'Flow_ARData_Cora_API' },
    { id: 3, name: 'Flow_ARData_HR_API' },
    { id: 4, name: 'Flow_ECAS_Kinesis_Stream' },
    { id: 5, name: 'Flow_ECAS_Kafka' },
  ];

  const getStatusAtIndex = (index: number): 'Y' | 'N' | null => {
    if (index < missingRecords.length) {
      return missingRecords[index] as 'Y' | 'N';
    }
    return null;
  };

  const handleCircleClick = async (seqId: number) => {
    const status = getStatusAtIndex(seqId - 1);
    if (status !== 'N') {
      return;
    }

    const nextSelectedSeq = selectedSeq === seqId ? null : seqId;
    setSelectedSeq(nextSelectedSeq);

    if (nextSelectedSeq === null) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/invoice/health?step=${seqId}`
      );

      const result = await response.text();
      setHealthResults((prev) => ({
        ...prev,
        [seqId]: response.ok ? result : result || 'Service is unhealthy',
      }));
    } catch (error) {
      setHealthResults((prev) => ({
        ...prev,
        [seqId]: 'Health check failed',
      }));
    }
  };

  return (
    <div className="status-bar-container">
      <div className="status-bar">
        <div className="status-label">Sequence Status:</div>
        <div className="circles-container">
          {sequences.map((seq) => {
            const status = getStatusAtIndex(seq.id - 1);
            const isHealthy = status === 'Y';
            const isFailed = status === 'N';
            const healthResult = healthResults[seq.id];

            return (
              <div
                key={seq.id}
                className="circle-wrapper"
                onClick={() => handleCircleClick(seq.id)}
              >
                <div
                  className={`status-circle ${
                    isHealthy ? 'healthy' : isFailed ? 'failed' : 'unknown'
                  } ${
                    isFailed && selectedSeq === seq.id ? 'selected' : ''
                  }`}
                  title={`Seq ${seq.id}: ${seq.name}`}
                >
                  {isHealthy ? '✓' : isFailed ? '✗' : '?'}
                </div>
                <span className="seq-label">Seq {seq.id}</span>

                {isFailed && selectedSeq === seq.id && (
                  <div className="tooltip">
                    <div className="tooltip-title">{seq.name}</div>
                    <div className="tooltip-content">
                      <strong>Status:</strong> Missing data detected
                    </div>
                    <div className="tooltip-content">
                      <strong>Health Check:</strong>{' '}
                      {healthResult || 'Checking...'}
                    </div>
                    <div className="tooltip-content">
                      <strong>Action:</strong> Check flow configuration and
                      retry processing
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
