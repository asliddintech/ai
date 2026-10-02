import React from 'react';

export function Badge({
  children,
  variant = 'default', // 'default' | 'cyan' | 'amber' | 'indigo' | 'emerald' | 'outline' | 'purple'
  size = 'md',
  className = '',
  icon: Icon
}) {
  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1 font-mono tracking-wider uppercase',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-mono tracking-wide'
  };

  const variantStyles = {
    default: 'bg-studio-800 text-studio-300 border border-white/5',
    cyan: 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30',
    amber: 'bg-amber-950/60 text-amber-300 border border-amber-500/30',
    indigo: 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30',
    emerald: 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30',
    purple: 'bg-purple-950/60 text-purple-300 border border-purple-500/30',
    outline: 'bg-transparent text-studio-400 border border-white/10'
  };

  return (
    <span className={`inline-flex items-center rounded select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
}
