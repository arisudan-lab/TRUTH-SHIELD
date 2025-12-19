import { Shield, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo (Left) */}
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">TRUTH-SHIELD</span>
          </div>

          {/* Middle: Links & Copyright integrated together */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">About</a>
            </div>
            <p className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} TRUTH-SHIELD • Fighting misinformation with AI
            </p>
          </div>

          {/* Social (Right) */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/arisudan-lab/TRUTH-SHIELD"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
