
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShieldCheck, Coins, ArrowRightLeft, User, LogOut, TrendingUp, Wallet } from 'lucide-react';
import { formatKoreanCurrency } from '../services/gameLogic';
import { UserAccount } from '../types';

interface Props {
  user: UserAccount;
  onCoinIn: (amount: number) => void;
  onCashOut: () => void;
  onLogout: () => void;
  onClose: () => void;
}

const AccountOverlay: React.FC<Props> = ({ user, onCoinIn, onCashOut, onLogout, onClose }) => {
  const [amountInput, setAmountInput] = useState('10000');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      className="absolute top-16 right-4 left-4 md:left-auto md:right-8 md:w-[450px] z-[80] bg-slate-950/95 backdrop-blur-3xl border-2 border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden"
    >
      <div className="p-5 border-b border-white/10 flex justify-between items-center bg-cyan-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <User className="text-black" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-arcade text-white leading-none">{user.id}</h2>
            <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">Active Member</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="text-slate-400" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Balance Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-900/40 p-4 rounded-2xl border border-blue-400/20">
            <span className="block text-[8px] font-black text-blue-300 uppercase mb-1">Total Credits</span>
            <div className="text-2xl font-arcade text-yellow-400">{user.balance.toLocaleString()}</div>
          </div>
          <div className="bg-blue-900/40 p-4 rounded-2xl border border-blue-400/20">
            <span className="block text-[8px] font-black text-blue-300 uppercase mb-1">Real Value</span>
            <div className="text-xs font-bold text-white mt-2">{formatKoreanCurrency(user.balance)}</div>
          </div>
        </div>

        {/* Banking Operations */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-cyan-300 uppercase tracking-[0.2em] border-b border-white/5 pb-1 flex items-center gap-2">
            <Wallet size={12} /> BANKING TERMINAL
          </h3>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-arcade focus:border-cyan-500/50 outline-none transition-all"
            />
            <button 
              onClick={() => onCoinIn(parseInt(amountInput) || 0)}
              className="px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl flex items-center gap-2 transition-all active:scale-95"
            >
              <Coins size={18} /> CHARGE
            </button>
          </div>

          <button 
            onClick={onCashOut}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <ArrowRightLeft className="text-yellow-400" size={20} />
            <span className="text-sm font-bold text-white uppercase">Withdraw Credits</span>
          </button>
        </div>

        {/* Account Info */}
        <div className="text-[10px] text-slate-500 italic text-center">
          회원 가입일: {new Date(user.createdAt).toLocaleDateString()} // Deep Sea Arcade ID Verified
        </div>
      </div>
      
      <div className="p-4 bg-black/40 flex gap-2">
        <button 
          onClick={onLogout}
          className="flex-1 py-3 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 font-arcade rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <LogOut size={16} /> EXIT ACCOUNT
        </button>
      </div>
    </motion.div>
  );
};

export default AccountOverlay;
