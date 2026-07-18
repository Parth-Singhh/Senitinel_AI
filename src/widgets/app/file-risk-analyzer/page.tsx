'use client';

import { useWidgetSDK, useTheme } from '@nitrostack/widgets';

export const dynamic = 'force-dynamic';

interface FileData {
  filename: string;
  riskScore: number;
  riskLevel: string;
  indicators: string[];
  recommendations: string[];
  fileInfo: {
    hash?: string;
    fileSize?: number;
    fileType?: string;
  };
  imageUrl: string;
}

export default function FileRiskAnalyzerWidget() {
  const theme = useTheme();
  const { isReady, getToolOutput } = useWidgetSDK();
  const data = getToolOutput<FileData>();

  if (!isReady) return <div style={styles.loading}>Initializing…</div>;
  if (!data) return <div style={styles.loading}>Loading file analysis…</div>;

  const riskColor =
    data.riskLevel === 'critical'
      ? '#ff4444'
      : data.riskLevel === 'high'
        ? '#ff8800'
        : data.riskLevel === 'medium'
          ? '#ffbb00'
          : '#44bb44';

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>File Risk Analyzer</h2>
        <div style={styles.filename}>{data.filename || 'Unknown'}</div>
      </div>

      <div style={styles.riskSection}>
        <div style={styles.riskGauge}>
          <svg viewBox="0 0 100 100" style={styles.gaugeSvg}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="2" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={riskColor}
              strokeWidth="3"
              strokeDasharray={`${(data.riskScore / 100) * 283} 283`}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
            <text x="50" y="50" textAnchor="middle" dy="0.3em" style={styles.gaugeText}>
              {data.riskScore}
            </text>
          </svg>
        </div>
        <div style={styles.riskLabel}>
          <span style={{ ...styles.badge, backgroundColor: riskColor }}>{data.riskLevel.toUpperCase()}</span>
        </div>
      </div>

      <div style={styles.fileInfoGrid}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>File Type:</span>
          <span style={styles.infoValue}>{data.fileInfo?.fileType || 'Unknown'}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>File Size:</span>
          <span style={styles.infoValue}>{formatFileSize(data.fileInfo?.fileSize)}</span>
        </div>
        {data.fileInfo?.hash && (
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Hash:</span>
            <span style={styles.infoValue} style={{ fontFamily: 'monospace', fontSize: '11px' }}>
              {data.fileInfo.hash.substring(0, 32)}...
            </span>
          </div>
        )}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Risk Indicators</h3>
        <div style={styles.indicatorList}>
          {(data.indicators ?? []).map((indicator, i) => (
            <div key={i} style={styles.indicator}>
              {indicator}
            </div>
          ))}
        </div>
      </div>

      {(data.recommendations ?? []).length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Recommendations</h3>
          <div style={styles.recommendationList}>
            {data.recommendations.map((rec, i) => (
              <div key={i} style={styles.recommendation}>
                <span style={styles.recIcon}>→</span>
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#0a0e27',
    color: '#e0e0e0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    minHeight: '100vh',
  },
  loading: {
    padding: '40px 20px',
    textAlign: 'center' as const,
    color: '#888',
  },
  header: {
    marginBottom: '30px',
    borderBottom: '1px solid #333',
    paddingBottom: '15px',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00ff88',
  },
  filename: {
    fontSize: '14px',
    color: '#888',
    fontFamily: 'monospace',
    wordBreak: 'break-all' as const,
  },
  riskSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#111',
    borderRadius: '8px',
    border: '1px solid #333',
  },
  riskGauge: {
    width: '120px',
    height: '120px',
    position: 'relative' as const,
  },
  gaugeSvg: {
    width: '100%',
    height: '100%',
  },
  gaugeText: {
    fontSize: '28px',
    fontWeight: 'bold',
    fill: '#00ff88',
  },
  riskLabel: {
    flex: 1,
  },
  badge: {
    display: 'inline-block',
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fff',
  },
  fileInfoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '25px',
  },
  infoItem: {
    padding: '12px',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  infoLabel: {
    fontSize: '11px',
    color: '#888',
    textTransform: 'uppercase' as const,
  },
  infoValue: {
    fontSize: '13px',
    color: '#00ff88',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: '25px',
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#00ff88',
    textTransform: 'uppercase' as const,
  },
  indicatorList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  indicator: {
    padding: '10px 12px',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '4px',
    fontSize: '13px',
    lineHeight: '1.4',
  },
  recommendationList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  recommendation: {
    padding: '10px 12px',
    backgroundColor: '#1a1f3a',
    border: '1px solid #2a3f5f',
    borderRadius: '4px',
    fontSize: '13px',
    lineHeight: '1.4',
    display: 'flex',
    gap: '8px',
  },
  recIcon: {
    color: '#00ff88',
    fontWeight: 'bold',
  },
};
