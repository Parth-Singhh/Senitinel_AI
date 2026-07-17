'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

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
        color: theme === 'dark' ? '#fff' : '#000',
      }}>
        Loading threat analysis...
      </div>
    );
  }

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';

  const getRiskColor = (level?: string | number) => {
    if (typeof level === 'number') {
      if (level >= 80) return '#ef4444';
      if (level >= 60) return '#f97316';
      if (level >= 40) return '#eab308';
      return '#22c55e';
    }
    const levelStr = String(level).toLowerCase();
    if (levelStr === 'critical') return '#ef4444';
    if (levelStr === 'high') return '#f97316';
    if (levelStr === 'medium') return '#eab308';
    if (levelStr === 'malicious') return '#ef4444';
    if (levelStr === 'suspicious') return '#f97316';
    return '#22c55e';
  };

  const getRiskLabel = (level?: string | number) => {
    if (typeof level === 'number') {
      if (level >= 80) return 'CRITICAL';
      if (level >= 60) return 'HIGH';
      if (level >= 40) return 'MEDIUM';
      return 'LOW';
    }
    return String(level).toUpperCase();
  };

  const renderRiskMeter = (score?: number) => {
    if (score === undefined) return null;
    const percentage = Math.min(score, 100);
    return (
      <div style={{
        width: '100%',
        height: '8px',
        background: borderColor,
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '8px',
      }}>
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: getRiskColor(score),
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    );
  };

  // Detect report vs single analysis
  const isReport = !!data.reportId;

  if (isReport) {
    // Render incident report
    return (
      <div style={{
        padding: '24px',
        background: bgColor,
        borderRadius: '12px',
        color: textColor,
        maxWidth: '800px',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: `1px solid ${borderColor}`,
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            background: getRiskColor(data.severity),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}>
            🚨
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold' }}>
              {data.title || 'Security Incident Report'}
            </h2>
            <p style={{ margin: 0, fontSize: '12px', color: mutedColor }}>
              {data.reportId} • {new Date(data.timestamp || '').toLocaleString()}
            </p>
          </div>
          <div style={{
            padding: '8px 12px',
            background: getRiskColor(data.severity),
            color: 'white',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}>
            {getRiskLabel(data.severity)}
          </div>
        </div>

        {/* Executive Summary */}
        <div style={{
          background: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>
            Executive Summary
          </h3>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: mutedColor }}>
            {data.executive_summary}
          </p>
        </div>

        {/* Threat Analysis */}
        {data.threat_analysis && (
          <div style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>
              Threat Analysis
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {data.threat_analysis.email_threat && (
                <div style={{
                  padding: '12px',
                  background: isDark ? '#1a1f2e' : '#f1f5f9',
                  borderRadius: '6px',
                  borderLeft: `3px solid ${getRiskColor(data.threat_analysis.email_threat.status)}`,
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                    📧 Email Threat
                  </div>
                  <div style={{ fontSize: '11px', color: mutedColor }}>
                    Status: <strong>{data.threat_analysis.email_threat.status}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: mutedColor }}>
                    Risk: <strong>{data.threat_analysis.email_threat.risk_score}%</strong>
                  </div>
                </div>
              )}
              {data.threat_analysis.url_threat && (
                <div style={{
                  padding: '12px',
                  background: isDark ? '#1a1f2e' : '#f1f5f9',
                  borderRadius: '6px',
                  borderLeft: `3px solid ${getRiskColor(data.threat_analysis.url_threat.status)}`,
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                    🔗 URL Threat
                  </div>
                  <div style={{ fontSize: '11px', color: mutedColor }}>
                    Status: <strong>{data.threat_analysis.url_threat.status}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: mutedColor }}>
                    Risk: <strong>{data.threat_analysis.url_threat.risk_score}%</strong>
                  </div>
                </div>
              )}
              {data.threat_analysis.vulnerability_threat && (
                <div style={{
                  padding: '12px',
                  background: isDark ? '#1a1f2e' : '#f1f5f9',
                  borderRadius: '6px',
                  borderLeft: `3px solid ${getRiskColor(data.threat_analysis.vulnerability_threat.severity)}`,
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                    🔓 Vulnerability
                  </div>
                  <div style={{ fontSize: '11px', color: mutedColor }}>
                    CVE: <strong>{data.threat_analysis.vulnerability_threat.cve_id}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: mutedColor }}>
                    CVSS: <strong>{data.threat_analysis.vulnerability_threat.cvss_score}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        {data.timeline && data.timeline.length > 0 && (
          <div style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>
              Timeline
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.timeline.map((entry: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: getRiskColor(data.severity),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    flexShrink: 0,
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                      {new Date(entry.time).toLocaleTimeString()}
                    </div>
                    <div style={{ fontSize: '12px', color: mutedColor }}>
                      {entry.event}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        {data.recommended_actions && data.recommended_actions.length > 0 && (
          <div style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '16px',
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>
              Recommended Actions
            </h3>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {data.recommended_actions.map((action: string, idx: number) => (
                <li key={idx} style={{ fontSize: '12px', color: mutedColor }}>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Render single analysis (email, URL, or CVE)
  const isEmailAnalysis = !!data.riskScore && !data.url && !data.cveId;
  const isUrlScan = !!data.url;
  const isCveAnalysis = !!data.cveId;

  return (
    <div style={{
      padding: '24px',
      background: bgColor,
      borderRadius: '12px',
      color: textColor,
      maxWidth: '600px',
    }}>
      {isEmailAnalysis && (
        <>
          {/* Email Analysis Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '8px',
              background: getRiskColor(data.riskScore),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}>
              📧
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold' }}>
                Email Analysis
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: mutedColor }}>
                Phishing Risk Assessment
              </p>
            </div>
            <div style={{
              padding: '8px 12px',
              background: getRiskColor(data.riskLevel),
              color: 'white',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              {getRiskLabel(data.riskLevel)}
            </div>
          </div>

          {/* Risk Score */}
          <div style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Risk Score</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: getRiskColor(data.riskScore) }}>
                {data.riskScore}%
              </span>
            </div>
            {renderRiskMeter(data.riskScore)}
          </div>

          {/* Indicators */}
          {data.indicators && data.indicators.length > 0 && (
            <div style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold' }}>
                Suspicious Indicators
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(data.indicators as any[]).map((indicator: any, idx: number) => (
                  <div key={idx} style={{
                    padding: '10px',
                    background: isDark ? '#1a1f2e' : '#f1f5f9',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${getRiskColor(indicator.severity || 'medium')}`,
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '2px' }}>
                      {indicator.type}
                    </div>
                    <div style={{ fontSize: '11px', color: mutedColor }}>
                      {indicator.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mitigation */}
          {data.mitigation && data.mitigation.length > 0 && (
            <div style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '16px',
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold' }}>
                Mitigation Recommendations
              </h3>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                {data.mitigation.map((item: string, idx: number) => (
                  <li key={idx} style={{ fontSize: '11px', color: mutedColor }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {isUrlScan && (
        <>
          {/* URL Scan Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '8px',
              background: getRiskColor(data.status),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}>
              🔗
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold' }}>
                URL Scan Result
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: mutedColor, wordBreak: 'break-all' }}>
                {data.url}
              </p>
            </div>
            <div style={{
              padding: '8px 12px',
              background: getRiskColor(data.status),
              color: 'white',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              {getRiskLabel(data.status)}
            </div>
          </div>

          {/* Threat Explanation */}
          <div style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold' }}>
              Threat Assessment
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: mutedColor, lineHeight: '1.5' }}>
              {data.threatExplanation}
            </p>
          </div>

          {/* Risk Score */}
          <div style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Risk Score</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: getRiskColor(data.riskScore) }}>
                {data.riskScore}%
              </span>
            </div>
            {renderRiskMeter(data.riskScore)}
          </div>

          {/* Indicators */}
          {data.indicators && data.indicators.length > 0 && (
            <div style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '16px',
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold' }}>
                Threat Indicators
              </h3>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                {(data.indicators as string[]).map((indicator: string, idx: number) => (
                  <li key={idx} style={{ fontSize: '11px', color: mutedColor }}>
                    {indicator}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {isCveAnalysis && (
        <>
          {/* CVE Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '8px',
              background: getRiskColor(data.severity),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}>
              🔓
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold' }}>
                {data.cveId}
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: mutedColor }}>
                Vulnerability Information
              </p>
            </div>
            <div style={{
              padding: '8px 12px',
              background: getRiskColor(data.severity),
              color: 'white',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              {getRiskLabel(data.severity)}
            </div>
          </div>

          {/* Summary */}
          <div style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold' }}>
              Summary
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: mutedColor, lineHeight: '1.5' }}>
              {data.summary}
            </p>
          </div>

          {/* CVSS Score */}
          <div style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold' }}>CVSS Score</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: getRiskColor(data.cvssScore) }}>
                {data.cvssScore}/10
              </span>
            </div>
            {renderRiskMeter((data.cvssScore ?? 0) * 10)}
          </div>

          {/* Affected Software */}
          {data.affectedSoftware && data.affectedSoftware.length > 0 && (
            <div style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
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
                {data.affectedSoftware.map((software: string, idx: number) => (
                  <li key={idx} style={{ fontSize: '11px', color: mutedColor }}>
                    {software}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mitigation */}
          {data.mitigation && data.mitigation.length > 0 && (
            <div style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '16px',
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold' }}>
                Mitigation Recommendations
              </h3>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                {data.mitigation.map((item: string, idx: number) => (
                  <li key={idx} style={{ fontSize: '11px', color: mutedColor }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
