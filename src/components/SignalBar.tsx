import React from 'react';
import { cn } from '@/src/lib/utils';

import { motion } from 'motion/react';

interface SignalBarProps {
  signal: string;
  period: string;
  currentPeriod: string;
  secondsLeft: number;
  maxSeconds?: number;
  isVip?: boolean;
  onManualSync?: () => void;
  onNextSignal?: () => void;
  isAnalyzing?: boolean;
}

export const SignalBar: React.FC<SignalBarProps> = ({
  signal,
  period,
  currentPeriod,
  secondsLeft,
  maxSeconds = 30,
  isVip = false,
  onManualSync,
  onNextSignal,
  isAnalyzing = false,
}) => {
  const isActive = signal && period && (isVip || period === currentPeriod);
  const progress = ((maxSeconds - secondsLeft) / maxSeconds) * 100;
  const [boxScale, setBoxScale] = React.useState(1);

  const handleGetSignal = () => {
    if (isAnalyzing || signal) return;
    onManualSync?.();
  };

  const handleNext = () => {
    if (isAnalyzing) return;
    onNextSignal?.();
  };

  if (isVip) {
    return (
      <motion.div 
        animate={{ scale: boxScale }}
        transition={{ type: 'spring', damping: 25 }}
        className="relative z-[100] flex flex-col items-center pointer-events-auto origin-center"
      >
        <div className="relative p-10 rounded-[45px] bg-gradient-to-b from-[#141526] to-[#050512] backdrop-blur-3xl border-2 border-amber-500/40 shadow-[0_0_100px_rgba(245,158,11,0.35)] flex flex-col items-center min-w-[340px] ring-1 ring-white/10">
          {/* VIP Badge */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-7 py-2 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full shadow-2xl shadow-amber-500/50 border border-amber-300/50 flex items-center gap-2 whitespace-nowrap">
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
            <span className="text-[13px] font-black text-white uppercase tracking-wider">Nahid Aviator Hack</span>
          </div>

          {/* Zoom Controller */}
          <div className="absolute top-6 right-4 flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity z-50">
            <button 
              onClick={() => setBoxScale(prev => Math.max(0.4, prev - 0.1))}
              className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-lg text-white text-xs font-bold border border-white/5 hover:bg-white/20"
            >
              -
            </button>
            <button 
              onClick={() => setBoxScale(prev => Math.min(2.5, prev + 0.1))}
              className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-lg text-white text-xs font-bold border border-white/5 hover:bg-white/20"
            >
              +
            </button>
          </div>

          {/* Header */}
          <div className="mt-6 mb-8 text-center space-y-1">
            <h2 className="text-amber-500 font-black text-[16px] tracking-[0.3em] uppercase leading-none italic opacity-95 whitespace-nowrap">
              NAHID AVIATOR HACK
            </h2>
            <p className="text-white/30 text-[9px] uppercase tracking-widest font-black">Neural Engine v4.2</p>
          </div>

          {/* Main Circle Display */}
          <div className="relative w-56 h-56 mb-10 transition-transform duration-500 scale-105">
            {/* Pulsing Outer Rigns */}
            <div className="absolute inset-[-14px] rounded-full border border-amber-500/20 animate-pulse duration-[3px]" />
            <div className="absolute inset-[-28px] rounded-full border border-amber-500/10 animate-pulse duration-[4s] delay-700" />
            
            {/* Outer ring glow */}
            <div className="absolute inset-[-10px] rounded-full bg-amber-500/5 blur-[30px]" />
            
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/40 flex items-center justify-center overflow-hidden bg-black/70 shadow-[inset_0_0_50px_rgba(0,0,0,0.9)]">
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(245,158,11,0.08)_50%,transparent_100%)] bg-[length:100%_8px] animate-[scan_1.2s_linear_infinite]" />
              
              <div className="flex flex-col items-center justify-center h-full w-full relative z-10">
                {isAnalyzing && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0b1e]/90 backdrop-blur-md">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mb-6 shadow-[0_0_30px_rgba(245,158,11,0.7)]"
                    />
                    <span className="text-sm font-black text-amber-500 animate-pulse tracking-[0.3em] uppercase">
                      Analyzing...
                    </span>
                  </div>
                )}
                
                <div className="flex flex-col items-center">
                  <span className="text-xs font-black text-amber-500/60 uppercase tracking-[0.3em] mb-4">Target Multiplier</span>
                  <motion.span 
                    key={signal}
                    initial={{ scale: 0.5, opacity: 0, filter: 'blur(15px)' }}
                    animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                    transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                    className="text-7xl font-mono font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] tracking-tighter"
                  >
                    {signal || "---"}
                  </motion.span>
                  <div className="h-1.5 w-16 bg-amber-500/50 mt-6 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                </div>
              </div>
            </div>
            
            {/* Decoration SVG */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-amber-500/30" strokeDasharray="1.5 2.5" />
            </svg>
          </div>

          {/* Buttons Row */}
          <div className="flex flex-col gap-6 w-full pt-4">
            <button
              onClick={handleNext}
              disabled={isAnalyzing}
              className={cn(
                "w-full h-20 rounded-[25px] font-black text-xl uppercase tracking-[0.2em] transition-all active:scale-95 border-2 group relative overflow-hidden",
                isAnalyzing 
                  ? "bg-slate-900/50 cursor-not-allowed text-white/20 border-white/5" 
                  : "bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-amber-400/50 shadow-[0_15px_40px_rgba(245,158,11,0.5)]"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Next Signal
                <motion.span 
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-amber-200"
                >
                  ➔
                </motion.span>
              </span>
              {/* Ultra Shine */}
              {!isAnalyzing && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              )}
            </button>
          </div>
          
          <div className="w-full flex justify-between items-center mt-8 px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
              <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Secure Node 08</span>
            </div>
            <div className="flex gap-1">
              {[1,2,3,4].map(i => <div key={i} className="w-1 h-3 rounded-full bg-white/5" />)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100 h-[56px]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-gray-400 font-medium text-sm">P:</span>
          <span className="font-mono font-bold text-gray-800 text-base">
            {currentPeriod?.slice(-6) || "..."}
          </span>
        </div>
        
        <div className="relative w-9 h-9 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10.5"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1.5"
            />
            <circle
              cx="12"
              cy="12"
              r="10.5"
              fill="none"
              stroke="#2563eb"
              strokeWidth="1.8"
              strokeDasharray="65.97"
              strokeDashoffset={65.97 * (1 - progress / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <span className="relative font-mono font-bold text-xs text-gray-700">
            {secondsLeft}
          </span>
        </div>
      </div>

      <div className="flex items-center">
        {isActive ? (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs uppercase tracking-wider text-white transition-all shadow-sm",
              signal === "BIG" 
                ? "bg-red-500" 
                : "bg-green-500"
            )}
          >
            <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center border border-white/20">
              <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_4px_white]" />
            </div>
            {signal}
          </motion.div>
        ) : (
          <div className="px-4 py-2 rounded-full bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest animate-pulse border border-gray-100">
            WAITING...
          </div>
        )}
      </div>
    </div>
  );
};
