
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SymbolType, GameState, WinLine, UserAccount } from './types';
import { SYMBOLS, INITIAL_BALANCE, DEFAULT_BET, REEL_COUNT, ROW_COUNT, SPIN_DURATION } from './constants';
import { generateReels, calculateWins, formatKoreanCurrency } from './services/gameLogic';
import Background from './components/Background';
import Reel from './components/Reel';
import JackpotOverlay from './components/JackpotOverlay';
import PaytableOverlay from './components/PaytableOverlay';
import WalletOverlay from './components/WalletOverlay';
import InstructionOverlay from './components/InstructionOverlay';
import AccountOverlay from './components/AccountOverlay';
import AuthScreen from './components/AuthScreen';
import AdminManagerPanel from './components/AdminManagerPanel';
import { Coins, Play, Zap, Info, RotateCcw, Wallet, Activity, Settings2, SlidersHorizontal, ChevronLeft, ChevronRight, BookOpen, HelpCircle, ShieldAlert, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [state, setState] = useState<GameState>({
    user: null,
    bet: DEFAULT_BET,
    reels: generateReels(100, 5),
    isSpinning: false,
    lastWin: 0,
    isAuto: false,
    showJackpot: null,
    winningIndices: [],
    rtp: 100,
    volatility: 5
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showPaytable, setShowPaytable] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = (freq: number, type: OscillatorType = 'sine', duration = 0.1, volume = 0.2) => {
    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  const updateUserInStorage = (user: UserAccount) => {
    const savedUsers = JSON.parse(localStorage.getItem('arcade_users') || '{}');
    savedUsers[user.id] = user;
    localStorage.setItem('arcade_users', JSON.stringify(savedUsers));
    setState(prev => ({ ...prev, user }));
  };

  const handleLogin = (user: UserAccount) => {
    setState(prev => ({ ...prev, user }));
    setShowInstructions(true);
    playSound(1000, 'sine', 0.2, 0.2);
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, user: null, isAuto: false }));
    setShowAccount(false);
    playSound(400, 'sine', 0.2, 0.1);
  };

  const handleSpin = useCallback(() => {
    if (!state.user || state.isSpinning || state.user.balance < state.bet) {
      if (!state.isSpinning && state.user && state.user.balance < state.bet) {
        setShowWallet(true);
        playSound(200, 'square', 0.2);
      }
      return;
    }

    // Deduct bet from local state and DB
    const updatedUser = { ...state.user, balance: state.user.balance - state.bet };
    updateUserInStorage(updatedUser);

    setState(prev => ({ 
      ...prev, 
      isSpinning: true, 
      lastWin: 0,
      showJackpot: null,
      winningIndices: [] 
    }));
    playSound(440, 'sawtooth', 0.2); 

    setTimeout(() => {
      const newReels = generateReels(state.rtp, state.volatility);
      const wins = calculateWins(newReels, state.bet);
      const totalWin = wins.reduce((sum, win) => sum + win.amount, 0);
      const allWinningIndices = Array.from(new Set(wins.flatMap(w => w.indices)));
      
      let jackpotType: 'SHARK' | 'WHALE' | 'NORMAL' | null = null;
      if (wins.some(w => w.type === SymbolType.SHARK && w.count === 5)) jackpotType = 'SHARK';
      else if (wins.some(w => w.type === SymbolType.WHALE && w.count === 5)) jackpotType = 'WHALE';
      else if (totalWin > state.bet * 10) jackpotType = 'NORMAL';

      // Update winnings in Storage
      if (state.user) {
        const latestUsers = JSON.parse(localStorage.getItem('arcade_users') || '{}');
        const latestUser = latestUsers[state.user.id];
        const finalUser = { ...latestUser, balance: latestUser.balance + totalWin };
        updateUserInStorage(finalUser);
      }

      setState(prev => ({
        ...prev,
        isSpinning: false,
        reels: newReels,
        lastWin: totalWin,
        showJackpot: jackpotType,
        winningIndices: allWinningIndices
      }));

      if (totalWin > 0) {
        playSound(880, 'sine', 0.5, 0.4); 
      } else {
        playSound(220, 'square', 0.1); 
      }
    }, SPIN_DURATION);
  }, [state.isSpinning, state.user, state.bet, state.rtp, state.volatility]);

  const handleCoinIn = (amount: number) => {
    if (!state.user) return;
    const updatedUser = { ...state.user, balance: state.user.balance + amount };
    updateUserInStorage(updatedUser);
    playSound(1200, 'sine', 0.2, 0.3);
  };

  const handleCashOut = () => {
    if (!state.user || state.user.balance <= 0) return;
    playSound(400, 'square', 0.5, 0.5);
    const updatedUser = { ...state.user, balance: 0 };
    updateUserInStorage(updatedUser);
    setShowWallet(false);
  };

  useEffect(() => {
    if (state.isAuto && !state.isSpinning && !state.showJackpot) {
      const timer = setTimeout(handleSpin, 800);
      return () => clearTimeout(timer);
    }
  }, [state.isAuto, state.isSpinning, state.showJackpot, handleSpin]);

  const closeAllOverlays = () => {
    setShowSettings(false);
    setShowPaytable(false);
    setShowWallet(false);
    setShowInstructions(false);
    setShowAccount(false);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col bg-black text-white">
      <Background />

      {/* Admin Manager Mode (Overlays everything) */}
      <AnimatePresence>
        {isAdminMode && (
          <AdminManagerPanel onBackToLogin={() => setIsAdminMode(false)} />
        )}
      </AnimatePresence>

      {!state.user ? (
        <AuthScreen onLogin={handleLogin} onOpenAdmin={() => setIsAdminMode(true)} />
      ) : (
        <>
          {/* Header */}
          <div className="relative z-10 flex-shrink-0 flex justify-between items-start p-4 md:px-8 md:py-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-4xl font-arcade text-cyan-400 italic tracking-tighter drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                  DEEP SEA ARCADE
                </h1>
              </div>
              <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
                 <span className="text-[8px] md:text-[10px] bg-blue-600/50 text-blue-100 px-1.5 py-0.5 rounded border border-blue-400/30 font-bold uppercase">
                   RTP {state.rtp}%
                 </span>
                 <div className="flex gap-1">
                   <button onClick={() => { closeAllOverlays(); setShowSettings(!showSettings); }}
                     className={`text-[8px] md:text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 transition-all ${showSettings ? 'bg-cyan-400 text-black border-cyan-400' : 'bg-white/10 hover:bg-white/20 text-white border-white/20'}`}>
                     <SlidersHorizontal size={8} /> SETTINGS
                   </button>
                   <button onClick={() => { closeAllOverlays(); setShowPaytable(!showPaytable); }}
                     className={`text-[8px] md:text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 transition-all ${showPaytable ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white/10 hover:bg-white/20 text-white border-white/20'}`}>
                     <BookOpen size={8} /> PAYS
                   </button>
                   <button onClick={() => { closeAllOverlays(); setShowInstructions(!showInstructions); }}
                     className={`text-[8px] md:text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 transition-all ${showInstructions ? 'bg-green-400 text-black border-green-400' : 'bg-white/10 hover:bg-white/20 text-white border-white/20'}`}>
                     <HelpCircle size={8} /> GUIDE
                   </button>
                 </div>
              </div>
              
              <AnimatePresence>
                {showSettings && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-3 bg-blue-900/80 backdrop-blur-md border border-cyan-400/30 rounded-xl w-64 overflow-hidden shadow-2xl z-50">
                    <div className="space-y-3">
                      <div>
                        <label className="text-[8px] font-black text-cyan-300 uppercase block mb-1">RTP: {state.rtp}%</label>
                        <input type="range" min="50" max="200" step="5" value={state.rtp} onChange={(e) => setState(p => ({ ...p, rtp: parseInt(e.target.value) }))} className="w-full h-1 bg-blue-950 rounded-lg appearance-none accent-cyan-400" />
                      </div>
                      <div>
                        <label className="text-[8px] font-black text-pink-300 uppercase block mb-1">Vol: {state.volatility}</label>
                        <input type="range" min="1" max="10" step="1" value={state.volatility} onChange={(e) => setState(p => ({ ...p, volatility: parseInt(e.target.value) }))} className="w-full h-1 bg-blue-950 rounded-lg appearance-none accent-pink-500" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => { closeAllOverlays(); setShowAccount(!showAccount); }} className="flex items-center gap-4 group active:scale-95 transition-transform">
              <div className="text-right">
                <div className="text-[10px] text-blue-300 uppercase font-black leading-none group-hover:text-cyan-400 transition-colors">ID: {state.user.id}</div>
                <div className="text-xl md:text-3xl font-arcade text-yellow-400">
                   {formatKoreanCurrency(state.user.balance)}
                </div>
              </div>
              <div className={`p-2 bg-blue-500/20 border border-blue-500/50 rounded-full transition-all ${showAccount ? 'scale-110 bg-cyan-500 text-black shadow-[0_0_15px_#22d3ee]' : 'group-hover:bg-blue-500/40 text-cyan-400'}`}>
                 <User className="w-6 h-6" />
              </div>
            </button>
          </div>

          <AnimatePresence>
            {showInstructions && <InstructionOverlay onClose={() => setShowInstructions(false)} />}
            {showPaytable && <PaytableOverlay currentBet={state.bet} onClose={() => setShowPaytable(false)} />}
            {showWallet && <WalletOverlay balance={state.user.balance} onCoinIn={handleCoinIn} onCashOut={handleCashOut} onClose={() => setShowWallet(false)} />}
            {showAccount && <AccountOverlay user={state.user} onCoinIn={handleCoinIn} onCashOut={handleCashOut} onLogout={handleLogout} onClose={() => setShowAccount(false)} />}
          </AnimatePresence>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 overflow-hidden gap-2">
            <div className="w-full max-w-5xl flex-1 max-h-[60vh] md:max-h-[65vh] bg-blue-950/60 border-4 border-blue-400/50 rounded-3xl shadow-[0_0_30px_rgba(59,130,246,0.3)] grid grid-cols-5 gap-0 overflow-hidden relative backdrop-blur-md my-auto">
               {[...Array(REEL_COUNT)].map((_, i) => (
                 <Reel key={i} columnIndex={i} symbols={state.reels[i]} isSpinning={state.isSpinning} delay={i * 0.1} winningIndices={state.winningIndices} />
               ))}
            </div>
          </div>

          <div className="relative z-10 flex-shrink-0 p-4 md:px-8 md:pb-6 bg-gradient-to-t from-black via-black/90 to-transparent">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center md:justify-start gap-1">
                  {[100, 200, 1000].map(amount => (
                    <button key={amount} onClick={() => { setState(prev => ({ ...prev, bet: amount })); playSound(600, 'sine', 0.05); }}
                      className={`px-3 py-1.5 rounded border font-arcade text-[10px] transition-all ${state.bet === amount ? 'bg-cyan-500 border-cyan-300 text-white shadow-[0_0_10px_rgba(6,182,212,0.6)]' : 'bg-blue-900/40 border-blue-400/30 text-blue-300 hover:bg-blue-800/60'}`}>
                      {amount}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 bg-blue-900/40 p-1.5 rounded-xl border border-blue-400/30">
                  <button onClick={() => setState(prev => ({ ...prev, bet: Math.max(100, prev.bet - 100) }))} className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center border border-blue-400/30"><ChevronLeft size={16} /></button>
                  <div className="text-center px-2 min-w-[100px]"><div className="text-[8px] text-blue-300 font-black uppercase">Bet</div><div className="text-xl font-arcade text-white leading-none">{state.bet.toLocaleString()}</div></div>
                  <button onClick={() => setState(prev => ({ ...prev, bet: prev.bet + 100 }))} className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center border border-blue-400/30"><ChevronRight size={16} /></button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button disabled={state.isSpinning} onClick={() => setState(prev => ({ ...prev, isAuto: !prev.isAuto }))}
                  className={`px-4 py-2 rounded-full font-black text-xs md:text-sm border-2 transition-all ${state.isAuto ? 'bg-red-600 border-red-400 shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse' : 'bg-slate-700 border-slate-500 text-slate-300'}`}>
                  {state.isAuto ? 'STOP AUTO' : 'AUTO'}
                </button>
                <button disabled={state.isSpinning} onClick={handleSpin}
                  className={`relative group w-24 h-24 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center transition-all active:scale-95 border-4 ${state.isSpinning ? 'bg-slate-800 border-slate-700 cursor-not-allowed opacity-50' : 'bg-gradient-to-tr from-cyan-600 to-blue-400 border-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.5)]'}`}>
                  <Play className={`w-8 h-8 md:w-10 md:h-10 text-white fill-current ${state.isSpinning ? 'animate-pulse' : ''}`} />
                  <span className="font-arcade text-sm md:text-lg mt-1">SPIN</span>
                </button>
              </div>

              <div className="min-w-[180px] text-center md:text-right">
                <div className="text-[10px] text-blue-300 font-black uppercase tracking-widest">Win</div>
                <div className={`text-3xl md:text-5xl font-arcade transition-all ${state.lastWin > 0 ? 'text-yellow-400 drop-shadow-[0_0_10px_#facc15]' : 'text-slate-600'}`}>{state.lastWin > 0 ? `+${state.lastWin.toLocaleString()}` : '0'}</div>
              </div>
            </div>
          </div>

          <JackpotOverlay type={state.showJackpot} amount={state.lastWin} onComplete={() => setState(prev => ({ ...prev, showJackpot: null }))} />

          <AnimatePresence>
            {state.user.balance > 1000000000 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-blue-600/90 flex flex-col items-center justify-center">
                <h2 className="text-5xl md:text-7xl font-arcade mb-8">축 환 전 !!</h2>
                <p className="text-2xl font-bold mb-4">{formatKoreanCurrency(state.user.balance)}</p>
                <button onClick={() => handleLogout()} className="px-10 py-4 bg-white text-blue-600 font-black text-xl rounded-xl">다시하기</button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <div className="fixed bottom-1 right-2 text-[8px] text-blue-300/30 pointer-events-none uppercase font-black">
        Deep Sea Arcade v4.5 // Centralized-Admin-Database-System
      </div>
    </div>
  );
};

export default App;
