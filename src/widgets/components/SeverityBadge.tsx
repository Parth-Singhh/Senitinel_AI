'use client';

import React from 'react';

interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'safe';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function SeverityBadge({ severity, size = 'md', showIcon = true }: SeverityBadgeProps) {
  const config = {
    critical: { color: '#ff1744', label: 'CRITICAL', icon: '🔴' },
    high: { color: '#ff6d00', label: 'HIGH', icon: '🟠' },
    medium: { color: '#ffd600', label: 'MEDIUM', icon: '🟡' },
    low: { color: '#00e676', label: 'LOW', icon: '🟢' },
    info: { color: '#00d9ff', label: 'INFO', icon: '🔵' },
    safe: { color: '#00e676', label: 'SAFE', icon: '✓' },
  };

  const { color, label, icon } = config[severity];

  const sizeMap = {
    sm: { padding: '4px 8px', fontSize: '10px' },
    md: { padding: '6px 12px', fontSize: '12px' },
    lg: { padding: '8px 16px', fontSize: '14px' },
  };

  const { padding, fontSize } = sizeMap[size];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding,
        background: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.15)`,
        border: `1px solid ${color}`,
        borderRadius: '6px',
        color,
        fontSize,
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
      }}
    >
      {showIcon && <span>{icon}</span>}
      {label}
    </div>
  );
}
