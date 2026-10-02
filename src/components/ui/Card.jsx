import React from 'react';

export function Card({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-studio-900/90 rounded-lg border border-white/[0.07] p-5
        transition-all duration-200
        ${hoverEffect ? 'hover:border-white/20 hover:bg-studio-850 hover:shadow-panel cursor-pointer' : ''}
        ${glow ? 'shadow-glow-indigo' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
