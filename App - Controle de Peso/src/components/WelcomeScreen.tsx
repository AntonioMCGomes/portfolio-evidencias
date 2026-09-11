import { ArrowRight, Dumbbell } from 'lucide-react';
import { Button } from './ui/button';
import welcomeImage from 'figma:asset/f15bd8b61a7a6127c243bee16e42d27c96da3983.png';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${welcomeImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="bg-emerald-500 p-3 rounded-lg">
            <Dumbbell className="size-8 text-white" />
          </div>
          <h1 className="text-white">
            <span className="text-emerald-400">Fit</span>Connect
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-white/90 mb-3 max-w-lg mx-auto">
          Acompanhe sua evolução, registre seus treinos e alcance seus objetivos
        </p>
        
        <p className="text-white/70 mb-12 max-w-md mx-auto">
          Monitore seus exercícios, acompanhe o progresso e veja sua força crescer a cada treino
        </p>

        {/* CTA Button */}
        <Button 
          onClick={onStart}
          size="lg"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 gap-3 shadow-xl shadow-emerald-500/20"
        >
          Começar Agora
          <ArrowRight className="size-5" />
        </Button>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-white/80">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="mb-2">📊</div>
            <h3 className="mb-1">Gráficos de Evolução</h3>
            <p className="text-white/60">
              Visualize seu progresso com gráficos detalhados
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="mb-2">💪</div>
            <h3 className="mb-1">Controle de Carga</h3>
            <p className="text-white/60">
              Registre peso, séries e repetições
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="mb-2">📅</div>
            <h3 className="mb-1">Histórico Completo</h3>
            <p className="text-white/60">
              Acesse todos os seus treinos anteriores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
