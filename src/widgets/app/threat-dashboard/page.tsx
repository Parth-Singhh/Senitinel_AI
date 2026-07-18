'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';
import { RiskGauge } from '../../components/RiskGauge';
import { MetricCard } from '../../components/MetricCard';
import { SeverityBadge } from '../../components/SeverityBadge';
import { Timeline } from '../../components/Timeline';
import { EvidencePanel } from '../../components/EvidencePanel';
import { ActionButton } from '../../components/ActionButton';
import '../../../widgets/theme.css';

export const dynamic = 'force-dynamic';

interface ThreatData {
  riskScore?: number;
  riskLevel?: string;
  status?: string;
  threatExplanation?: string;
  indicators?: Array<{
    type: string;
    description: string;
    severity?: string;
  }> | string[];
  mitigation?: string[];
  summary?: string;
  url?: string;
  cveId?: string;
  cvssScore?: number;
  severity?: string;
  affectedSoftware?: string[];
  reportId?: string;
  title?: string;
  timestamp?: string;
  executive_summary?: string;
  threat_analysis?: any;
  recommended_actions?: string[];
  timeline?: Array<{ time: string; event: string }>;
  imageUrl?: string;
  from?: { email: string; name?: string };
  subject?: string;
  spf?: string;
  dkim?: string;
  dmarc?: string;
  confidence?: number;
}

