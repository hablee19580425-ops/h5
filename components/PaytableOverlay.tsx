
import React from 'react';
import { SYMBOLS, PAYLINES } from '../constants';
import { SymbolType } from '../types';
import { motion } from 'framer-motion';
import { X, Info, TrendingUp, Zap } from 'lucide-react';

interface Props {
  currentBet: number;
  onClose: () => void;
}

const PaytableOverlay: React.FC<Props> = ({ currentBet, onClose }) => {
  const symbolList = Object.values(SYMBOLS).sort((a, b) => b.multiplier[4] - a.multiplier[4]);
  const lineBet = currentBet / 20;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      className="absolute top-16 left-4 right-4 md:left-auto md:right-8 md:w-[450px] z-[60] bg-blue-950/95 backdrop-blur-2xl border-2 border-cyan-400/40 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
    >
      <div className="p-5 border-b border-cyan-400/20 flex justify-between items-center bg-cyan-400/5">
        <div className="flex items-center gap-2">
          <Info className="text-cyan-400 w-5 h-5" />
          <h2 className="text-xl font-arcade text-white tracking-widest uppercase">Paytable Guide</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <X className="text-slate-400 w-6 h-6" />
        </button>
      </div>

      <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
        {/* Rules Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-900/40 p-3 rounded-xl border border-blue-400/20">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-green-400" />
              <span className="text-[10px] font-black text-blue-300 uppercase">Paylines</span>
            </div>
            <p className="text-lg font-arcade text-white">20 Lines</p>
          </div>
          <div className="bg-blue-900/40 p-3 rounded-xl border border-blue-400/20">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-yellow-400" />
              <span className="text-[10px] font-black text-blue-300 uppercase">Line Bet</span>
            </div>
            <p className="text-lg font-arcade text-white">{(currentBet / 20).toLocaleString()}</p>
          </div>
        </div>

        {/* Symbol List */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-cyan-300 uppercase tracking-[0.2em] border-b border-cyan-400/10 pb-1">Symbol Multipliers</h3>
          {symbolList.map((sym) => (
            <div key={sym.type} className="flex items-center gap-4 group p-2 rounded-2xl hover:bg-white/5 transition-colors">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${sym.color} flex items-center justify-center text-3xl shadow-lg border border-white/20 group-hover:scale-110 transition-transform`}>
                {sym.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-bold text-white">{sym.label}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                    sym.type === SymbolType.SHARK ? 'bg-red-500 text-white animate-pulse' : 
                    sym.type === SymbolType.WHALE ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {sym.type === SymbolType.SHARK ? 'LEGENDARY' : sym.type === SymbolType.WHALE ? 'RARE' : 'COMMON'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center bg-black/30 rounded-lg p-1.5 border border-white/5">
                    <span className="block text-[8px] text-slate-500 uppercase font-black">3 Match</span>
                    <span className="text-xs font-arcade text-white">x{sym.multiplier[2]}</span>
                  </div>
                  <div className="text-center bg-black/30 rounded-lg p-1.5 border border-white/5">
                    <span className="block text-[8px] text-slate-500 uppercase font-black">4 Match</span>
                    <span className="text-xs font-arcade text-yellow-400">x{sym.multiplier[3]}</span>
                  </div>
                  <div className="text-center bg-black/30 rounded-lg p-1.5 border border-white/5">
                    <span className="block text-[8px] text-slate-500 uppercase font-black">5 Match</span>
                    <span className="text-xs font-arcade text-cyan-400 font-bold">x{sym.multiplier[4]}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calculation Logic */}
        <div className="bg-cyan-900/20 p-4 rounded-2xl border border-cyan-400/20 text-[11px] text-blue-200 space-y-2 italic">
          <p className="font-bold text-cyan-300">How to calculate your win:</p>
          <p>Winnings = (Total Bet ÷ 20 lines) × Symbol Multiplier</p>
          <p className="text-[10px] opacity-70">모든 당첨은 왼쪽 첫 번째 릴부터 연속해서 심볼이 나타나야 인정됩니다. 20개의 페이라인 중 가장 높은 당첨금만 지급됩니다.</p>
        </div>
      </div>
      
      <div className="p-4 bg-black/40 text-center">
        <button 
          onClick={onClose}
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-arcade rounded-xl transition-all active:scale-95 shadow-lg shadow-cyan-900/20"
        >
          CLOSE GUIDE
        </button>
      </div>
    </motion.div>
  );
};

export default PaytableOverlay;
