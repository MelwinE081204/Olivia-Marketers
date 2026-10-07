import React, { useRef, useState, useEffect } from 'react';
import { useRewards } from '../../context/RewardsContext';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Trophy, X, Coins, CheckCircle2 } from 'lucide-react';

interface ScratchCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScratchCardModal: React.FC<ScratchCardModalProps> = ({ isOpen, onClose }) => {
  const { scratchCardClaim } = useRewards();
  const { currentUser } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [rewardAmount, setRewardAmount] = useState<number | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsRevealed(false);
      setRewardAmount(null);
      setScratchedPercent(0);
      setTimeout(initCanvas, 50);
    }
  }, [isOpen]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw rich metallic gold scratch coating
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f59e0b');
    gradient.addColorStop(0.3, '#fbbf24');
    gradient.addColorStop(0.5, '#d97706');
    gradient.addColorStop(0.8, '#fef08a');
    gradient.addColorStop(1, '#b45309');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative texture & pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    for (let i = -width; i < width * 2; i += 24) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Text on scratch surface
    ctx.fillStyle = '#451a03';
    ctx.font = 'bold 15px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH TO REVEAL', width / 2, height / 2 - 10);
    ctx.font = '11px Plus Jakarta Sans, sans-serif';
    ctx.fillText('⚡ Olivia Rewards Lucky Card ⚡', width / 2, height / 2 + 15);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    setIsScratching(true);
    scratch(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching || isRevealed) return;
    scratch(e);
  };

  const handlePointerUp = () => {
    setIsScratching(false);
    checkScratchProgress();
  };

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
  };

  const checkScratchProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;
      const totalPixels = pixels.length / 4;

      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) {
          transparentPixels++;
        }
      }

      const percent = (transparentPixels / (totalPixels / 4)) * 100;
      setScratchedPercent(Math.min(100, Math.round(percent)));

      if (percent >= 35 && !isRevealed) {
        completeScratch();
      }
    } catch {
      // Fallback
    }
  };

  const completeScratch = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    const result = scratchCardClaim();
    setRewardAmount(result.pointsEarned);
  };

  if (!isOpen) return null;

  const hasCards = (currentUser?.scratchCardsAvailable || 0) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-800 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-2xl overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Card Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>OLIVIA GOLDEN SCRATCH CARD</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Scratch & Win Real Points
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {hasCards
              ? `You have ${currentUser?.scratchCardsAvailable} card(s) ready to scratch!`
              : 'No scratch cards remaining. Earn more by reaching 500-pt milestones!'}
          </p>
        </div>

        {hasCards ? (
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-amber-400/50 shadow-inner bg-slate-950 flex items-center justify-center select-none">
            {/* The hidden prize underneath */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 p-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-2 shadow-lg">
                <Trophy className="w-7 h-7 text-amber-400 animate-bounce" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                You Won
              </span>
              <div className="text-3xl font-extrabold text-white font-mono-nums flex items-baseline gap-1 my-1">
                +{rewardAmount || '???'} <span className="text-sm font-medium text-amber-300">POINTS</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Worth ₹{rewardAmount || '???'} in offline cash claims!
              </p>

              {isRevealed && (
                <div className="mt-3 flex items-center gap-1 text-emerald-400 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Added to your Passbook!
                </div>
              )}
            </div>

            {/* The Scratch Canvas */}
            <canvas
              ref={canvasRef}
              width={340}
              height={255}
              className={`absolute inset-0 w-full h-full cursor-pointer touch-none transition-opacity duration-300 ${
                isRevealed ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />
          </div>
        ) : (
          <div className="p-6 text-center bg-slate-950/60 rounded-xl border border-slate-800">
            <Coins className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-400 mb-4">
              Unlock a new Golden Scratch Card by scanning stock coils, maintaining your 7-day login streak, or hitting 500-pt volume milestones.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {/* Action Button */}
        {hasCards && (
          <div className="mt-4 flex flex-col gap-2">
            {!isRevealed ? (
              <button
                onClick={completeScratch}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Auto-Reveal Reward
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
              >
                Collect & Continue
              </button>
            )}

            {!isRevealed && scratchedPercent > 0 && (
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-150"
                  style={{ width: `${scratchedPercent}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
