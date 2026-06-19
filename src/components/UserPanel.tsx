import React, { useState, useEffect } from 'react';
import { SignalBar } from './SignalBar';
import { WelcomeModal } from './WelcomeModal';
import { ResultOverlay } from './ResultOverlay';
import { useSignals } from '@/src/hooks/useSignals';
import { useCountdown } from '@/src/hooks/useCountdown';
import { useHeartbeat } from '@/src/hooks/useHeartbeat';
import { cn } from '@/src/lib/utils';

export const UserPanel: React.FC = () => {
  const { period: currentPeriod, secondsLeft } = useCountdown();
  
  const [currentUrl] = useState('https://www.l444.win/?r=lxc3543');
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
    <div className="flex flex-col h-[100dvh] bg-white relative font-sans select-text overflow-hidden">
      <WelcomeModal />
      <ResultOverlay result={result} onComplete={() => setResult(null)} />
      <div className="z-20 relative shrink-0">
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
      <div className="flex-1 relative z-0 overflow-hidden bg-white">
        <iframe
          src={currentUrl}
          className="absolute inset-0 w-full h-full border-none bg-white"
          title="Game View"
          allow="clipboard-write; fullscreen"
          loading="lazy"
        />
      </div>
    </div>
  );
};
