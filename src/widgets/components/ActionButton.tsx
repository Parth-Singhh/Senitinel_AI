'use client';

import React from 'react';

interface ActionButtonProps {
  icon?: string;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
}

export function ActionButton({
  icon,
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  tooltip,
}: ActionButtonProps) {
  const variantConfig = {
    primary: { bg: 'rgba(0, 217, 255, 0.15)', border: '#00d9ff', text: '#00d9ff', hover: 'rgba(0, 217, 255, 0.25)' },
    secondary: { bg: 'rgba(42, 58, 90, 0.4)', border: '#2a3a5a', text: '#a8b5c8', hover: 'rgba(42, 58, 90, 0.6)' },
    danger: { bg: 'rgba(255, 23, 68, 0.15)', border: '#ff1744', text: '#ff1744', hover: 'rgba(255, 23, 68, 0.25)' },
    success: { bg: 'rgba(0, 230, 118, 0.15)', border: '#00e676', text: '#00e676', hover: 'rgba(0, 230, 118, 0.25)' },
  };

  const sizeMap = {
    sm: { padding: '6px 12px', fontSize: '11px', gap: '6px' },
    md: { padding: '8px 16px', fontSize: '12px', gap: '8px' },
    lg: { padding: '10px 20px', fontSize: '13px', gap: '10px' },
  };

  const config = variantConfig[variant];
  const sizeConfig = sizeMap[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      title={tooltip}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeConfig.gap,
        padding: sizeConfig.padding,
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: '6px',
        color: config.text,
        fontSize: sizeConfig.fontSize,
        fontWeight: '600',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 150ms ease',
        opacity: disabled || loading ? 0.5 : 1,
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.background = config.hover;
          e.currentTarget.style.boxShadow = `0 0 12px ${config.border}`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = config.bg;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {loading ? (
        <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
      ) : (
        icon && <span>{icon}</span>
      )}
      {label}
    </button>
  );
}
