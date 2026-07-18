'use client';

import { useWidgetSDK, useTheme, useMaxHeight, useDisplayMode } from '@nitrostack/widgets';

export const dynamic = 'force-dynamic';

interface DomainData {
  domain: string;
  riskScore: number;
  riskLevel: string;
  indicators: string[];
  findings: string[];
  whois: Record<string, any>;
  dns: Record<string, any>;
  ssl: Record<string, any>;
  imageUrl: string;
}

export default function DomainIntelligenceWidget() {
  const theme = useTheme();
  const { isReady, getToolOutput } = useWidgetSDK();
  const data = getToolOutput<DomainData>();

  if (!isReady) return <div style={styles.loading}>Initializing…</div>;
  if (!data) return <div style={styles.loading}>Loading domain analysis…</div>;

  const riskColor =
    data.riskLevel === 'critical'
      ? '#ff4444'
      : data.riskLevel === 'high'
        ? '#ff8800'
        : data.riskLevel === 'medium'
          ? '#ffbb00'
          : '#44bb44';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Domain Intelligence</h2>
        <div style={styles.domain}>{data.domain || 'Unknown'}</div>
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

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Indicators</h3>
        <div style={styles.indicatorList}>
          {(data.indicators ?? []).map((indicator, i) => (
            <div key={i} style={styles.indicator}>
              {indicator}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Findings</h3>
        <div style={styles.findingsList}>
          {(data.findings ?? []).map((finding, i) => (
            <div key={i} style={styles.finding}>
              {finding}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.detailsGrid}>
        <div style={styles.detailCard}>
          <h4 style={styles.detailTitle}>WHOIS</h4>
          <div style={styles.detailContent}>
            {data.whois ? (
              <>
                <div>
                  <strong>Registrar:</strong> {data.whois.registrar || 'N/A'}
                </div>
                <div>
                  <strong>Registered:</strong> {data.whois.registrationDate || 'N/A'}
                </div>
                <div>
                  <strong>Expires:</strong> {data.whois.expirationDate || 'N/A'}
                </div>
              </>
            ) : (
              'No WHOIS data'
            )}
          </div>
        </div>

        <div style={styles.detailCard}>
          <h4 style={styles.detailTitle}>DNS</h4>
          <div style={styles.detailContent}>
            {data.dns ? (
              <>
                <div>
                  <strong>A Records:</strong> {(data.dns.a ?? []).join(', ') || 'None'}
                </div>
                <div>
                  <strong>MX Records:</strong> {(data.dns.mx ?? []).length > 0 ? 'Configured' : 'None'}
                </div>
                <div>
                  <strong>Nameservers:</strong> {(data.dns.ns ?? []).join(', ') || 'N/A'}
                </div>
              </>
            ) : (
              'No DNS data'
            )}
          </div>
        </div>

        <div style={styles.detailCard}>
          <h4 style={styles.detailTitle}>SSL Certificate</h4>
          <div style={styles.detailContent}>
            {data.ssl ? (
              <>
                <div>
                  <strong>Issuer:</strong> {data.ssl.issuer || 'N/A'}
                </div>
                <div>
                  <strong>Valid Until:</strong> {data.ssl.validUntil || 'N/A'}
                </div>
                <div>
                  <strong>Key Size:</strong> {data.ssl.keySize || 'N/A'} bits
                </div>
              </>
            ) : (
              'No SSL data'
            )}
          </div>
        </div>
      </div>
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
  domain: {
    fontSize: '14px',
    color: '#888',
    fontFamily: 'monospace',
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
  findingsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  finding: {
    padding: '10px 12px',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '4px',
    fontSize: '13px',
    lineHeight: '1.4',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
  },
  detailCard: {
    padding: '15px',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '6px',
  },
  detailTitle: {
    margin: '0 0 10px 0',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#00ff88',
    textTransform: 'uppercase' as const,
  },
  detailContent: {
    fontSize: '12px',
    lineHeight: '1.6',
    color: '#aaa',
  },
};
