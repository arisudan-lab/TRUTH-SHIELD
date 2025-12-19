import { useState } from 'react';
import { FileText, Scan, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from './LoadingSpinner';
import { ResultCard } from './ResultCard';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface AnalysisResult {
  isFake: boolean;
  confidence: number;
  details?: string;
}

export function FakeNewsSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please enter some text to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // 1. Get the API URL from environment variables
      const API_BASE_URL = import.meta.env.VITE_API_URL || '';

      // 2. Use the full URL for the fetch call
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      
      const isFake = !data.is_real;
      const confidencePercent = data.confidence * 100;

      setResult({
        isFake,
        confidence: confidencePercent,
        details: isFake
          ? 'The model thinks this content is likely fake or misleading.'
          : 'The model thinks this content looks like real news.',
      });
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'Unable to analyze the text. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setText('');
    setResult(null);
  };

  return (
    <section
      id="fake-news"
      ref={ref}
      className="min-h-screen py-24 relative"
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-96 bg-gradient-to-r from-primary/5 to-transparent blur-3xl" />

      <div className="container mx-auto px-4">
        <div className={cn(
          'max-w-4xl mx-auto',
          isVisible ? 'fade-in-up' : 'opacity-0'
        )}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Text Analysis</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Fake News <span className="text-gradient">Detection</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Paste any article, news story, or social media post to analyze its authenticity using our AI model.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className={cn(
              'glass-card p-6',
              isVisible ? 'slide-in-left' : 'opacity-0'
            )}>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Input Text</h3>
              </div>

              <Textarea
                placeholder="Paste the article or news content here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[250px] bg-muted/50 border-border/50 focus:border-primary/50 resize-none mb-4"
              />

              <div className="flex gap-3">
                <Button
                  variant="glow"
                  onClick={handleAnalyze}
                  disabled={isLoading || !text.trim()}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4" />
                      Analyze
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className={cn(
              isVisible ? 'slide-in-right animation-delay-200' : 'opacity-0'
            )}>
              {(isLoading || result) ? (
                <ResultCard
                  isLoading={isLoading}
                  result={result || undefined}
                  type="fake-news"
                />
              ) : (
                <div className="glass-card p-6 h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Scan className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Results will appear here after analysis</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
