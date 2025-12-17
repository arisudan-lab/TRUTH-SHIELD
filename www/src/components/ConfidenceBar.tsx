import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ConfidenceBarProps {
  value: number; // 0-100
  label: string;
  type?: 'fake' | 'real' | 'neutral';
  animate?: boolean;
}

export function ConfidenceBar({ value, label, type = 'neutral', animate = true }: ConfidenceBarProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setDisplayValue(value), 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animate]);

  const getColorClass = () => {
    if (type === 'fake') return 'bg-gradient-to-r from-destructive to-warning';
    if (type === 'real') return 'bg-gradient-to-r from-success to-primary';
    return 'bg-gradient-to-r from-primary to-accent';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className={cn(
          'text-sm font-mono font-bold',
          type === 'fake' && 'text-destructive',
          type === 'real' && 'text-success',
          type === 'neutral' && 'text-primary'
        )}>
          {displayValue.toFixed(1)}%
        </span>
      </div>
      <div className="confidence-bar">
        <div
          className={cn('confidence-fill', getColorClass())}
          style={{ width: animate ? `${displayValue}%` : `${value}%` }}
        />
      </div>
    </div>
  );
}
