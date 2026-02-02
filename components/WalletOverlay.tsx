
import React from 'react';
import { motion } from 'framer-motion';
import { X, Wallet, PlusCircle, ArrowDownCircle, Landmark } from 'lucide-react';
import { formatKoreanCurrency } from '../services/gameLogic';

interface Props {
  balance: number;
  onCoinIn: (amount: number) => void;
  onCashOut: () => void;
  onClose: () => void;
}

const WalletOverlay: React.FC<Props> = ({ balance, onCoinIn, onCashOut, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="absolute inset-x-4 top-24 md:left-auto md:right-8 md:w-[400px] z-[70] bg-slate-900/95 backdrop-blur-3xl border-2 border-yellow-500/40 rounded-[2.5rem] shadow-[0_0_60px_rgba(234,179,8,0.2)] overflow-hidden"
    >
      <div className="p-6 border-b border-yellow-500/20 flex justify-between items-center bg-yellow-500/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-xl">
            <Landmark className="text-yellow-400 w-5 h-5" />
          </div>
          <h2 className="text-xl font-arcade text-white tracking-widest uppercase">Arcade Bank</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="text-slate-400 w-6 h-6" />
        </button>
      </div>

      <div className="p-8 space-y-8">
        {/* Current Balance Display */}
        <div className="text-center space-y-2 py-4 bg-black/40 rounded-3xl border border-white/5 shadow-inner">
          <span className="text-[10px] font-black text-yellow-500/60 uppercase tracking-[0.3em]">Current Credits</span>
          <div className="text-4xl font-arcade text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
            {balance.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 font-bold">
            {formatKoreanCurrency(balance)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => onCoinIn(10000)}
            className="group relative flex items-center justify-between p-5 bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl border border-green-400/30 shadow-lg hover:brightness-110 active:scale-95 transition-all overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <PlusCircle className="w-8 h-8 text-white" />
              <div className="text-left">
                <span className="block text-xs font-black text-green-100 uppercase opacity-70">Coin In</span>
                <span className="text-xl font-arcade text-white">+10,000 코인</span>
              </div>
            </div>
            <div className="absolute right-[-10%] opacity-10 group-hover:scale-125 transition-transform">
               <Wallet size={80} />
            </div>
          </button>

          <button 
            onClick={onCashOut}
            disabled={balance <= 0}
            className={`group relative flex items-center justify-between p-5 rounded-2xl border shadow-lg active:scale-95 transition-all overflow-hidden ${
              balance > 0 
                ? 'bg-gradient-to-r from-red-600 to-orange-500 border-red-400/30 hover:brightness-110' 
                : 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-4">
              <ArrowDownCircle className="w-8 h-8 text-white" />
              <div className="text-left">
                <span className="block text-xs font-black text-red-100 uppercase opacity-70">Withdraw</span>
                <span className="text-xl font-arcade text-white">전액 환전</span>
              </div>
            </div>
            <div className="absolute right-[-10%] opacity-10 group-hover:scale-125 transition-transform">
               <Landmark size={80} />
            </div>
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-500 uppercase font-bold tracking-tighter">
          * 실제 금전이 아닌 게임 내 시뮬레이션 머니입니다.
        </p>
      </div>
      
      <div className="p-4 bg-black/40 flex gap-2">
        <button 
          onClick={onClose}
          className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-arcade rounded-2xl transition-all"
        >
          BACK TO GAME
        </button>
      </div>
    </motion.div>
  );
};

export default WalletOverlay;
