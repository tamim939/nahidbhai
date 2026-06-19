import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SignalBar } from './SignalBar';
import { WelcomeModal } from './WelcomeModal';
import { ResultOverlay } from './ResultOverlay';
import { useSignals } from '@/src/hooks/useSignals';
import { useCountdown } from '@/src/hooks/useCountdown';
import { useHeartbeat } from '@/src/hooks/useHeartbeat';
import { cn } from '@/src/lib/utils';

export const UserPanel: React.FC = () => {
  const { period: currentPeriod, secondsLeft } = useCountdown();
  
  const [isVipMode] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [vipSignal, setVipSignal] = useState<string>('');
  const [vipPeriod, setVipPeriod] = useState<string>('');
  const [vipSeconds, setVipSeconds] = useState(5);
  const [vipState, setVipState] = useState<'WAITING' | 'ACTIVE'>('WAITING');
  const [result, setResult] = useState<'WIN' | 'LOSS' | null>(null);

  useEffect(() => {
    // Force refresh the layout for dynamic viewport
    window.addEventListener('resize', () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    });
  }, []);

  useEffect(() => {
    let interval: number;
    if (isVipMode) {
      interval = window.setInterval(() => {
        setVipSeconds(prev => {
          if (vipState === 'ACTIVE' && prev > 0) {
            return prev - 1;
          }
          return prev;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVipMode, vipState]);

  /* 
    Automatic auto-trigger removed to ensure purely manual interaction via 'Next' button
  useEffect(() => {
    if (isVipMode && vipState === 'ACTIVE' && vipSeconds === 0 && !isAnalyzing) {
      generateNewVipSignal();
    }
  }, [vipSeconds, isVipMode, vipState, isAnalyzing]);
  */
  
  const handleManualSync = () => {
    if (isAnalyzing || vipState === 'ACTIVE') return;
    generateNewVipSignal();
  };

  const handleNextSignal = () => {
    // Force a new signal regardless of state
    generateNewVipSignal();
  };

  const generateNewVipSignal = async () => {
    setIsAnalyzing(true);
    setVipSignal('');
    
    // Force 0.8 seconds loading delay for a very snappy feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Fallback distribution
      const rand = Math.random();
      let multiplier;
      if (rand < 0.7) multiplier = (Math.random() * (2.8 - 1.2) + 1.2).toFixed(2);
      else multiplier = (Math.random() * (6.5 - 2.8) + 2.8).toFixed(2);
      
      setVipSignal(multiplier + 'x');
      setVipPeriod((Date.now() % 1000000).toString());
      setVipState('ACTIVE');
      setVipSeconds(15);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useHeartbeat();

  return (
    <div className="flex flex-col h-[100dvh] bg-[#020205] relative font-sans select-text overflow-hidden">
      {/* Premium Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Dynamic Mesh Gradients */}
        <motion.div 
          animate={{ 
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full bg-amber-500/10 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 100, 0],
            y: [0, 100, -100, 0],
            scale: [1, 0.8, 1.2, 1],
          }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute bottom-[-15%] right-[-15%] w-[80%] h-[80%] rounded-full bg-yellow-600/10 blur-[150px]" 
        />
        
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] rounded-full bg-orange-600/5 blur-[100px] animate-pulse duration-[5000ms]" />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.95)_100%)]" />
        
        {/* Premium Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} 
        />
        
        {/* Golden Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style={{ backgroundImage: 'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
        />
        
        {/* Dynamic Glowing Blobs */}
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,rgba(251,191,36,0.05)_50%,transparent_100%)] animate-[spin_10s_linear_infinite]"
        />

        {/* Subtle Floating Dust Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <motion.div 
              key={i}
              initial={{ 
                x: `${Math.random() * 100}%`, 
                y: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5
              }}
              animate={{ 
                y: [null, `${Math.random() * -50}px`, null],
                x: [null, `${(Math.random() - 0.5) * 40}px`, null],
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 5 + Math.random() * 10,
                ease: "easeInOut"
              }}
              className="absolute w-1 h-1 bg-amber-400 rounded-full blur-[1px]"
            />
          ))}
        </div>
      </div>

      <WelcomeModal />
      <ResultOverlay result={result} onComplete={() => setResult(null)} />
      
      {/* Centered Predictor Panel */}
      <div className="flex-1 relative z-10 flex items-center justify-center p-6 pb-20">
        <div className="w-full max-w-[360px] pointer-events-auto">
          <SignalBar 
            signal={vipSignal} 
            period={vipPeriod} 
            currentPeriod={vipPeriod} 
            secondsLeft={vipSeconds} 
            maxSeconds={vipState === 'WAITING' ? 5 : 15}
            isVip={true}
            onManualSync={handleManualSync}
            onNextSignal={handleNextSignal}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>
    </div>
  );
};
