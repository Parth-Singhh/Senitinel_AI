'use client';

import React from 'react';

interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'info';
  icon?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  compact?: boolean;
}

export function Timeline({ events, compact = false }: TimelineProps) {
  const severityColors = {
    critical: '#ff1744',
    high: '#ff6d00',
    medium: '#ffd600',
    low: '#00e676',
    info: '#00d9ff',
  };

  return (
    <div style={{ position: 'relative', paddingLeft: compact ? '24px' : '40px' }}>
      {/* Vertical line */}
      <div
        style={{
          position: 'absolute',
          left: compact ? '8px' : '16px',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'linear-gradient(180deg, rgba(0, 217, 255, 0.3) 0%, rgba(0, 217, 255, 0) 100%)',
        }}
      />

      {/* Events */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '12px' : '20px' }}>
        {events.map((event, idx) => {
          const color = event.severity ? severityColors[event.severity] : '#00d9ff';

          return (
            <div key={event.id} style={{ position: 'relative' }}>
              {/* Timeline dot */}
              <div
                style={{
                  position: 'absolute',
                  left: compact ? '-28px' : '-44px',
                  top: '2px',
                  width: compact ? '16px' : '24px',
                  height: compact ? '16px' : '24px',
                  borderRadius: '50%',
                  background: color,
                  border: '3px solid #0a0e27',
                  boxShadow: `0 0 12px ${color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: compact ? '8px' : '12px',
                }}
              >
                {event.icon}
              </div>

              {/* Content */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ fontSize: compact ? '11px' : '13px', fontWeight: 'bold', color: '#f0f4f8' }}>
                    {event.title}
                  </div>
                  <div style={{ fontSize: compact ? '10px' : '11px', color: '#7a8599' }}>
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                {event.description && (
                  <div style={{ fontSize: compact ? '10px' : '12px', color: '#a8b5c8', lineHeight: '1.4' }}>
                    {event.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
