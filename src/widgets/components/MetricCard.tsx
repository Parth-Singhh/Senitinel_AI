'use client';

import React from 'react';

interface MetricCardProps {
  icon?: string;
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'info';
  onClick?: () => void;
  animated?: boolean;
}

export function MetricCard({
  icon,
  title,
  value,
  unit,
  trend,
  trendValue,
  severity = 'info',
  onClick,
  animated = true,
}: MetricCardProps) {
  const severityColors = {
    critical: '#ff1744',
    high: '#ff6d00',
    medium: '#ffd600',
    low: '#00e676',
    info: '#00d9ff',
  };

  const color = severityColors[severity];

  return (
    <div
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, rgba(26, 40, 71, 0.8) 0%, rgba(21, 29, 59, 0.6) 100%)',
        border: `1px solid rgba(42, 58, 90, 0.6)`,
        borderRadius: '12px',
        padding: '16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        animation: animated ? 'slideUp 500ms ease-out' : 'none',
        '&:hover': onClick ? {
          borderColor: color,
          boxShadow: `0 0 20px rgba(0, 217, 255, 0.2)`,
          transform: 'translateY(-2px)',
        } : {},
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.boxShadow = `0 0 20px rgba(0, 217, 255, 0.2)`;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = 'rgba(42, 58, 90, 0.6)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ fontSize: '20px' }}>{icon}</div>
        {trend && (
          <div style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: trend === 'up' ? '#00e676' : trend === 'down' ? '#ff1744' : '#a8b5c8',
          }}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontSize: '12px', color: '#a8b5c8', marginBottom: '4px' }}>
          {title}
        </div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f0f4f8' }}>
          {value}
          {unit && <span style={{ fontSize: '14px', color: '#7a8599', marginLeft: '4px' }}>{unit}</span>}
        </div>
      </div>

      {/* Accent bar */}
      <div style={{
        height: '3px',
        background: color,
        borderRadius: '2px',
        marginTop: '12px',
        opacity: 0.6,
      }} />
    </div>
  );
}
