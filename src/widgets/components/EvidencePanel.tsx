'use client';

import React, { useState } from 'react';

interface Evidence {
  id: string;
  type: 'indicator' | 'signal' | 'finding' | 'recommendation';
  title: string;
  description: string;
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'info';
  details?: Record<string, any>;
}

interface EvidencePanelProps {
  evidence: Evidence[];
  title?: string;
  compact?: boolean;
}

export function EvidencePanel({ evidence, title = 'Evidence & Findings', compact = false }: EvidencePanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const typeConfig = {
    indicator: { icon: '🔍', color: '#00d9ff', label: 'Indicator' },
    signal: { icon: '📡', color: '#ffd600', label: 'Signal' },
    finding: { icon: '⚠️', color: '#ff6d00', label: 'Finding' },
    recommendation: { icon: '✓', color: '#00e676', label: 'Recommendation' },
  };

  const severityColors = {
    critical: '#ff1744',
    high: '#ff6d00',
    medium: '#ffd600',
    low: '#00e676',
    info: '#00d9ff',
  };

  return (
    <div style={{
      background: 'rgba(26, 40, 71, 0.4)',
      border: '1px solid rgba(42, 58, 90, 0.6)',
      borderRadius: '12px',
      padding: compact ? '12px' : '16px',
      overflow: 'hidden',
    }}>
      {title && (
        <div style={{
          fontSize: compact ? '12px' : '14px',
          fontWeight: 'bold',
          color: '#f0f4f8',
          marginBottom: compact ? '8px' : '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(42, 58, 90, 0.4)',
        }}>
          {title}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '6px' : '8px' }}>
        {evidence.map((item) => {
          const typeInfo = typeConfig[item.type];
          const severityColor = item.severity ? severityColors[item.severity] : typeInfo.color;
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              style={{
                background: 'rgba(15, 21, 53, 0.6)',
                border: `1px solid ${severityColor}`,
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'all 250ms ease',
              }}
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                style={{
                  padding: compact ? '8px 12px' : '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: `rgba(${parseInt(severityColor.slice(1, 3), 16)}, ${parseInt(severityColor.slice(3, 5), 16)}, ${parseInt(severityColor.slice(5, 7), 16)}, 0.05)`,
                  transition: 'background 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(${parseInt(severityColor.slice(1, 3), 16)}, ${parseInt(severityColor.slice(3, 5), 16)}, ${parseInt(severityColor.slice(5, 7), 16)}, 0.1)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `rgba(${parseInt(severityColor.slice(1, 3), 16)}, ${parseInt(severityColor.slice(3, 5), 16)}, ${parseInt(severityColor.slice(5, 7), 16)}, 0.05)`;
                }}
              >
                <div style={{ fontSize: compact ? '14px' : '16px' }}>{typeInfo.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: compact ? '11px' : '12px', fontWeight: 'bold', color: '#f0f4f8' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: compact ? '10px' : '11px', color: '#a8b5c8', marginTop: '2px' }}>
                    {item.description}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: severityColor }}>
                  {isExpanded ? '▼' : '▶'}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && item.details && (
                <div style={{
                  padding: compact ? '8px 12px' : '12px 16px',
                  background: 'rgba(10, 14, 39, 0.8)',
                  borderTop: `1px solid ${severityColor}`,
                  fontSize: compact ? '10px' : '11px',
                  color: '#a8b5c8',
                  fontFamily: 'monospace',
                  maxHeight: '200px',
                  overflow: 'auto',
                }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {JSON.stringify(item.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
