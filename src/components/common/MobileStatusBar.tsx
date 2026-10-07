import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Sparkles } from 'lucide-react';

interface MobileStatusBarProps {
  appName?: string;
}

export const MobileStatusBar: React.FC<MobileStatusBarProps> = () => {
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = d.getHours();
      const minutes = d.getMinutes();
      const formatted = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes}`;
      setTimeStr(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-950/95 text-slate-300 px-6 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-semibold select-none z-50">
      {/* Time */}
      <span className="font-mono tracking-tight font-bold text-white text-xs">
        {timeStr}
      </span>

      {/* Dynamic Island Pill */}
      <div className="h-5 px-3 bg-black border border-slate-800 rounded-full flex items-center justify-center gap-1.5 shadow-inner">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
          OLIVIA
        </span>
      </div>

      {/* Status Icons */}
      <div className="flex items-center gap-1.5 text-slate-400">
        {/* Cellular Signal Bars */}
        <div className="flex items-end gap-0.5 h-2.5">
          <div className="w-0.5 h-1 bg-white rounded-xs" />
          <div className="w-0.5 h-1.5 bg-white rounded-xs" />
          <div className="w-0.5 h-2 bg-white rounded-xs" />
          <div className="w-0.5 h-2.5 bg-white rounded-xs" />
        </div>
        <span className="text-[9px] font-bold text-slate-400 font-mono">5G</span>
        <Wifi className="w-3 h-3 text-slate-300" />
        <div className="flex items-center gap-0.5">
          <div className="w-4 h-2.5 border border-slate-400 rounded-xs p-0.5 flex items-center">
            <div className="w-2.5 h-1.5 bg-emerald-400 rounded-xs" />
          </div>
          <div className="w-0.5 h-1 bg-slate-400 rounded-r-xs" />
        </div>
      </div>
    </div>
  );
};
