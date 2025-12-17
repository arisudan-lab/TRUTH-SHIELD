import { Shield, Scan, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

export function Hero() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div
        ref={ref}
        className={cn(
          'container mx-auto px-4 text-center relative z-10',
          isVisible ? 'fade-in-up' : 'opacity-0'
        )}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">AI-Powered Detection</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Detect{' '}
          <span className="text-gradient">Misinformation</span>
          <br />
          Before It Spreads
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Advanced AI technology to identify fake news and deepfake videos in seconds. 
          Protect yourself and others from digital deception.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            variant="hero"
            size="xl"
            onClick={() => handleScroll('#fake-news')}
            className="group"
          >
            <Scan className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Analyze Text
          </Button>
          <Button
            variant="outline"
            size="xl"
            onClick={() => handleScroll('#deepfake')}
            className="group border-border/50 hover:border-primary/50"
          >
            <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Check Video
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
          {[
            { value: '99.2%', label: 'Accuracy' },
            { value: '< 3s', label: 'Analysis Time' },
            { value: '1M+', label: 'Scans Done' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                'text-center',
                isVisible ? 'fade-in-up' : 'opacity-0'
              )}
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
