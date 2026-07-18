'use client';

import React from 'react';

interface RiskGaugeProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export function RiskGauge({ score, size = 'md', showLabel = true, animated = true }: RiskGaugeProps) {
  const sizeMap = {
    sm: { radius: 40, width: 100, height: 100 },
    md: { radius: 60, width: 150, height: 150 },
    lg: { radius: 80, width: 200, height: 200 },
  };

  const { radius, width, height } = sizeMap[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getRiskColor = (s: number) => {
    if (s >= 80) return '#ff1744';
    if (s >= 60) return '#ff6d00';
    if (s >= 40) return '#ffd600';
    return '#00e676';
  };

  const getRiskLabel = (s: number) => {
    if (s >= 80) return 'CRITICAL';
    if (s >= 60) return 'HIGH';
    if (s >= 40) return 'MEDIUM';
    return 'LOW';
  };

  const color = getRiskColor(score);
  const label = getRiskLabel(score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <svg width={width} height={height} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke="rgba(42, 58, 90, 0.3)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? strokeDashoffset : 0}
          strokeLinecap="round"
          style={{
            transition: animated ? 'stroke-dashoffset 1s ease-out' : 'none',
            filter: 'drop-shadow(0 0 10px rgba(0, 217, 255, 0.3))',
          }}
        />
      </svg>

      {/* Center text */}
      <div style={{ textAlign: 'center', marginTop: '-60px' }}>
        <div style={{ fontSize: size === 'lg' ? '32px' : size === 'md' ? '24px' : '16px', fontWeight: 'bold', color }}>
          {score}%
        </div>
        {showLabel && (
          <div style={{ fontSize: '12px', color: '#a8b5c8', marginTop: '4px' }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