export default function ThreatDashboard() {
  const theme = useTheme();
  const { isReady, getToolOutput } = useWidgetSDK();
  const data = getToolOutput<ThreatData>();

  if (!isReady || !data) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: '#f0f4f8',
        background: '#0a0e27',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ animation: 'pulse 2s ease-in-out infinite' }}>
          🔍 Analyzing threat data...
        </div>
      </div>
    );
  }

  const getRiskColor = (level?: string | number) => {
    if (typeof level === 'number') {
      if (level >= 80) return '#ff1744';
      if (level >= 60) return '#ff6d00';
      if (level >= 40) return '#ffd600';
      return '#00e676';
    }
    const levelStr = String(level).toLowerCase();
    if (levelStr === 'critical') return '#ff1744';
    if (levelStr === 'high') return '#ff6d00';
    if (levelStr === 'medium') return '#ffd600';
    if (levelStr === 'malicious') return '#ff1744';
    if (levelStr === 'suspicious') return '#ff6d00';
    return '#22c55e';
  };

  const getSeverityType = (level?: string | number): 'critical' | 'high' | 'medium' | 'low' | 'info' | 'safe' => {
    if (typeof level === 'number') {
      if (level >= 80) return 'critical';
      if (level >= 60) return 'high';
      if (level >= 40) return 'medium';
      return 'low';
    }
    const levelStr = String(level).toLowerCase();
    if (levelStr === 'critical') return 'critical';
    if (levelStr === 'high') return 'high';
    if (levelStr === 'medium') return 'medium';
    if (levelStr === 'malicious') return 'critical';
    if (levelStr === 'suspicious') return 'high';
    if (levelStr === 'safe') return 'low';
    return 'info';
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleExport = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-analysis-${Date.now()}.json`;
    a.click();
  };

  // Detect report vs single analysis
  const isReport = !!data.reportId;
  const isEmailAnalysis = !!data.riskScore && !data.url && !data.cveId;
  const isUrlScan = !!data.url;
  const isCveAnalysis = !!data.cveId;

  return (
    <div style={{
      background: '#0a0e27',
      color: '#f0f4f8',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      padding: '24px',
    }}>
      {/* Header with actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(42, 58, 90, 0.4)',
      }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 'bold' }}>
            {isReport ? '🚨 Security Incident Report' : isEmailAnalysis ? '📧 Email Analysis' : isUrlScan ? '🔗 URL Scan' : '🔓 CVE Analysis'}
          </h1>
          <p style={{ margin: 0, fontSize: '12px', color: '#a8b5c8' }}>
            {new Date(data.timestamp || Date.now()).toLocaleString()}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ActionButton icon="📋" label="Copy" onClick={() => handleCopy(JSON.stringify(data))} variant="secondary" size="sm" />
          <ActionButton icon="💾" label="Export" onClick={handleExport} variant="secondary" size="sm" />
        </div>
      </div>

      {/* Main content grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '24px',
      }}>
        {/* Risk Score Card */}
        {(data.riskScore !== undefined || data.cvssScore !== undefined) && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(26, 40, 71, 0.8) 0%, rgba(21, 29, 59, 0.6) 100%)',
            border: '1px solid rgba(42, 58, 90, 0.6)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            animation: 'slideUp 500ms ease-out',
          }}>
            <RiskGauge
              score={data.riskScore ?? (data.cvssScore ?? 0) * 10}
              size="md"
              animated
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#a8b5c8', marginBottom: '4px' }}>
                {data.riskScore !== undefined ? 'Risk Score' : 'CVSS Score'}
              </div>
              <SeverityBadge
                severity={getSeverityType(data.riskScore ?? data.severity)}
                size="md"
              />
            </div>
          </div>
        )}

        {/* Status Card */}
        {(data.status || data.severity) && (
          <MetricCard
            icon={data.status === 'safe' ? '✓' : data.status === 'suspicious' ? '⚠️' : data.status === 'malicious' ? '🚨' : '❓'}
            title={data.status ? 'URL Status' : 'Severity'}
            value={data.status?.toUpperCase() || data.severity?.toUpperCase() || 'UNKNOWN'}
            severity={getSeverityType(data.status || data.severity)}
            animated
          />
        )}

        {/* Confidence Score */}
        {data.confidence !== undefined && (
          <MetricCard
            icon="🎯"
            title="Confidence"
            value={`${data.confidence}%`}
            severity={data.confidence >= 80 ? 'high' : data.confidence >= 60 ? 'medium' : 'low'}
            animated
          />
        )}

        {/* CVE ID Card */}
        {data.cveId && (
          <MetricCard
            icon="🔓"
            title="CVE ID"
            value={data.cveId}
            severity={getSeverityType(data.severity)}
            animated
          />
        )}
      </div>

      {/* Email-specific details */}
      {isEmailAnalysis && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}>
          {data.from && (
            <div style={{
              background: 'rgba(26, 40, 71, 0.4)',
              border: '1px solid rgba(42, 58, 90, 0.6)',
              borderRadius: '8px',
              padding: '12px',
            }}>
              <div style={{ fontSize: '11px', color: '#a8b5c8', marginBottom: '4px' }}>From</div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f0f4f8', wordBreak: 'break-all' }}>
                {data.from.name ? `${data.from.name} <${data.from.email}>` : data.from.email}
              </div>
            </div>
          )}
          {data.subject && (
            <div style={{
              background: 'rgba(26, 40, 71, 0.4)',
              border: '1px solid rgba(42, 58, 90, 0.6)',
              borderRadius: '8px',
              padding: '12px',
            }}>
              <div style={{ fontSize: '11px', color: '#a8b5c8', marginBottom: '4px' }}>Subject</div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f0f4f8' }}>
                {data.subject}
              </div>
            </div>
          )}
          {/* Auth badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {data.spf && <SeverityBadge severity={data.spf === 'pass' ? 'low' : 'high'} size="sm" showIcon={false} />}
            {data.dkim && <SeverityBadge severity={data.dkim === 'pass' ? 'low' : 'high'} size="sm" showIcon={false} />}
            {data.dmarc && <SeverityBadge severity={data.dmarc === 'pass' ? 'low' : 'high'} size="sm" showIcon={false} />}
          </div>
        </div>
      )}

      {/* URL-specific details */}
      {isUrlScan && data.url && (
        <div style={{
          background: 'rgba(26, 40, 71, 0.4)',
          border: '1px solid rgba(42, 58, 90, 0.6)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '24px',
          wordBreak: 'break-all',
          fontSize: '12px',
          color: '#a8b5c8',
          fontFamily: 'monospace',
        }}>
          {data.url}
        </div>
      )}

      {/* Threat Explanation */}
      {data.threatExplanation && (
        <div style={{
          background: 'rgba(26, 40, 71, 0.4)',
          border: '1px solid rgba(42, 58, 90, 0.6)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold' }}>
            Threat Assessment
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#a8b5c8', lineHeight: '1.6' }}>
            {data.threatExplanation}
          </p>
        </div>
      )}

      {/* Summary */}
      {data.summary && (
        <div style={{
          background: 'rgba(26, 40, 71, 0.4)',
          border: '1px solid rgba(42, 58, 90, 0.6)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold' }}>
            Summary
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#a8b5c8', lineHeight: '1.6' }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Evidence Panel */}
      {data.indicators && data.indicators.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <EvidencePanel
            evidence={(data.indicators as any[]).map((ind, idx) => ({
              id: `ind-${idx}`,
              type: 'indicator',
              title: typeof ind === 'string' ? ind : ind.type || 'Indicator',
              description: typeof ind === 'string' ? '' : ind.description || '',
              severity: typeof ind === 'string' ? 'medium' : (ind.severity as any),
            }))}
            title="Suspicious Indicators"
          />
        </div>
      )}

      {/* Affected Software */}
      {data.affectedSoftware && data.affectedSoftware.length > 0 && (
        <div style={{
          background: 'rgba(26, 40, 71, 0.4)',
          border: '1px solid rgba(42, 58, 90, 0.6)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold' }}>
            Affected Software
          </h3>
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}>
            {data.affectedSoftware.map((software, idx) => (
              <li key={idx} style={{ fontSize: '12px', color: '#a8b5c8' }}>
                {software}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline */}
      {data.timeline && data.timeline.length > 0 && (
        <div style={{
          background: 'rgba(26, 40, 71, 0.4)',
          border: '1px solid rgba(42, 58, 90, 0.6)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '13px', fontWeight: 'bold' }}>
            Timeline
          </h3>
          <Timeline
            events={data.timeline.map((entry, idx) => ({
              id: `event-${idx}`,
              timestamp: entry.time,
              title: entry.event,
              severity: 'info',
            }))}
            compact
          />
        </div>
      )}

      {/* Mitigation / Recommendations */}
      {(data.mitigation || data.recommended_actions) && (
        <div style={{
          background: 'rgba(26, 40, 71, 0.4)',
          border: '1px solid rgba(42, 58, 90, 0.6)',
          borderRadius: '8px',
          padding: '16px',
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold' }}>
            Recommended Actions
          </h3>
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}>
            {(data.mitigation || data.recommended_actions || []).map((action, idx) => (
              <li key={idx} style={{ fontSize: '12px', color: '#a8b5c8' }}>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
