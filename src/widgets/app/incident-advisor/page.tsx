'use client';

import { useWidgetSDK, useTheme } from '@nitrostack/widgets';

export const dynamic = 'force-dynamic';

interface IncidentData {
  incidentType: string;
  severity: string;
  affectedSystems: string[];
  playbook: string;
  immediateActions: string[];
  investigationSteps: string[];
  containmentSteps: string[];
  recoverySteps: string[];
  communicationTemplate: string;
  resources: string[];
  imageUrl: string;
}

export default function IncidentAdvisorWidget() {
  const theme = useTheme();
  const { isReady, getToolOutput } = useWidgetSDK();
  const data = getToolOutput<IncidentData>();

  if (!isReady) return <div style={styles.loading}>Initializing…</div>;
  if (!data) return <div style={styles.loading}>Loading incident guidance…</div>;

  const severityColor =
    data.severity === 'critical'
      ? '#ff4444'
      : data.severity === 'high'
        ? '#ff8800'
        : data.severity === 'medium'
          ? '#ffbb00'
          : '#44bb44';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Incident Advisor</h2>
        <div style={styles.subtitle}>{data.playbook || 'Incident Response Playbook'}</div>
      </div>

      <div style={styles.incidentInfo}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Incident Type:</span>
          <span style={styles.infoValue}>{data.incidentType?.replace(/_/g, ' ').toUpperCase() || 'Unknown'}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Severity:</span>
          <span style={{ ...styles.badge, backgroundColor: severityColor }}>
            {data.severity?.toUpperCase() || 'UNKNOWN'}
          </span>
        </div>
        {(data.affectedSystems ?? []).length > 0 && (
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Affected Systems:</span>
            <span style={styles.infoValue}>{data.affectedSystems.join(', ')}</span>
          </div>
        )}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🚨 Immediate Actions</h3>
        <ol style={styles.stepList}>
          {(data.immediateActions ?? []).map((action, i) => (
            <li key={i} style={styles.step}>
              {action}
            </li>
          ))}
        </ol>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🔍 Investigation Steps</h3>
        <ol style={styles.stepList}>
          {(data.investigationSteps ?? []).map((step, i) => (
            <li key={i} style={styles.step}>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🛑 Containment Steps</h3>
        <ol style={styles.stepList}>
          {(data.containmentSteps ?? []).map((step, i) => (
            <li key={i} style={styles.step}>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>✅ Recovery Steps</h3>
        <ol style={styles.stepList}>
          {(data.recoverySteps ?? []).map((step, i) => (
            <li key={i} style={styles.step}>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {data.communicationTemplate && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📢 Communication Template</h3>
          <pre style={styles.template}>{data.communicationTemplate.trim()}</pre>
        </div>
      )}

      {(data.resources ?? []).length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📚 Resources</h3>
          <ul style={styles.resourceList}>
            {data.resources.map((resource, i) => (
              <li key={i} style={styles.resource}>
                {resource}
              </li>
            ))}
          </ul>
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
  subtitle: {
    fontSize: '14px',
    color: '#888',
  },
  incidentInfo: {
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
  badge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#fff',
    width: 'fit-content',
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
  stepList: {
    margin: '0',
    paddingLeft: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  step: {
    padding: '10px 12px',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '4px',
    fontSize: '13px',
    lineHeight: '1.4',
  },
  template: {
    padding: '15px',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#aaa',
    overflow: 'auto',
    maxHeight: '300px',
    margin: '0',
  },
  resourceList: {
    margin: '0',
    paddingLeft: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  resource: {
    padding: '10px 12px',
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '4px',
    fontSize: '13px',
    lineHeight: '1.4',
  },
};
