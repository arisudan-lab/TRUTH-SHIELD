import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfidenceBar } from './ConfidenceBar';

interface ResultCardProps {
  isLoading?: boolean;
  result?: {
    isFake: boolean;
    confidence: number;
    details?: string;
  };
  type: 'fake-news' | 'deepfake';
}

export function ResultCard({ isLoading, result, type }: ResultCardProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-6 scale-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 animate-pulse" />
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-full animate-pulse" />
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!result) return null;

  const isFake = result.isFake;
  const Icon = isFake ? XCircle : CheckCircle;
  const title = type === 'fake-news' 
    ? (isFake ? 'Likely Fake News' : 'Likely Authentic')
    : (isFake ? 'Deepfake Detected' : 'Appears Genuine');

  return (
    <div className={cn(
      'glass-card p-6 scale-in border-l-4',
      isFake ? 'border-l-destructive' : 'border-l-success'
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center',
          isFake ? 'bg-destructive/20' : 'bg-success/20'
        )}>
          <Icon className={cn(
            'w-6 h-6',
            isFake ? 'text-destructive' : 'text-success'
          )} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">Analysis Complete</p>
        </div>
      </div>

      {/* Confidence Bars */}
      <div className="space-y-4">
        <ConfidenceBar
          value={isFake ? 100 - result.confidence : result.confidence}
          label="Authenticity Score"
          type="real"
        />
        
        <ConfidenceBar
          value={isFake ? result.confidence : 100 - result.confidence}
          label="Fake Probability"
          type="fake"
        />
      </div>



      {/* Details */}
      {result.details && (
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{result.details}</p>
          </div>
        </div>
      )}
    </div>
  );
}
