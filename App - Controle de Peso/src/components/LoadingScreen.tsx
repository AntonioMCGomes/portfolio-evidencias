import { useEffect, useState } from 'react';
import { Dumbbell } from 'lucide-react';
import welcomeImage from 'figma:asset/f15bd8b61a7a6127c243bee16e42d27c96da3983.png';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${welcomeImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Animated Logo */}
        <div className="mb-8 flex items-center justify-center gap-3 animate-pulse">
          <div className="bg-emerald-500 p-4 rounded-lg shadow-xl shadow-emerald-500/50">
            <Dumbbell className="size-12 text-white animate-bounce" style={{ animationDuration: '1.5s' }} />
          </div>
        </div>

        <h1 className="text-white mb-2">
          <span className="text-emerald-400">Fit</span>Connect
        </h1>
        
        <p className="text-white/70 mb-8">
          Carregando sua academia digital...
        </p>

        {/* Progress Bar */}
        <div className="max-w-xs mx-auto">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-300 ease-out shadow-lg shadow-emerald-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/60 mt-3">{progress}%</p>
        </div>
      </div>
    </div>
  );
}
