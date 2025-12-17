import { useState, useRef } from 'react';
import { Video, Upload, Scan, RotateCcw, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export function DeepfakeSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: 'Invalid File',
        description: 'Please select a video file.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        title: 'File Too Large',
        description: 'Please select a video under 100MB.',
        variant: 'destructive',
      });
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleAnalyze = async () => {
    if (!videoFile) {
      toast({
        title: 'Video Required',
        description: 'Please upload a video to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Simulating API call - replace with actual endpoint
      // const formData = new FormData();
      // formData.append('video', videoFile);
      // const response = await fetch('/api/deepfake', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();

      // Simulated response for demo
      await new Promise(resolve => setTimeout(resolve, 3000));
      const fakeScore = Math.random() * 100;
      const isFake = fakeScore > 50;
      
      setResult({
        isFake,
        confidence: isFake ? fakeScore : 100 - fakeScore,
        details: isFake 
          ? 'Facial inconsistencies detected around eye movement and lip sync patterns. The audio waveform shows signs of synthesis.'
          : 'No significant manipulation markers detected. Facial movements and audio appear consistent with authentic recordings.',
      });
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'Unable to analyze the video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section
      id="deepfake"
      ref={ref}
      className="min-h-screen py-24 relative"
    >
      {/* Background Accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-96 bg-gradient-to-l from-accent/5 to-transparent blur-3xl" />

      <div className="container mx-auto px-4">
        <div className={cn(
          'max-w-4xl mx-auto',
          isVisible ? 'fade-in-up' : 'opacity-0'
        )}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Video className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">Video Analysis</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Deepfake <span className="text-gradient">Detection</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Upload a video to detect AI-generated or manipulated content using advanced facial and audio analysis.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Side */}
            <div className={cn(
              'glass-card p-6',
              isVisible ? 'slide-in-left' : 'opacity-0'
            )}>
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Upload Video</h3>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />

              {!videoPreview ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 min-h-[250px] flex flex-col items-center justify-center',
                    isDragging 
                      ? 'border-accent bg-accent/10' 
                      : 'border-border/50 hover:border-accent/50 hover:bg-muted/30'
                  )}
                >
                  <Upload className={cn(
                    'w-12 h-12 mb-4 transition-colors',
                    isDragging ? 'text-accent' : 'text-muted-foreground'
                  )} />
                  <p className="text-foreground font-medium mb-2">
                    {isDragging ? 'Drop your video here' : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports MP4, MOV, AVI (max 100MB)
                  </p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden bg-muted/50">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full aspect-video object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={(e) => { e.stopPropagation(); handleReset(); }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <Button
                  variant="glow"
                  onClick={handleAnalyze}
                  disabled={isLoading || !videoFile}
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

            {/* Result Side */}
            <div className={cn(
              isVisible ? 'slide-in-right animation-delay-200' : 'opacity-0'
            )}>
              {(isLoading || result) ? (
                <ResultCard
                  isLoading={isLoading}
                  result={result || undefined}
                  type="deepfake"
                />
              ) : (
                <div className="glass-card p-6 h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Upload a video to see analysis results</p>
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
